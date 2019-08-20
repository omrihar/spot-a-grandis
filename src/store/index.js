import Vue from "vue";
import Vuex from "vuex";
import { LocalStorage, uid, date, Notify } from "quasar";

import AWS from 'aws-sdk'

const region = 'eu-central-1';
const identityPoolId = 'eu-central-1:9db6d4e1-6350-451d-abad-6fdc69fa1bd1';
const bucket = 'spot-a-grandis';

AWS.config.region = region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: identityPoolId
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: bucket}
});

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

function getDefault(item, value) {
  if (LocalStorage.has(item)) {
    return LocalStorage.getItem(item);
  }
  LocalStorage.set(item, value);
  return value;
}

function getPending() {
  return getDefault('pending', []);
}

function appendPending(report) {
  let pending = getPending();
  pending.push(report);
  LocalStorage.set('pending', pending);
  console.log('append to pending', report.filename)
}

function removeFromPending(report) {
  let pending = getPending();
  pending = pending.filter(r => r.filename != report.filename);
  LocalStorage.set('pending', pending);
  console.log('remove from pending', report.filename);
}

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      reports: getDefault('reports', []),
      user: getDefault('user', uid()),
    },

    mutations: {
      addReport (state, report) {
        state.reports = [...state.reports, report];
        LocalStorage.set('reports', state.reports);
      },

      markReportUploaded (state, report) {
        state.reports = state.reports.map(rep => {
          if (rep.filename === report.filename) {
            rep.uploaded = true;
          }
          return rep;
        });
      }
    },

    actions: {
      sendReport ({ commit, state, dispatch }, report) {
        report.user = state.user;
        report.report_time = date.formatDate(new Date(), 'YYYY-MM-DD HH:mm');
        report.filename = `${uid()}.json`;
        report.uploaded = false;
        commit('addReport', report);
        appendPending(report);
        dispatch('uploadReports');
      },

      uploadReport({ dispatch, state, commit }, report) {
        s3.upload({
          Key: `reports/${report.filename}`,
          Body: JSON.stringify(report),
          ACL: 'private',
          ContentType: 'application/json'
        }, (err, data) => {
          if (err) {
            console.log(`Failed to send report to server! ${err}`);
          } else {
            console.log('report uploaded successfully', report.filename);
            removeFromPending(report);
            commit('markReportUploaded', report);

          }
        });
      },

      uploadReports({ dispatch }) {
        let pending = getPending();
        let report;
        if (pending.length > 0) {
          console.log(`Attempting to upload ${pending.length} reports`);
        } else {
          console.log('No pending reports found to upload.')
        }
        while (pending.length > 0) {
          report = pending.pop();
          dispatch('uploadReport', report);
          console.log('uploading', report.filename);
        }
      },

      fetchReports({ dispatch, commit, getters }) {
        s3.listObjectsV2({
          Prefix: 'reports/'
        }, (err, data) => {
          if (err) {
            console.log(`Err fetching reports ${err}`);
          } else {
            data.Contents.forEach(report => {
              if (report.Key.endsWith('.json')) {
                let filename = report.Key.split("/")[1];
                let exists = getters.reportByFilename(filename);
                if (exists) {
                  commit('markReportUploaded', exists);
                } else {
                  s3.getObject({Key: report.Key}, (errRprt, dataRprt) => {
                    if (errRprt) {
                      console.log(`Error downloading ${report.Key}, ${errRprt}`);
                    } else {
                      let newReport = JSON.parse(dataRprt.Body.toString());
                      newReport.uploaded = true;
                      commit('addReport', newReport);
                    }
                  });
                }
              }
            });
          }
        });

      }
    },

    getters: {
      reportByFilename(state) {
        return (fileName) => {
          return state.reports.find(rep => rep.filename === fileName);
        }
      }
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  return Store;
}
