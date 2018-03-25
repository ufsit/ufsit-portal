'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap
const db_mgmt = require('./db/db_mgmt.js');
const util = require.main.require('./util');
const aws = require('aws-sdk');
const aws_credentials = util.load_aws();

// returns a user's resume link
routes.get('/resume/link', async (req, res) => {
  const result = await db_mgmt.get_resume_key(req.session.account_id);
  let key = '';
  if (result.length > 0) {
    key = result[0];
  }
  res.status(200).json(key);
});

// returns a user's resume
routes.get('/resume', async (req, res) => {
  // configure s3
  const s3 = new aws.S3({
    region: aws_credentials.region,
    accessKeyId: aws_credentials.accessKeyId,
    secretAccessKey: aws_credentials.secretAccessKey,
    Bucket: aws_credentials.s3Bucket,
  });

  const result = await db_mgmt.get_resume_key(req.session.account_id);
  let key = '';
  if (result.length === 0 || result[0].resume === '') {
    res.status(200).json('no resume');
  }
  key = result[0].resume;
  // configure the parameters
  const params = {
    Bucket: aws_credentials.s3Bucket,
    Key: key,
  };

  // get the writeup
  s3.getObject(params /* , async (err, data) => {
    // if the writeup doesn't exist, send an error
    if (err) {
      res.status(500).send(err);
    // otherwise, return the writeup
    } else {
      res.status(200).json({
        text: data.Body.toString()});
    }
  }*/).createReadStream().pipe(res);
});

module.exports = routes;
