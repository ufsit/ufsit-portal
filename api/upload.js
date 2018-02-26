'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap
const fs = require('fs');						// For filesystem I/O
const aws = require('aws-sdk');
const AWS_CREDENTIALS = process.env.aws || 'aws.json';
const aws_credentials = JSON.parse(fs.readFileSync(AWS_CREDENTIALS, 'utf8'));
const db_mgmt = require('./db/db_mgmt.js');
const util = require('../util/index.js');

// upload a writeup
routes.post('/upload/writeup', async (req, res) => {
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
    
    // add the file data to the params
    params.Body = req.body.data;

    // store the file in S3
    s3.putObject(params, (err, data) => {
      if (err) {
        // if an error occurred, return the error
        res.status(err.statusCode).send(err);
      }
      res.status(200).end();
    });
  });
});

// upload an image
routes.get('/upload/image', async (req, res) => {
  // get the file name, type, and extension
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const fileExt = '.' + fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2);

  let prefix = 'writeups/images/';
  // hash the name
  let name = util.md5(fileName);

  // configure s3
  const s3 = new aws.S3({
    region: aws_credentials.region,
    accessKeyId: aws_credentials.accessKeyId,
    secretAccessKey: aws_credentials.secretAccessKey,
    Bucket: aws_credentials.s3Bucket,
  });

  // wait until we find an unused file name
  await getUnusedName(req, res, s3, prefix, name, fileType, fileExt);
});

// finds an unused file name and returns a signed url to upload to a file
async function getUnusedName(req, res, s3, prefix, name, fileType, fileExt) {
  let key = prefix + name + fileExt;
  // check if the file name is already used
  s3.headObject({Bucket: aws_credentials.s3Bucket, Key: key}, async (err, data) => {
    if (err) {
      // if it is not, get a signed url and record the image upload
      if (err.code === 'NotFound') {
        let url = getSignedUrl(key, fileType);
        await db_mgmt.record_image_upload(req.session.account_id, key);
        res.status(200).json({url: url, key: key});
      // if some other error occurred, return the error
      } else {
        res.status(500).send(err);
      }
    // if the name is already being used, rehash the name for a new name and repeat
    } else {
      name = util.md5(name);
      getUnusedName(req, res, s3, prefix, name, fileType, fileExt);
    }
  });
}

// gets a signed url to which a user can upload a file
function getSignedUrl(key, fileType) {
  // configure s3
  const s3 = new aws.S3({
    region: aws_credentials.region,
    accessKeyId: aws_credentials.accessKeyId,
    secretAccessKey: aws_credentials.secretAccessKey,
    Bucket: aws_credentials.s3Bucket,
    Key: key,
  });

  // configure the parameters
  const params = {
    Bucket: aws_credentials.s3Bucket,
    Key: key,
    Expires: 60,
    ContentType: fileType,
    ACL: 'private',
  };

  // return the signed url
  return s3.getSignedUrl('putObject', params);
}


module.exports = routes;
