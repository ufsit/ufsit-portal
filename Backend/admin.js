const routes = require('express').Router(); // eslint-disable-line new-cap
const adminMgmt = require('./db/admin_mgmt.js');
// App-specific module imports
const util = require.main.require('./utils');
const dbMgmt = require('./db/db_mgmt.js');

routes.get('/admin/list_users', async (req, res) => {
  if (util.account_has_admin(req.account)) {
    return res.status(200).json(await adminMgmt.list_users());
  }
  return res.status(403).send('Access denied');
});

// Creating an election
routes.post('/admin/poll', async (req, res, next) => {
  if (util.account_has_admin(req.account)) {
    try {
      await dbMgmt.create_poll(req.body.candidates);
      return res.status(200).send('Success');
    } catch (error) {
      return next(error);
    }
  } else {
    return res.status(403).send('Access denied');
  }
});

module.exports = routes;
