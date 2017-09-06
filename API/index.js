const routes = require('express').Router();
var loginModule = require('./Login.js');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'You\'ve reached the root directory of the REST API. Try something more interesting next time :p' });
});

routes.get('/login', (req, res) => {
  res.status(200).json({ message: loginModule.sayHi() });
});



module.exports = routes;
