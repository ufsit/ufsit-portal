'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap

/* App-specific module imports */
const event_mgmt = require('./db/event_mgmt.js');

// 12 hours
const SIGN_INS_COOLDOWN = 12*60*60;

/* Signs the logged-in user into the current meeting */
routes.post('/event/sign_in', (req, res)=>{
	// XXX: TOCTOU vulnerability. Use DB transaction
	event_mgmt.get_sign_ins_after(req.account.email,
			new Date(Date.now() - SIGN_INS_COOLDOWN*1000), (error, results)=>{
		if (error) {
			console.log(error);
			res.status(500).send('Something went wrong on our end');
		} else {
			if (results.length > 0) {
				res.status(401).send('Multiple sign-ins');
				return;
			}

			/* Sign the user in */
			event_mgmt.sign_in(req.account.email, new Date(Date.now()), (error)=>{
				if (error) {
					console.log(error);
					res.status(500).send('Something went wrong on our end');
				} else {
					res.status(200).send('Signed in');
				}
			});
		}
	});
});

module.exports = routes;
