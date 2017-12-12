'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap

/* App-specific module imports */
const account_mgmt = require('./db/account_mgmt.js');

routes.get('/user/profile', function(req, res) {
	let data = req.account;

	res.status(200).json(Object.assign(data, {profile_name: 'Your Profile'}));
});

routes.post('/user/profile', async function(req, res, next) {
	let updated_items = [];

	req.body.subscribe = req.body.subscribe ? 1 : 0;

	// User should not be able to change email
	if (req.body.email !== req.account.email) {
		res.status(400).send('Email cannot be changed');
		return;
	}

	if (req.body.name !== req.account.full_name) {
		updated_items.push(['Name', 'full_name', 'name']);
	}

	if (req.body.grad_year !== req.account.grad_date) {
		updated_items.push(['Graduation year', 'grad_date', 'grad_year']);
	}

	if (req.body.subscribe !== req.account.mass_mail_optin) {
		updated_items.push(['Subscription to email updates', 'mass_mail_optin', 'subscribe']);
	}

	const password_change = req.body.old_password && req.body.new_password && req.body.confirm_password;
	if (password_change) {
		if (req.body.new_password !== req.body.confirm_password) {
			res.status(400).send('New password does not match');
			return;
		}

		if (req.body.old_password === req.body.confirm_password) {
			res.status(400).send('Old password cannot equal the new password');
			return;
		}

		// if it is correct, change it to the new one
		updated_items.push(['Password', 'password', 'new_password']);
	}

	let data = {};

	updated_items.forEach(function(i) {
		data[i[1]] = req.body[i[2]];
	});

	if (updated_items.length < 1) {
		return res.status(400).send('No changes to profile');
	}

	if (password_change) {
		// check to see if the old password is correct
		try {
			await account_mgmt.authenticate({email: req.account.email, password: req.body.old_password});
		} catch (error) {
			return next(error);
		}
	}

	try {
		await account_mgmt.update_account(req.session.account_id, data);

		// Return the list of updated items (only the human readable note)
		updated_items = updated_items.map(function(i) {
			return i[0];
		});

		return res.status(200).json(updated_items);
	} catch (error) {
		return next(error);
	}
});

module.exports = routes;
