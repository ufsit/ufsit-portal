'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let sanitizer = require('express-sanitize-escape');	// Automagically sanitize req.body

/* App-specific module imports */
const account_mgmt = require('./db/account_mgmt.js');

/* For parsing application/json */
routes.use(bodyParser.json());
/* For parsing application/x-www-form-urlencoded */
routes.use(bodyParser.urlencoded({extended: true}));
/* For parsing cookies */
routes.use(cookieParser('This secret is used for signing cookies. Here\'s some extra entropy: 4c5ee6dc5ee1f723c3ce1efcf78c8dd0c0a55badbae4f4da5172d17a8cae07ef7e21b60a009c45b7567874c98bf79040d54475261')); // eslint-disable-line max-len
/* Automagically sanitize req.body. this line follows app.use(bodyParser.json) or the last body parser middleware */
routes.use(sanitizer.middleware());

function requireLogin(req, res, next) {
	/* The following variable certifies that the cookie is at least signed by us */
	let signed_cookie = req.signedCookies.session_id;
	/* If the cookie is signed, proceed to get some more info from the database */
	if (signed_cookie) {
		account_mgmt.validate_session(signed_cookie, (error, session) =>{
			if (error) {
				console.log(error);
				res.status(500).send('Something went wrong on our end');
			} else {
				if (session) {
					req.session = session; // pass on our session variable to the next handlers
					next();
				} else {
					res.status(403).send('Not signed in');
				}
			}
		});
	} else { // If the cookie wasn't even signed, return a 403 forbidden error
		res.status(403).send('Not signed in');
	}
}

function loadAccount(req, res, next) {
	account_mgmt.get_account_by_id(req.session.account_id, (err, account)=> {
		if (err) {
			console.log(err);
			res.status(500).send('Something went wrong on our end');
		} else {
			req.account = account;
			next();
		}
	});
}

routes.get('/', (req, res) => {
	res.status(200).json({message: 'You\'ve reached the root directory of the REST API.' +
		'Try something more interesting next time :)'});
});

routes.post('/bad_route', (req, res) => {
	if (req.body.route) {
		console.log('[WARN] Application route 404:', req.body.route);
		res.status(200);
	} else {
		res.status(404);
	}
});

// All routes in anonymous do not require an existing session or account
routes.use(require('./anonymous.js'));

// All routes included below require a login and an account object
routes.all('*', requireLogin, loadAccount);

routes.use(require('./user.js'));
routes.use(require('./session.js'));
routes.use(require('./event.js'));
routes.use(require('./admin.js'));
routes.use(function(req, res, next) {
	res.status(404).json({message: 'Unknown REST URL: /api' + req.url});
});

module.exports = routes;
