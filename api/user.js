'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap
const util = require.main.require('./util');

/* App-specific module imports */
const account_mgmt = require('./db/account_mgmt.js');

routes.get('/user/profile', function(req, res) {
	let data = req.account;

	res.status(200).json(Object.assign(data, {profile_name: 'Your Profile'}));
});

routes.get('/user/profile/:user_id', async function(req, res, next) {
	// Just an alias for /user/profile
	if (req.params.user_id === req.session.account_id) {
		return res.status(200).json(Object.assign(req.account, {profile_name: 'Your Profile'}));
	}

	// Viewing other people's profiles is currently a privileged operation
	// due to the data you get back...
	if (!util.account_has_admin(req.account)) {
		return res.status(403).send('Access denied');
	}

	try {
		const account = await account_mgmt.get_account_by_id(req.params.user_id);


		// XXX: HACK
		const first_name = account.full_name.split(' ')[0];
		res.status(200).json(Object.assign(account, {profile_name: first_name + '\'s Profile'}));
	} catch (error) {
		return next(error);
	}
});

async function update_user_profile(account_id, req, res, next) {
	// A user is editing their own profile

	let admin_edit = false;
	let target_account = {};

	if (req.session.account_id === account_id) {
		target_account = req.account;
	} else {
		// A foreign edit by an admin
		if (!util.account_has_admin(req.account)) {
			return res.status(403).send('Access denied');
		}

		try {
			target_account = await account_mgmt.get_account_by_id(account_id);
		} catch (error) {
			return next(error);
		}

		admin_edit = true;
	}

	let updated_items = [];

	req.body.subscribe = req.body.subscribe ? 1 : 0;

	// TODO: allow admin to edit email
	// User should not be able to change email
	if (req.body.email !== target_account.email) {
		res.status(409).send('Email cannot be changed');
		return;
	}

	if (req.body.name !== target_account.full_name) {
		updated_items.push(['Name', 'full_name', 'name']);
	}

	if (req.body.grad_year !== target_account.grad_date) {
		updated_items.push(['Graduation year', 'grad_date', 'grad_year']);
	}

	if (req.body.subscribe !== target_account.mass_mail_optin) {
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

	// Admins do not need to know the old password
	if (password_change && !admin_edit) {
		// check to see if the old password is correct
		try {
			await account_mgmt.authenticate({email: target_account.email, password: req.body.old_password});
		} catch (error) {
			if (error.status < 500) {
				return res.status(error.status).send('Invalid existing password');
			} else {
				return next(error);
			}
		}
	}

	try {
		await account_mgmt.update_account(account_id, data);

		// Return the list of updated items (only the human readable note)
		updated_items = updated_items.map(function(i) {
			return i[0];
		});

		return res.status(200).json(updated_items);
	} catch (error) {
		if (error.status < 500) {
			return res.status(error.status).send(error.message);
		} else {
			return next(error);
		}
	}
}

routes.post('/user/profile', async function(req, res, next) {
	// No await needed here as all error handling done in the below layer
	update_user_profile(req.session.account_id, req, res, next);
});

routes.post('/user/profile/:user_id', async function(req, res, next) {
	update_user_profile(req.params.user_id, req, res, next);
});

module.exports = routes;
