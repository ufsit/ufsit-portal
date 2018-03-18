'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap
const util = require.main.require('./util');
const db_mgmt = require('./db/db_mgmt.js');

/* App-specific module imports */
const admin = require('./db/admin.js');

routes.get('/admin/list_users', async (req, res, next) => {
	if (util.account_has_admin(req.account)) {
		res.status(200).json(await admin.list_users());
	} else {
		res.status(403).send('Access denied');
	}
});

//Creating an election
routes.post('/admin/poll', async (req, res, next) => {
	if (util.account_has_admin(req.account)) {
		try {
			await db_mgmt.create_poll(req.body.candidates);
			res.status(200).send('Success');
		} catch(error) {
			return next(error);
		}
	}
	else {
		res.status(403).send('Access denied');
	}
});

module.exports = routes;
