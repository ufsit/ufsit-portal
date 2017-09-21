const routes = require('express').Router();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var sanitizer = require('express-sanitize-escape');	//Automagically sanitize req.body

/* App-specific module imports */
var account_mgmt = require('./account_mgmt.js');

/* For parsing application/json */
routes.use(bodyParser.json());
/* For parsing application/x-www-form-urlencoded */
routes.use(bodyParser.urlencoded({ extended: true }));
/* Automagically sanitize req.body. this line follows app.use(bodyParser.json) or the last body parser middleware */
routes.use(sanitizer.middleware());

// var loginModule = require('./Login.js');

routes.get('/', (req, res) => {
	res.status(200).json({ message: 'You\'ve reached the root directory of the REST API. Try something more interesting next time :)' });
});

routes.post('/user/register', (req, res) => {
	// console.log(req.body);
	var registration_data = {
		'name': req.body.name,
		'email': req.body.email,
		'password': req.body.password,
		'subscribe': req.body.subscribe,
	}

	account_mgmt.register_new_user(registration_data,(error)=>{
		if(error){
			console.log(error);
			res.status(500).send();
		}
		else{
			res.status(501).send();
		}
	});

});


routes.post('/user/login', (req, res) => {
	var login_data = {
		'email': req.body.email,
		'password': req.body.password
	}
	// account_mgmt.authenticate(login_data,(error)=>{
	// 	if(error){
	// 		console.log(error);
	// 		res.status(500).send();
	// 	}
	//
	// 	else{
	// 		res.status(501).send();
	// 	}
	// });

	res.status(501).send();
});

/*
Planning:
/user/
/register
/login


/event/
/get_current_event
/sign_in/{email}

*/

module.exports = routes;


// routes.post('/user/sign_in', (req, res) => {
// 	// console.log(req.body);
// 	var name = req.body.name;
// 	var email = req.body.email;
// 	var subscribe = req.body.subscribe;
//
// 	sign_in.simple(name, email,subscribe,(error)=>{
// 		if(error){
// 			res.status(error.http_status_code).send(error.text);
// 		}
// 		else {
// 			res.status(200).send();
// 		}
// 	});
// });
//
// module.exports = routes;
