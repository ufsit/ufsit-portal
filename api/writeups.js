'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap
const db_mgmt = require('./db/db_mgmt.js');
const fs = require('fs');						// For filesystem I/O
const aws = require('aws-sdk');
const AWS_CREDENTIALS = process.env.aws || 'aws.json';
const aws_credentials = JSON.parse(fs.readFileSync(AWS_CREDENTIALS, 'utf8'));

// returns a list of writeups the user has submitted
routes.get('/writeups/submitted', async (req, res) => {
  const list = await db_mgmt.get_writeup_submissions(req.session.account_id);
  res.status(200).send(list);
});

// returns a writeup
routes.get('/writeups/get/:ctfName/:challengeName/:fileName', async (req, res) => {
  // configure s3
  const s3 = new aws.S3({
    region: aws_credentials.region,
    accessKeyId: aws_credentials.accessKeyId,
    secretAccessKey: aws_credentials.secretAccessKey,
    Bucket: aws_credentials.s3Bucket,
  });

  // configure the parameters
  const params = {
    Bucket: aws_credentials.s3Bucket,
    Key: 'writeups/' + req.params.ctfName + '/' + req.params.challengeName
          + '/' + req.params.fileName,
  };

  // get the writeup
  s3.getObject(params, (err, data) => {
    // if the writeup doesn't exist, send an error
    if (err) {
      res.status(500).send(err);
    // otherwise, return the writeup
    } else {
      res.status(200).json({
        ctfName: req.params.ctfName,
        challengeName: req.params.challengeName,
        text: data.Body.toString()});
    }
  });
});

// returns a writeup image
routes.get('/writeups/images/:fileName', async (req, res) => {
  // configure s3
  const s3 = new aws.S3({
    region: aws_credentials.region,
    accessKeyId: aws_credentials.accessKeyId,
    secretAccessKey: aws_credentials.secretAccessKey,
    Bucket: aws_credentials.s3Bucket,
  });

  // configure the parameters
  const params = {
    Bucket: aws_credentials.s3Bucket,
    Key: 'writeups/images/' + req.params.fileName,
  };

  // pipe the image back
  s3.getObject(params).createReadStream().pipe(res);
});

module.exports = routes;
