const routes = require('express').Router(); // eslint-disable-line new-cap
const event_mgmt = require('./db/event_mgmt.js'); // App-specific module imports

/* Signs the logged-in user into the current meeting */
routes.post('/event/sign_in', async (req, res, next) => {

});

module.exports = routes;
