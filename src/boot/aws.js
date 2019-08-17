// import something here
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

export default ({ Vue /* app, router, Vue, ... */ }) => {

 Vue.prototype.$s3 = s3;
}

export { s3 }
