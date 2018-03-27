'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap
const util = require.main.require('./util');
const aws = require('aws-sdk');
const aws_credentials = util.load_aws();

const db_mgmt = require('./db/db_mgmt.js');

// upload a writeup
routes.post('/upload/writeup', async (req, res, next) => {
  // configure s3
  const s3 = new aws.S3({
    region: aws_credentials.region,
    accessKeyId: aws_credentials.accessKeyId,
    secretAccessKey: aws_credentials.secretAccessKey,
    Bucket: aws_credentials.s3Bucket,
  });

  let fileName = 0;

  // user uploaded a new writeup
  if (req.body.writeupId == 0) {
    let result = await db_mgmt.record_writeup_submission(req.session.account_id, req.body.writeupName);
    fileName = result.insertId;
  // user is updating a previously uploaded writeup
  } else {
    try {
      await db_mgmt.update_writeup_submission(req.session.account_id, req.body.writeupName,
                                              req.body.writeupId);
    } catch (error) {
      return next(error);
    }

    fileName = req.body.writeupId;
  }

  // const fileName = util.md5(req.body.writeupName) + '_' + req.session.account_id;
  // configure the parameters
  const params = {
    Bucket: aws_credentials.s3Bucket,
    Key: 'writeups/' + fileName + '.md',
  };

  // check if the user is updating an old submission
  /* s3.getObject(params, async (err, data) => {
    if (err) {
      // if the file does not exist, then the writeup is a new submission
      // we need to award the user points accordingly
      // and record the new submission in the database
      console.log(err);
      if (err.code === 'NoSuchKey') {
        await db_mgmt.record_writeup_submission(req.session.account_id, params.Key, req.body.writeupName);
        // TODO: award the user points
      } else {
        res.status(err.statusCode).send(err);
      }
    }*/

    // add the file data to the params
    params.Body = req.body.data;

    // store the file in S3
    s3.putObject(params, (err, data) => {
      if (err) {
        // if an error occurred, return the error
        res.status(err.statusCode).send(err);
      }
      res.status(200).json({writeupId: fileName});
    });
  // });
});

// upload a file
routes.get('/upload/file', async (req, res) => {
  // get the file name, type, and extension
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const fileExt = '.' + fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2);

  let prefix = 'writeups/files/';
  // hash the name
  // let name = util.md5(fileName);
  let result = await db_mgmt.record_file_upload(req.session.account_id, fileName);
  let id = result.insertId;

  // configure s3
  const s3 = new aws.S3({
    region: aws_credentials.region,
    accessKeyId: aws_credentials.accessKeyId,
    secretAccessKey: aws_credentials.secretAccessKey,
    Bucket: aws_credentials.s3Bucket,
  });

  let url = getSignedUrl(prefix + id + fileExt, fileType);
  res.status(200).json({url: url, key: prefix + id + fileExt});
  // wait until we find an unused file name
  // await getUnusedName(req, res, s3, prefix, name, fileType, fileExt);
});

// finds an unused file name and returns a signed url to upload to a file
async function getUnusedName(req, res, s3, prefix, name, fileType, fileExt) {
  let key = prefix + name + fileExt;
  // check if the file name is already used
  s3.headObject({Bucket: aws_credentials.s3Bucket, Key: key}, async (err, data) => {
    if (err) {
      // if it is not, get a signed url and record the file upload
      if (err.code === 'NotFound') {
        let url = getSignedUrl(key, fileType);
        await db_mgmt.record_file_upload(req.session.account_id, key);
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
