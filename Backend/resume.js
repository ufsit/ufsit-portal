const routes = require('express').Router();
const db_mgmt = require('./db/db_mgmt.js');

const util = require.main.require('./utils');

// returns a user's resume link
routes.get('/resume/link', async (req, res, next) => {

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
