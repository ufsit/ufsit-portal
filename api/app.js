'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap
const util = require.main.require('./util');

/* App-specific module imports */
const app = require('./db/app.js');

routes.get('/app/custom_tiles', async (req, res, next) => {
	res.status(200).json(await app.custom_tiles());
});

module.exports = routes;
