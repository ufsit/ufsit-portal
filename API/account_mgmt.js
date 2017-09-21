/* Simple, non-account sign-in. Scrap for parts :) */

const fs = require('fs');				//For filesystem I/O
const crypto = require('crypto');	//For crypto

const db_mgmt = require('./db_mgmt.js');	//Abstracts away DB interactions

/* Crypto parameters.
WARNING: DO NOT CHANGE THESE!!, WILL INVALIDATE EXISTING ACCOUNTS.
If they need to be updated, you'll need to re-hash all account passwords */
const PBKDF2_NUM_ITERATIONS = 100000;	//100000 iterations is pretty fast and secure
const PBKDF2_KEY_LEN = 64;					//64bit hashes
const PBKDF2_ALGO = 'sha512';				//Use sha512

var account_mgmt_module = (function(){
	var register_new_user = function(registration_data, callback){
		//Create a slightly modified new_record out of the registration data
		var new_record = {
			"email": registration_data.email,	//Copied verbatim
			"password":{		//Will be hashed and salted, null for now
				"salt": null,
				"hash": null
			},
			"full_name": registration_data.name,	//verbatim
			"in_mailing_list": registration_data.subscribe	//verbatim
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
			.toString('hex');		//Turn it into a hex string

		// var pre_hash_time = Date.now() - before;	//For hash time
		// console.log('Duration of hash: ' + hash_time );

		// console.log('new_record: ');
		// console.log(new_record);

		//Create the record in the database
		db_mgmt.create(new_record,(error)=>{
			/* If a parameter was sent, it is an error message. Pass it along a callback. */
			if(error) callback(error);
			else callback();	//Otherwise, pass no error on the callback
		});
	}

	function authenticate(login_data,callback){

	}

	// function verify_credentials(given_pw,salt,stored_hash){
	// 	var given_pw = given_data.password;
	//
	// 	var test_hash = crypto.pbkdf2Sync(
	// 		given_pw, salt,
	// 		PBKDF2_NUM_ITERATIONS,
	// 		PBKDF2_KEY_LEN, PBKDF2_ALGO)
	// 		.toString('hex');
	//
	// 	console.log('Derived hash:\n' + test_hash + '\nStored hash:\n' + stored_hash);
	// }

	function isEmail(email){
		return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( email );
	}

	//Revealing Module: Return public interface
	return {
		//Public methods here
		register_new_user: register_new_user,
		authenticate: authenticate
	}
});

module.exports = account_mgmt_module();
