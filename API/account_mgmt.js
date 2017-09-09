/* Simple, non-account sign-in. Scrap for parts :) */

const fs = require('fs');				//For filesystem I/O
const crypto = require('crypto');	//For crypto

const db_mgmt = require('./db_mgmt.js');	//Abstracts away DB interactions

/* Crypto parameters.
WARNING: DO NOT CHANGE THESE!!, WILL INVALIDATE EXISTING ACCOUNTS.
If they need to be updated, you'll need to re-hash all account passwords */
const pbkdf2_num_iterations = 100000;
const pbkdf2_key_len = 64;
const pbkdf2_algo = 'sha512';

var account_mgmt_module = (function(){
	var register_new_user = function(registration_data, callback){
		console.log('Registering new user: ');
		console.log(registration_data);

		var new_record = {
			"email": registration_data.email,
			"password":{
				"salt": null,
				"hash": null
			},
			"full_name": registration_data.name,
			"in_mailing_list": registration_data.subscribe
		};

		// var pre_hash_time = Date.now();	//For testing hash time
		new_record.password.salt = crypto.randomBytes(32).toString('hex');
		new_record.password.hash = crypto.pbkdf2Sync(
			registration_data.password,
			new_record.password.salt,
			pbkdf2_num_iterations,
			pbkdf2_key_len, pbkdf2_algo)
			.toString('hex');

		// var pre_hash_time = Date.now() - before;	//For hash time
		// console.log('Duration of hash: ' + hash_time );
		console.log(new_record);

		//Create the record in the database
		db_mgmt.create(new_record);

		//Return
		callback();
	}

	function isEmail(email){
		return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( email );
	}

	//Revealing Module: Return public interface
	return {
		//Public methods here
		register_new_user: register_new_user
	}
});

module.exports = account_mgmt_module();
