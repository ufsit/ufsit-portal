'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap
const util = require.main.require('./util');

/* App-specific module imports */
const admin = require('./db/admin.js');

routes.get('/admin/list_users', async (req, res, next) => {
	if (util.account_has_admin(req.account)) {
		res.status(200).json(await admin.list_users());
	} else {
		res.status(403).send('Access denied');
	}
});

module.exports = routes;
