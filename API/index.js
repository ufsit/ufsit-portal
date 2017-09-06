const routes = require('express').Router();
// var multer = require('multer'); // v1.0.5
// var upload = multer(); // for parsing multipart/form-data
// var loginModule = require('./Login.js');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'You\'ve reached the root directory of the REST API. Try something more interesting next time :p' });
});

routes.post('/user/sign_in', (req, res) => {
  res.status(200).send("Work in progress!");
});




// routes.get('/', (req, res) => {
//   res.status(200).json({ message: 'You\'ve reached the root directory of the REST API. Try something more interesting next time :p' });
// });
//
// routes.post('/user/register', (req, res) => {
//
//   res.status(200).send("Work in progress!");
// });
//
// routes.post('/user/login', (req, res) => {
// 	var isAuthenticated = loginModule.authenticate(req.username);
//
// 	if(isAuthenticated){
// 		var cookie = 'put a cookie here';
// 		res.cookie('session',cookie,{maxAge:1200000, httpOnly: true }});
// 		res.status(200).send('Authenticated');
// 	}
//
// 	else {
// 		res.status(401).send('Invalid credentials');
// 	}
//
//   // res.status(200).json({ message: loginModule.sayHi() });
// });

module.exports = routes;

/*
/user/
	/login
	/register

/event/
	/get_current_event
	/sign_in/{email}

*/
