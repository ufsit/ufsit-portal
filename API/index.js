const routes = require('express').Router();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var sanitizer = require('express-sanitize-escape');	//Automagically sanitize req.body

var sign_in = require('./sign_in.js');

routes.use(bodyParser.json()); // for parsing application/json
routes.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
routes.use(sanitizer.middleware()); //Automagically sanitize req.body. this line follows app.use(bodyParser.json) or the last body parser middleware

// var loginModule = require('./Login.js');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'You\'ve reached the root directory of the REST API. Try something more interesting next time :)' });
});


routes.post('/user/sign_in', (req, res) => {
	// console.log(req.body);
	var name = req.body.name;
	var email = req.body.email;
	var subscribe = req.body.subscribe;

	sign_in.simple(name, email,subscribe,(error)=>{
		if(error){
			res.status(error.http_status_code).send(error.text);
		}
		else {
			res.status(200).send();
		}
	});
});

module.exports = routes;



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
// module.exports = routes;


/*
/user/
	/login
	/register

/event/
	/get_current_event
	/sign_in/{email}

*/
