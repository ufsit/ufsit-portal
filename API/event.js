'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap

/* App-specific module imports */
const event_mgmt = require('./db/event_mgmt.js');

/* Signs the logged-in user into the current meeting */
routes.post('/event/sign_in', (req, res)=>{
	/* Sign the user in */
	event_mgmt.sign_in(req.account.email, new Date(Date.now()), (error)=>{
		if (error) {
			console.log(error);
			res.status(500).send('Something went wrong on our end');
		} else {
			res.status(200).send('Signed in');
		}
	});
});

module.exports = routes;
