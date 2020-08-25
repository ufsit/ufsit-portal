const routes = require('express').Router(); // eslint-disable-line new-cap
const db_mgmt = require('./db/db_mgmt.js');

const util = require.main.require('./util');
const aws = require('aws-sdk');

const aws_credentials = util.load_aws();

// returns a user's resume link
routes.get('/resume/link', async (req, res, next) => {
  let result;
  try {
    result = await db_mgmt.get_resume_key(req.session.account_id);
  } catch (error) {
    return next(error);
  }

  if (result.length > 0 && result[0].resume !== '') {
    const key = result[0];
    res.status(200).json(key);
  } else {
    res.status(404).send('You have not uploaded a resume.');
  }
});

// returns a user's resume
routes.get('/resume', async (req, res, next) => {
  // configure s3
  const s3 = new aws.S3({
    region: aws_credentials.region,
    accessKeyId: aws_credentials.accessKeyId,
    secretAccessKey: aws_credentials.secretAccessKey,
    Bucket: aws_credentials.s3Bucket,
  });

  let result = '';
  try {
    result = await db_mgmt.get_resume_key(req.session.account_id);
  } catch (error) {
    return next(error);
  }

  if (result.length === 0 || result[0].resume === '') {
    res.status(404).send('You have not uploaded a resume.');
    return;
  }
  const key = result[0].resume;
  // configure the parameters
  const params = {
    Bucket: aws_credentials.s3Bucket,
    Key: key,
  };

  // get the writeup
  s3.headObject(params, (err) => {
    if (err) {
      res.status(500).send('Cannot find uploaded resume. Please contact the developers or reupload your resume.');
    } else {
      s3.getObject(params).createReadStream().pipe(res);
    }
  });
});

// returns a user's resume questions
routes.get('/resume/questions', async (req, res, next) => {
  try {
    const result = await db_mgmt.get_resume_questions(req.session.account_id);
    if (result.length === 0) {
      res.status(500).send('User not found, please contact the developers.');
    } else {
      res.status(200).send(result[0]);
    }
  } catch (error) {
    return next(error);
  }
});

// updates a user's resume questions
routes.post('/resume/questions', async (req, res, next) => {
  try {
    await db_mgmt.set_resume_questions(req.session.account_id, req.body);
    res.status(200).send('success');
  } catch (error) {
    next(error);
  }
});

module.exports = routes;
