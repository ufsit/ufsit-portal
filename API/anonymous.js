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
		'email': req.body.email.toLowerCase(),	// make emails case sensitive
		'password': req.body.password,
		'grad_year': req.body.grad_year,
		'subscribe': req.body.subscribe,
	};

	/* Use the account management module to attempt to register the new user.
	 	If the callback comes back with an error, */
	try {
		await account_mgmt.register_new_user(registration_data);
		res.status(200).send('Success');
	} catch (error) {
		return next(error);
	}
});


routes.post('/user/login', (req, res) => {
	let login_data = {
		'email': req.body.email,
		'password': req.body.password,
	};
	account_mgmt.authenticate(login_data, (account_id, error)=>{
		/* Handles invalid credentials or database errors */
		if (error) {
			console.log(error.text);	// Log the error

			// Send the HTTP error code specified by the error object, and a simplified error message
			if (error.code === 401 || error.code === 404) {	// Either Bad password or email not found
				res.status(401).send('Invalid Credentials');
			} else if (error.code === 400) {
				res.status(error.code).send('Malformed Request');
			} else {
				res.status(500).send('Internal Server Error');
			}
		} else { // If the credentials checked out
			account_mgmt.generate_session_token(account_id, req.ip,
					req.headers['user-agent'], COOKIE_EXPIRY_TIME,
				(error, session_cookie)=>{
					if (error) {
						/* Something went wrong while generating the session cookie */
						console.log(error);
						res.status(500).send('Unable to generate session cookie');
					} else {
						// TODO: add other fields such as ephemeral to boost security
						res.cookie(
							'session_id', session_cookie,
							{
								expires: new Date(Date.now() + COOKIE_EXPIRY_TIME),
								httpOnly: true, 	// Prevent shenanigans
								signed: true,
							}
						);
						res.status(200).send('Successfully Authenticated');
					}
			});
		}
	});
});

module.exports = routes;
