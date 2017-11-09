'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap

routes.get('/session/validate', (req, res)=>{
	res.status(200).json({email: req.account.email, name: req.account.full_name});
});

/* Clears the session_id cookie for the requester */
routes.post('/session/logout', (req, res)=>{
	res.clearCookie('session_id').status(200).send();
});

module.exports = routes;
