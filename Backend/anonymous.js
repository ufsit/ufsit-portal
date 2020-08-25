// time in seconds
const COOKIE_EXPIRY_TIME = 60 * 60 * 1000; // 60min in milliseconds
const SIGN_INS_COOLDOWN = 60 * 1000; // 1 minute
const routes = require('express').Router(); // eslint-disable-line new-cap

/* App-specific module imports */
const account_mgmt = require('./db/account_mgmt.js');
const event_mgmt = require('./db/event_mgmt.js');

routes.post('/user/register', async (req, res, next) => {
  /* Grab the registration data from the request body */
  const registration_data = {
    registration_ip: req.ip,
    name: req.body.name,
    email: req.body.email.toLowerCase(), // make emails case insensitive
    ufl_email: req.body.ufl_email.toLowerCase(), // make emails case insensitive
    password: req.body.password,
    grad_date: req.body.grad_date,
    subscribe: req.body.subscribe,
  };

  // Double check that we actually got a ufl email
  if (!/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(registration_data.email)) {
    return res.status(400).send('Invalid email');
  }

  // Double check that we actually got a ufl email
  if (!/^.+@(cise\.)?ufl\.edu$/.test(registration_data.ufl_email)) {
    return res.status(400).send('Invalid email');
  }

  /* Use the account management module to attempt to register the new user. */
  try {
    await account_mgmt.register_new_user(registration_data);
    res.status(200).send('Success');
  } catch (error) {
    return next(error);
  }
});

routes.post('/user/login', async (req, res, next) => {
  const login_data = {
    email: req.body.email,
    ufl_email: req.body.ufl_email,
    password: req.body.password,
  };

  try {
    const account_id = await account_mgmt.authenticate(login_data);
    const cookie = await account_mgmt.generate_session_token(account_id, req.ip,
      req.headers['user-agent'], COOKIE_EXPIRY_TIME);

    // TODO: add other fields such as ephemeral to boost security
    res.cookie(
      'session_id', cookie,
      {
        expires: new Date(Date.now() + COOKIE_EXPIRY_TIME),
        httpOnly: true, // Prevent shenanigans
        signed: true,
      },
    );

    await recordLogin(req.body.email);
    res.status(200).send('Successfully Authenticated');
  } catch (error) {
    if (error.status < 500) {
      // Blind any non-500 status messages
      console.log(error.message);
      return res.status(401).send('Invalid credentials');
    }
    return next(error);
  }
});

async function recordLogin(email) {
  try {
    const results = await event_mgmt.get_sign_ins_after(email,
      new Date(Date.now() - SIGN_INS_COOLDOWN));

    if (results.length > 0) {
      return;
    }

    /* Sign the user in */
    await event_mgmt.sign_in(email, new Date(Date.now()));
  } catch (error) {
    return error;
  }
}

module.exports = routes;
