const routes = require('express').Router(); // eslint-disable-line new-cap
const event_mgmt = require('./db/event_mgmt.js'); // App-specific module imports

// 12 hours
const SIGN_INS_COOLDOWN = 12 * 60 * 60;

/* Signs the logged-in user into the current meeting */
routes.post('/event/sign_in', async (req, res, next) => {
  // XXX: TOCTOU vulnerability. Use DB transaction
  try {
    const results = await event_mgmt.get_sign_ins_after(req.account.email,
      new Date(Date.now() - SIGN_INS_COOLDOWN * 1000));

    if (results.length > 0) {
      return res.status(401).send('Multiple sign-ins');
    }

    /* Sign the user in */
    await event_mgmt.sign_in(req.account.email, new Date(Date.now()));

    return res.status(200).send('Signed in');
  } catch (error) {
    return next(error);
  }
});

module.exports = routes;
