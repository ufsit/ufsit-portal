'use strict';

// time in seconds
const COOKIE_EXPIRY_TIME = 60*60*1000; // 60min in milliseconds
const routes = require('express').Router(); // eslint-disable-line new-cap

/* App-specific module imports */
const account_mgmt = require('./db/account_mgmt.js');

routes.post('/user/register', async (req, res, next) => {
	/* Grab the registration data from the request body */
	let registration_data = {
		'registration_ip': req.ip,
		'name': req.body.name,
		'email': req.body.email.toLowerCase(),	// make emails case insensitive
		'password': req.body.password,
		'grad_date': req.body.grad_date,
		'subscribe': req.body.subscribe,
	};

	// Double check that we actually got a ufl email
	if (!/^.+@(cise\.)?ufl\.edu$/.test(registration_data.email)) {
		return res.status(400).send('Invalid email');
	}


	/* Use the account management module to attempt to register the new user. */
	try {
		await account_mgmt.register_new_user(registration_data);
		res.status(200).send('Success');
	} catch (error) {
		return next(error);
	}
});

routes.post('/user/login', async (req, res, next) => {
	let login_data = {
		'email': req.body.email,
		'password': req.body.password,
	};

	try {
		const account_id = await account_mgmt.authenticate(login_data);
		const cookie = await account_mgmt.generate_session_token(account_id, req.ip,
			req.headers['user-agent'], COOKIE_EXPIRY_TIME);

		// TODO: add other fields such as ephemeral to boost security
		res.cookie(
			'session_id', cookie,
			{
				expires: new Date(Date.now() + COOKIE_EXPIRY_TIME),
				httpOnly: true, 	// Prevent shenanigans
				signed: true,
			}
		);

		res.status(200).send('Successfully Authenticated');
	} catch (error) {
		if (error.status < 500) {
			// Blind any non-500 status messages
			console.log(error.message);
			return res.status(401).send('Invalid credentials');
		} else {
			return next(error);
		}
	}
});

module.exports = routes;
