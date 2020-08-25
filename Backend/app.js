const routes = require('express').Router(); // eslint-disable-line new-cap
const app_mgmt = require('./db/app_mgmt.js');

routes.get('/app/custom_tiles', async (req, res, next) => res.status(200).json(await app_mgmt.custom_tiles()));

routes.post('/app/tile_click', async (req, res, next) => {
  await app_mgmt.tile_click(req.session.account_id, req.body.id);
  res.status(200).send('Success');
});

routes.post('/app/ctf_click', async (req, res, next) => {
  await app_mgmt.ctf_click(req.session.account_id, req.body.id);
  res.status(200).send('Success');
});

module.exports = routes;
