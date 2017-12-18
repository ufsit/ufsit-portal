'use strict';

// Enable app-relative includes (https://gist.github.com/branneman/8048520)
// Note: use require.main.require('file/path') for app-relative includes

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const BASE_URL = 'https://portal.ufsit.org';
const PORT = process.env.PORT || 8080;
const REALM = process.env.NODE_ENV || 'development';

// Initialize our Express class
const app = express();

// Enable Apache-like logging for all web requests
app.use(morgan('combined'));

// We are in a Heroku environment -- trust the proxy header
// http://expressjs.com/en/guide/behind-proxies.html
app.enable('trust proxy');

// Redirect methods
if (REALM === 'production') {
	// Redirect all HTTP to HTTPS
	app.get('*', function(req, res, next) {
		if (req.headers['x-forwarded-proto'] != 'https') {
			res.redirect(BASE_URL + req.url);
		} else {
			next(); // Continue to other routes if we're not redirecting
		}
	});
}

// Tells server how to read incoming json or url data
app.use(bodyParser.urlencoded({
	extended: true,
}));

app.use(bodyParser.json());

// Use the API router for REST endpoints, separate from the webserver routing
const api = require('./API');
app.use('/api', api);

// Specifies what folders have static files the server must read
app.use(express.static('images'));
app.use(express.static('scripts'));
app.use(express.static('css'));
app.use(express.static('routes'));
app.use(express.static('services'));
app.use(express.static('node_modules'));

app.use((req, res, next) => {
	if (!/.*\.html$/.test(req.url)) {
		req.url = '/index.html';
	}

	next();
});

app.use(express.static('html'));

// Tells the terminal the node has been created at a given port number
app.listen(PORT, function() {
	let url = '';

	if (REALM === 'development') {
		url = 'http://localhost:' + PORT + '/';
	} else {
		url = BASE_URL + '/';
	}

	console.log('[REALM ' + REALM + '] UFSIT Portal now accepting requests at ' + url);
});
