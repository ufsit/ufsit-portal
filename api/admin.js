'use strict';
const routes = require('express').Router(); // eslint-disable-line new-cap
const admin_mgmt = require('./db/admin_mgmt.js'); // App-specific module imports
const util = require.main.require('./util');
const db_mgmt = require('./db/db_mgmt.js');

routes.get('/admin/list_users', async (req, res, next) => {
    if (util.account_has_admin(req.account)) {
        return res.status(200).json(await admin_mgmt.list_users());
    } else {
        return res.status(403).send('Access denied');
    }
});

routes.post('/admin/add_tile', async (req, res, next) => {
    if (util.account_has_admin(req.account)) {
        try {
            await admin_mgmt.add_tile(
                req.body.name,
                req.body.description,
                req.body.link
            );
            res.status(200).send('Success');
        } catch (error) { return next(error) }
    } else {
        res.status(403).send('Access denied');
    }
});

routes.post('/admin/delete_tile', async (req, res, next) => {
    if (util.account_has_admin(req.account)) {
        try {
            await admin_mgmt.delete_tile(req.body.id);
            res.status(200).send('Success');
        } catch (error) { return next(error) }
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
