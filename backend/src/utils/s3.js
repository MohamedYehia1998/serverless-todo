import AWS from 'aws-sdk';

const S3 = new AWS.S3({
  signatureVersion: 'v4',
  region: process.env.REGION,
  params: { Bucket: process.env.TODOS_BUCKET },
});

export default S3;
