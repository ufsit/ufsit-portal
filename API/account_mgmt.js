/* Simple, non-account sign-in. Scrap for parts :) */

const crypto = require('crypto');	// For crypto

const db_mgmt = require('./db_mgmt.js');	// Abstracts away DB interactions

/* Crypto parameters.
WARNING: DO NOT CHANGE THESE!!, WILL INVALIDATE EXISTING ACCOUNTS.
If they need to be updated, you'll need to re-hash all account passwords */
const PBKDF2_NUM_ITERATIONS = 100000;	// 100000 iterations is pretty fast and secure
const PBKDF2_KEY_LEN = 48;					// 48bit hashes (64 wouldn't fit in the sql db lol)
const PBKDF2_ALGO = 'sha512';				// Use sha512

let account_mgmt_module = (function() {
	let register_new_user = function(registration_data, callback) {
		/* Validate the email address */
		if (!(isEmail(registration_data.email))) {
			/* IF it's not valid, send an error up through the callback */
			callback({
				'code': 400,
				'text': '[account_mgmt.js->]: Error - Attempted to create an account with an invalid email: ' +
					registration_data.email,
			});
		/* If the email checked out */
		} else {
			// Create a slightly modified new_record out of the registration data
			let new_record = {
				'email': registration_data.email,	// Copied verbatim
				'password': {		// Will be hashed and salted, null for now
					'salt': null,
					'hash': null,
				},
				'full_name': registration_data.name,	// verbatim
				'grad_year': registration_data.grad_year,	// verbatim
				'in_mailing_list': registration_data.subscribe,	// verbatim
			};

			// var pre_hash_time = Date.now();	//For testing hash time

			/* Create a randomly generated 32-byte salt and convert it into a hex string */
			new_record.password.salt = crypto.randomBytes(32).toString('hex');

			/* Hash the given password using the salt and the constant PBKDF2 parameters */
			new_record.password.hash = crypto.pbkdf2Sync(
				registration_data.password,
				new_record.password.salt,
				PBKDF2_NUM_ITERATIONS,
				PBKDF2_KEY_LEN,
				PBKDF2_ALGO)
				.toString('hex');		// Turn it into a hex string

			// var pre_hash_time = Date.now() - before;	//For hash time
			// console.log('Duration of hash: ' + hash_time );
			//
			// console.log('new_record: ');
			// console.log(new_record);

			// Create the record in the database
			db_mgmt.create_account(new_record, (error)=>{
				/* If a parameter was sent, it is an error message. Pass it along a callback. */
				if (error) callback(error);
				else callback();	// Otherwise, pass no error on the callback
			});
		}
	};

	/* Authenticate a given email and password */
	function authenticate(login_data, callback) {
		/* Validate the email address */
		if (!(isEmail(login_data.email))) {
			/* IF it's not valid, send an error up through the callback */
			callback({
				'code': 400,
				'text': '[account_mgmt.js->]: Error - Attempted to log into an account with an invalid email: '
					+ login_data.email,
			});
		} else {
			/* Otherwise, attempt to retrieve the account record from the database */
			db_mgmt.retrieve(login_data.email, (error, result)=>{
				if (error) {
					callback(error);	// If there was an error, send it up through the callback
				/* If there was no error, verify the given credentials against those retrieved from the database */
				} else {
					let authenticated = verify_credentials(login_data.password, result.salt, result.hash);
					if (authenticated) {
						callback(null);	// Call back without an error
					} else {
						callback({
							'code': 401,
							'text': '[account_mgmt.js->]: Error - Attempted to log into an ' +
								'account with the wrong credentials: ' + login_data.email,
						});
					}
				}
			});
		}
	}

	/* Hashes a given password and salt and compares it against an existing hash. */
	function verify_credentials(given_pw, salt, stored_hash) {
		let test_hash = crypto.pbkdf2Sync(
			given_pw, salt,
			PBKDF2_NUM_ITERATIONS,
			PBKDF2_KEY_LEN,
			PBKDF2_ALGO)
			.toString('hex');

		/* Return true if the hashes match, false otherwise. */
		return (test_hash === stored_hash);
	}

	/* Generate a session random 32-byte hex string to use as a session token,
	 	and store the session in the database, associated with the requesting email address*/
	function generate_session_token(email_addr, time_to_expiration, callback) {
		let token = crypto.randomBytes(32).toString('hex');
		let expiry_date = new Date(Date.now() + time_to_expiration);
		db_mgmt.create_session(token, email_addr, expiry_date, (error)=>{
			if (error) {
				callback(error, null);
			} else {
				/* Put in a timeout to remove the session from the database when its cookie expires */
				setTimeout(
					function() {
invalidate_session(token);
},
					time_to_expiration);
				callback(null, token);
			}
		});
	}
	/* Confirms whether the token corresponds to an active session. If it does, calls back
		with the email associated with it.*/
	function validate_session(session_token, callback) {
		db_mgmt.validate_session(session_token, (error, is_valid, email)=>{
			// IF there was an error
			if (error) {
				// Call back with the error, specify invalid token, and null email
				callback(error, false, null);
			/* If there was no error... */
			} else {
				/* If the session is valid, call back with no error, true for is_valid, and the email
					associated with the ession.*/
				if (is_valid) {
					callback(null, true, email);
				} else {
					/* If the session wasn't valid, call back with no error, false for is_valid, and null
						for the email. */
					callback(null, false, null);
				}
			}
		});
	}

	/* Removes any entries in the DB with a matching session id */
	function invalidate_session(session_token) {
		db_mgmt.remove_session(session_token, (error)=>{
			if (error) {
console.log(error);
}
		});
	}
	/* Given an account's email addres, gets the associated name. */
	function get_name_from_email(email_addr, callback) {
		db_mgmt.retrieve(email_addr, (error, data)=>{
			console.log(data);
			if (error) {
				callback(error, null);
			} else {
				callback(null, data.name);
			}
		});
	}

	function isEmail(email) {
		return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( email ); // eslint-disable-line
	}

	// Revealing Module: Return public interface
	return {
		// Public methods here
		register_new_user: register_new_user,
		authenticate: authenticate,
		session_token: generate_session_token,
		validate_session: validate_session,
		get_name_from_email: get_name_from_email,
	};
});

module.exports = account_mgmt_module();
