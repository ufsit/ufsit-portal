'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap
const db_mgmt = require('./db/db_mgmt.js');
const util = require.main.require('./util');
const aws = require('aws-sdk');
const aws_credentials = util.load_aws();

// returns a list of writeups the user has submitted
routes.get('/writeups/submitted', async (req, res, next) => {
  let list = [];
  try {
    list = await db_mgmt.get_user_writeup_submissions(req.session.account_id);
  } catch (error) {
    return next(error);
  }
  res.status(200).send(list);
});

// returns a list of all submitted writeups
routes.get('/writeups/all', async (req, res, next) => {
  let list = [];
  try {
    list = await db_mgmt.get_all_writeup_submissions();
  } catch (error) {
    return next(error);
  }
  res.status(200).send(list);
});

// returns a writeup
routes.get('/writeups/get/:id', async (req, res) => {
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
    Key: 'writeups/' + req.params.id + '.md',
  };

  // get the writeup
  s3.getObject(params, async (err, data, next) => {
    // if the writeup doesn't exist, send an error
    if (err) {
      res.status(500).send('Error while getting writeup, please contact the developers.');
    // otherwise, return the writeup
    } else {
      let dbEntry = undefined;
      try {
        dbEntry = await db_mgmt.get_writeup(req.params.id);
      } catch (error) {
        return next(error);
      }

      if (dbEntry == undefined) {
        res.status(200).json({
          name: '',
          text: '',
          user_name: '',
        });
      }
      res.status(200).json({
        name: dbEntry[0].name,
        text: data.Body.toString(),
        user_name: dbEntry[0].full_name});
    }
  });
});

// returns a list of files the user has submitted
routes.get('/writeups/files/uploaded', async (req, res, next) => {
  let prefix = '/writeups/files/';
  let list = [];
  try {
    list = await db_mgmt.get_file_uploads(req.session.account_id);
  } catch (error) {
    next(error);
  }

  list.map( (value, index) => {
    let suffix = '.' + value.name.slice((value.name.lastIndexOf('.') - 1 >>> 0) + 2);
    list[index] = {key: prefix + value.id + suffix};
  });

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
