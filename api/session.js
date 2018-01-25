'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap
const util = require.main.require('./util');

routes.get('/session/validate', (req, res)=>{
	const isAdmin = util.account_has_admin(req.account);
	res.status(200).json({
		email: req.account.email,
		name: req.account.full_name,
		admin: isAdmin,
	});
});

/* Clears the session_id cookie for the requester */
routes.post('/session/logout', (req, res)=>{
	res.clearCookie('session_id').status(200).send();
});

module.exports = routes;
