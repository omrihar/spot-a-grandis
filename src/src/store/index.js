import Vue from "vue";
import Vuex from "vuex";

// import example from './module-example'

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      reports: [{
        when: '2019-08-13 23:22',
        howMany: '1',
        coordinates: {lat: -20.250279813039555, lng: 57.674102783203125},
        image_path: 'images/159aacab-7847-1d77-f64c-2833946bfcb7.jpg',
        age: 'something',
        comment: 'Test hard-coded report'
      }],
    },

    mutations: {
      addReport (state, report) {
        state.reports = [...state.reports, report]
      }
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  return Store;
}
