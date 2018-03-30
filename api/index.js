'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');

/* App-specific module imports */
const account_mgmt = require('./db/account_mgmt.js');

/* For parsing application/json */
routes.use(bodyParser.json());
/* For parsing application/x-www-form-urlencoded */
routes.use(bodyParser.urlencoded({ extended: true }));
/* For parsing cookies */
routes.use(cookieParser('This secret is used for signing cookies. Here\'s some extra entropy: 4c5ee6dc5ee1f723c3ce1efcf78c8dd0c0a55badbae4f4da5172d17a8cae07ef7e21b60a009c45b7567874c98bf79040d54475261')); // eslint-disable-line max-len

async function requireLogin(req, res, next) {
    /* The following variable certifies that the cookie is at least signed by us */
    let signed_cookie = req.signedCookies.session_id;

    if (!signed_cookie) {
        return res.status(403).send('Not signed in');
    }

    /* If the cookie is signed, proceed to get some more info from the database */
    try {
        const session = await account_mgmt.validate_session(signed_cookie);

        if (session) {
            req.session = session; // pass on our session variable to the next handlers
            return next();
        } else {
            return res.status(403).send('Not signed in');
        }
    } catch (error) {
        return next(error);
    }
}

// Assumes the existance of an active session
async function loadAccount(req, res, next) {
    try {
        const account = await account_mgmt.get_account_by_id(req.session.account_id);
        req.account = account;
        return next();
    } catch (error) {
        return next(error);
    }
}

routes.get('/', (req, res) => {
    res.status(200).json({
        message: 'You\'ve reached the root directory of the REST API.' +
            'Try something more interesting next time :)'
    });
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
routes.use(require('./upload.js'));
routes.use(require('./writeups.js'));
routes.use(require('./resume.js'));
routes.use(require('./app.js'));
routes.use(function (req, res, next) {
    res.status(404).json({ message: 'Unknown REST URL: /api' + req.url });
});

module.exports = routes;
