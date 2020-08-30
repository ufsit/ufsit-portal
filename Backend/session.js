const routes = require('express').Router();

const util = require.main.require('./util');
const db_mgmt = require('./db/db_mgmt.js');

routes.get('/session/validate', async (req, res) => {
  const isAdmin = util.account_has_admin(req.account);
  const curr_election = await db_mgmt.current_election();
  res.status(200).json({
    email: req.account.email,
    name: req.account.full_name,
    admin: isAdmin,
    election: curr_election,
  });
});

/* Clears the session_id cookie for the requester */
routes.post('/session/logout', (req, res) => {
  res.clearCookie('session_id').status(200).send();
});

module.exports = routes;
