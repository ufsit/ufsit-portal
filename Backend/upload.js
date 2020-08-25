const routes = require('express').Router(); // eslint-disable-line new-cap

const utils = require.main.require('./utils');
const aws = require('aws-sdk');

const aws_credentials = utils.load_aws();

const db_mgmt = require('./db/db_mgmt.js');

const REALM = process.env.NODE_ENV || 'development';

let keyPrefix = '';
if (REALM === 'development') {
  keyPrefix = 'dev/';
}

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
  if (req.body.writeupId === 0) {
    let result = '';
    try {
      result = await db_mgmt.record_writeup_submission(req.session.account_id,
        req.body.writeupName, req.body.writeupDescription);
    } catch (error) {
      return next(error);
    }
    fileName = result.insertId;
  // user is updating a previously uploaded writeup
  } else {
    try {
      await db_mgmt.update_writeup_submission(req.session.account_id, req.body.writeupName,
        req.body.writeupDescription, req.body.writeupId);
    } catch (error) {
      return next(error);
    }

    fileName = req.body.writeupId;
  }

  // const fileName = utils.md5(req.body.writeupName) + '_' + req.session.account_id;
  // configure the parameters
  const params = {
    Bucket: aws_credentials.s3Bucket,
    Key: `${keyPrefix}writeups/${fileName}.md`,
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
    } */

  // add the file data to the params
  params.Body = req.body.data;

  // store the file in S3
  s3.putObject(params, (err) => {
    if (err) {
      // if an error occurred, return the error
      res.status(err.statusCode).send(err);
    }
    res.status(200).json({ writeupId: fileName });
  });
  // });
});

// upload a file
routes.get('/upload/file', async (req, res, next) => {
  // get the file name, type, and extension
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const fileExt = `.${fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2)}`;

  const prefix = 'writeups/files/';
  // hash the name
  // let name = utils.md5(fileName);
  let result = '';
  try {
    result = await db_mgmt.record_file_upload(req.session.account_id, fileName);
  } catch (error) {
    return next(error);
  }

  const id = result.insertId;

  const url = getSignedUrl(keyPrefix + prefix + id + fileExt, fileType);
  res.status(200).json({ url, key: prefix + id + fileExt });
  // wait until we find an unused file name
  // await getUnusedName(req, res, s3, prefix, name, fileType, fileExt);
});

// upload a file
routes.get('/upload/resume', async (req, res, next) => {
  // get the file name, type, and extension
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const fileExt = `.${fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2)}`;

  if (fileType.toLowerCase() !== 'application/pdf') {
    res.status(415).send('Only PDFs are supported.');
    return;
  }

  const prefix = 'resumes/';
  // hash the name
  // let name = utils.md5(fileName);
  const key = keyPrefix + prefix + req.session.account_id + fileExt;
  try {
    await db_mgmt.record_resume_upload(req.session.account_id, key);
  } catch (error) {
    return next(error);
  }

  const url = getSignedUrl(key, fileType);
  res.status(200).json({ url, key });
});

// finds an unused file name and returns a signed url to upload to a file
async function getUnusedName(req, res, next, s3, prefix, name, fileType, fileExt) {
  const key = prefix + name + fileExt;
  // check if the file name is already used
  s3.headObject({ Bucket: aws_credentials.s3Bucket, Key: key }, async (err, data) => {
    if (err) {
      // if it is not, get a signed url and record the file upload
      if (err.code === 'NotFound') {
        const url = getSignedUrl(key, fileType);
        try {
          await db_mgmt.record_file_upload(req.session.account_id, key);
        } catch (error) {
          return next(error);
        }
        res.status(200).json({ url, key });
      // if some other error occurred, return the error
      } else {
        res.status(500).send(err);
      }
    // if the name is already being used, rehash the name for a new name and repeat
    } else {
      name = utils.md5(name);
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
