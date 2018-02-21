'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap
const fs = require('fs');						// For filesystem I/O
const aws = require('aws-sdk');
const AWS_CREDENTIALS = process.env.aws || 'aws.json';
const aws_credentials = JSON.parse(fs.readFileSync(AWS_CREDENTIALS, 'utf8'));

routes.get('/upload/sign', (req, res)=>{
  const s3 = new aws.S3({
    region: aws_credentials.region,
    accessKeyId: aws_credentials.accessKeyId,
    secretAccessKey: aws_credentials.secretAccessKey,
    Bucket: aws_credentials.s3Bucket,
  });
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: aws_credentials.s3Bucket,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read',
  };

  s3.createPresignedPost(s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${aws_credentials.s3Bucket}.s3.amazonaws.com/${fileName}`,
    };
    res.status(200).write(JSON.stringify(returnData));
    res.end();
  });
  /* s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${aws_credentials.s3Bucket}.s3.amazonaws.com/${fileName}`,
    };
    res.status(200).write(JSON.stringify(returnData));
    res.end();

  });*/
});

routes.post('/upload/writeup', (req, res)=>{
  const s3 = new aws.S3({
    region: aws_credentials.region,
    accessKeyId: aws_credentials.accessKeyId,
    secretAccessKey: aws_credentials.secretAccessKey,
    Bucket: aws_credentials.s3Bucket,
  });

  const params = {
    Body: req.body.data,
    Bucket: aws_credentials.s3Bucket,
    Key: 'writeups/' + req.body.ctfName + '/'
          + req.body.challengeName + '/'
          + req.account.full_name,
  };
  s3.putObject(params, (err, data) => {
    if (err) {
      console.log(err);
    }
    console.log(data);
  });

  res.status(200).end();
});

module.exports = routes;
