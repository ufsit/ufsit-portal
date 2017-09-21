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
	/* Grab the registration data from the request body */
	var registration_data = {
		'name': req.body.name,
		'email': req.body.email,
		'password': req.body.password,
		'grad_year': req.body.grad_year,
		'subscribe': req.body.subscribe,
	}
	/* Use the account management module to attempt to register the new user.
	 	If the callback comes back with an error, */
	account_mgmt.register_new_user(registration_data,(error)=>{
		/* If a parameter was sent, it is an error message. */
		if(error){
			console.log(error.text);	//Log the error
			//Send the HTTP error code specified by the error object, and a simplified error message
			if(error.code === 409)
				res.status(error.code).send("Duplicate Account");
			else if(error.code === 400)
				res.status(error.code).send("Malformed Request");
			else 	//500
				res.status(500).send("Internal Server Error");
		}
		else{
			res.status(200).send("Success");
		}
	});

});


routes.post('/user/login', (req, res) => {
	var login_data = {
		'email': req.body.email,
		'password': req.body.password
	}
	account_mgmt.authenticate(login_data,(error)=>{
		/* Handles invalid credentials or database errors */
		if(error){
			console.log(error.text);	//Log the error
			//Send the HTTP error code specified by the error object, and a simplified error message
			if(error.code === 401 || error.code === 404)	//Either Bad password or email not found
				res.status(error.code).send("Invalid Credentials");
			else if(error.code === 400)
				res.status(error.code).send("Malformed Request");
			else //500
				res.status(500).send("Internal Server Error");
		}
		/* If the credentials checked out */
		else{
			var cookie_expiry_time = 900000;		//15min
			account_mgmt.session_token(login_data.email, cookie_expiry_time,
				(error, session_cookie)=>{
					if(error){
						/* Something went wrong while generating the session cookie */
						res.status(500).send("Internal Server Error");
					} else{
						res.cookie(
							'session_id', session_cookie,
							{ 	expires: new Date(Date.now() + cookie_expiry_time), 	//15minutes
								httpOnly: true 	//Prevent shenanigans
							}
						);
						res.status(200).send("Successfully Authenticated");
					}
			});
		}
	});
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
