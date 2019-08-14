// import something here
import AWS from 'aws-sdk'

let region = 'eu-central-1';
let identityPoolId = 'eu-central-1:9db6d4e1-6350-451d-abad-6fdc69fa1bd1';
let bucket = 'spot-a-grandis';

export default ({ Vue /* app, router, Vue, ... */ }) => {
  AWS.config.region = region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId
  });

  const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: bucket}
  });

 Vue.prototype.$s3 = s3;
}
