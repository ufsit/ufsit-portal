'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap
const db_mgmt = require('./db/db_mgmt.js');
const util = require.main.require('./util');
const aws = require('aws-sdk');
const aws_credentials = util.load_aws();

// returns a list of writeups the user has submitted
routes.get('/writeups/submitted', async (req, res) => {
  const list = await db_mgmt.get_writeup_submissions(req.session.account_id);
  res.status(200).send(list);
});

// returns a writeup
routes.get('/writeups/get/:key', async (req, res) => {
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
    Key: decodeURIComponent(req.params.key),
  };

  // get the writeup
  s3.getObject(params, async (err, data) => {
    // if the writeup doesn't exist, send an error
    if (err) {
      res.status(500).send(err);
    // otherwise, return the writeup
    } else {
      const dbEntry = await db_mgmt.get_writeup(req.params.key);
      res.status(200).json({
        name: dbEntry[0].name,
        text: data.Body.toString()});
    }
  });
});

// returns a list of files the user has submitted
routes.get('/writeups/files/uploaded', async (req, res) => {
  const list = await db_mgmt.get_file_uploads(req.session.account_id);
  res.status(200).send(list);
});

// returns a writeup file
routes.get('/writeups/files/:fileName', async (req, res) => {
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
    Key: 'writeups/files/' + req.params.fileName,
  };

  // pipe the file back
  s3.getObject(params).createReadStream().pipe(res);
});

module.exports = routes;
