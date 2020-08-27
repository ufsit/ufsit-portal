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

});

// returns a user's resume questions
routes.get('/resume/questions', async (req, res, next) => {

});

// updates a user's resume questions
routes.post('/resume/questions', async (req, res, next) => {

});

module.exports = routes;
