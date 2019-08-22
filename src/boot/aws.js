// import something here
import AWS from 'aws-sdk'

const region = process.env.REGION;
const identityPoolId = process.env.IDENTITY_POOL;
const bucket = process.env.BUCKET;

AWS.config.region = region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: identityPoolId
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: bucket}
});

export default ({ Vue /* app, router, Vue, ... */ }) => {

 Vue.prototype.$s3 = s3;
}

export { s3 }
