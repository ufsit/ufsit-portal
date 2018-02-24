'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap
const fs = require('fs');						// For filesystem I/O
const aws = require('aws-sdk');
const AWS_CREDENTIALS = process.env.aws || 'aws.json';
const aws_credentials = JSON.parse(fs.readFileSync(AWS_CREDENTIALS, 'utf8'));
const db_mgmt = require('./db/db_mgmt.js');

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

routes.post('/upload/writeup', async (req, res) => {
  const s3 = new aws.S3({
    region: aws_credentials.region,
    accessKeyId: aws_credentials.accessKeyId,
    secretAccessKey: aws_credentials.secretAccessKey,
    Bucket: aws_credentials.s3Bucket,
  });

  const params = {
    Bucket: aws_credentials.s3Bucket,
    Key: 'writeups/' + req.body.ctfName + '/'
          + req.body.challengeName + '/'
          + req.session.account_id + '.md',
  };

  // check if the user is updating an old submission
  s3.getObject(params, async (err, data) => {
    if (err) {
      // if the file does not exist, then the writeup is a new submission
      // we need to award the user points accordingly
      // and record the new submission in the database
      console.log(err);
      if (err.code === 'NoSuchKey') {
        await db_mgmt.record_writeup_submission(req.session.account_id, params.Key);
        // TODO: award the user points
      } else {
        res.status(err.statusCode).send(err);
      }
    }
  });

  // add the file data to the params
  params.Body = req.body.data;

  // store the file in S3
  s3.putObject(params, (err, data) => {
    if (err) {
      res.status(err.statusCode).send(err);
    }
    res.status(200).end();
  });
});


module.exports = routes;
