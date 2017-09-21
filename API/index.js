const routes = require('express').Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var sanitizer = require('express-sanitize-escape');	//Automagically sanitize req.body

/* App-specific module imports */
var account_mgmt = require('./account_mgmt.js');
var event_mgmt = require('./event_mgmt.js');
var admin = require('./admin.js');

/* For parsing application/json */
routes.use(bodyParser.json());
/* For parsing application/x-www-form-urlencoded */
routes.use(bodyParser.urlencoded({ extended: true }));
/* For parsing cookies */
routes.use(cookieParser("This secret is used for signing cookies. Here's some extra entropy: 4c5ee6dc5ee1f723c3ce1efcf78c8dd0c0a55badbae4f4da5172d17a8cae07ef7e21b60a009c45b7567874c98bf79040d54475261"));
/* Automagically sanitize req.body. this line follows app.use(bodyParser.json) or the last body parser middleware */
routes.use(sanitizer.middleware());

// var loginModule = require('./Login.js');

routes.get('/', (req, res) => {
	res.status(200).json({ message: 'You\'ve reached the root directory of the REST API. Try something more interesting next time :)' });
});

routes.get('/admin/list_users', (req, res) => {
	admin.list_users(function(err, data) {
		// TODO error
		res.status(200).json(data);
	});
});

routes.post('/user/register', (req, res) => {
	/* Grab the registration data from the request body */
	var registration_data = {
		'name': req.body.name,
		'email': req.body.email.toLowerCase(),	//make emails case sensitive
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
				res.status(401).send("Invalid Credentials");
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
								httpOnly: true, 	//Prevent shenanigans
								signed: true
							}
						);
						res.status(200).send("Successfully Authenticated");
					}
			});
		}
	});
});

routes.get('/session/validate', (req, res)=>{
	/* The following variable certifies that the cookie is at least signed by us */
	var signed_cookie = req.signedCookies.session_id;
	/* If the cookie is signed, proceed to get some more info from the database */
	if(signed_cookie){
		account_mgmt.validate_session(signed_cookie,(error,is_valid,email)=>{
			if(error){
				console.log(error);
				res.status(500).send('Something went wrong on our end');
			}
			else {
				if(is_valid){
					account_mgmt.get_name_from_email(email,(error,name)=>{
						if(error){
							res.status(500).send('Something went wrong on our end');
						} else {
							res.status(200).send({'name':name,'email':email});
						}
					});
				}
				else {
					res.status(403).send('Invalid session');
				}

			}
		});

	}
	/* If the cookie wasn't even signed, return a 403 forbidden error */
	else {
		res.status(403).send('Not signed in');
	}
});

/* Clears the session_id cookie for the requester */
routes.post('/session/logout', (req, res)=>{
	res.clearCookie('session_id').status(200).send();
});

/* Signs the logged-in user into the current meeting */
routes.post('/event/sign_in', (req, res)=>{
	/* The following variable certifies that the cookie is at least signed by us */
	var signed_cookie = req.signedCookies.session_id;
	if(signed_cookie){
		//If the cookie was generated by us, sign the user into the meeting
		account_mgmt.validate_session(signed_cookie,(error,is_valid,email)=>{
			if(error){
				console.log(error);
				res.status(500).send('Something went wrong on our end');
			}
			else {
				/* If the session is valid */
				if(is_valid){
					/* Sign the user in */
					event_mgmt.sign_in(email, new Date(Date.now()), (error)=>{
						if(error){
							console.log(error);
							res.status(500).send('Something went wrong on our end');
						}
						else {
							res.status(200).send('Signed in');
						}
					});
				}
				else {
					res.status(403).send('Invalid session');
				}
			}
		});
	}
	else 	res.status(403).send('Invalid session');
});

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
