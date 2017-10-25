'use strict';

const fs = require('fs');						// For filesystem I/O
const mysql = require('mysql');		// For mySQL interaction
const util = require('../util');
const CREDENTIALS = process.env.CREDENTIALS || 'credentials.json';

let sql_pool = null;

try {
	/* Grab the database credentials from the JSON file */
	const credentials = JSON.parse(fs.readFileSync(CREDENTIALS, 'utf8'));

	/* Create a connection pool for mysql queries */
	sql_pool = mysql.createPool({
		connectionLimit: 15,	// This max is dictated by our Heroku JawsDB plan lol
		host: credentials.db.host,	// Use the credentials from the credentials.json file
		port: credentials.db.port,
		user: credentials.db.username,
		password: credentials.db.password,
		database: credentials.db.database,
	});

	console.log('[INFO] Booted MySQL pool @ \''
			+ credentials.db.host + '\' with credentials from file \''
			+ CREDENTIALS + '\'');
} catch (err) {
	console.log('Failed to read credentials. Checking for available environment variable...');
	let url = process.env.JAWSDB_MARIA_URL;

	if (url == undefined || url == null) {
		throw new Error('Unable to load database credentials from ' + CREDENTIALS +
				'.\nEnsure that you have this file available in your current directory.');
	}

	sql_pool = mysql.createPool(url);
}

/* Define the database management module and its public API */
let db_mgmt_module = function() {
	/* Create a new account */
	function create_account(new_record, callback) {
		/* Use the check_account_conflict function to check if an account with that
		email address already exists. In the callback function, either throw an
		error up through the callback if there was a conflict, or proceed creating
		the account */
		check_account_conflict(new_record.email, (error)=>{
			/* If it does, make a callback with the error */
			if (error) {
				if (error.code === 409) {
					callback({
						'code': 409,	// HTTP Identifier for the error: 409 => conflict
						'text': '[db_mgmt.js->]: Error - Attempted to create duplicate account: ' + new_record.email,
					});
				} else {
					callback({
						'code': 500,	// HTTP Identifier for the error: 500 => Mysql error
						'text': error.text,
					});
				}
			} else {
				/* Otherwise proceed creating the account */
				insert_new_account(new_record, (err)=>{
					/* If there was an error inserting the record, send it up through the callback */
					if (err) {
						callback({
							'code': 500,	// HTTP Identifier for the error: 409 => conflict
							'text': err,		// Just send back the raw error text
						});
					} else {
						callback(); // Otherwise call back with no error
					}
				});
			}
		});
		/* Helper function: Check if an account with the given email already exists.
		If it does, call back  with true. If it doesn't, call back with false. */
		function check_account_conflict(new_email, callback) {
			/* Form a query to the 'accounts' table for entries with the given email */
			/* Execute the query using a connection from the connection pool */
			sql_pool.query(
				'SELECT `id` FROM `account` WHERE email = ?',
				[new_email],
				function(error, results, fields) {
					if (error) {	// If there was an error, pass it up through the callback
						callback({
							'code': 500,
							'text': error,
						});
					} else {
						/* If the results array has any elements in it, call back with true
						(to indicate that there was a conflict) */
						if (results.length > 0) {
							callback({
								'code': 409,	// Duplicate
							});
						} else {
							/* Otherwise, call back withhout an error to indicate a lack of conflict */
							callback();
						}
					}
				}
			);
		}

		/* Helper function: Inserts a new account element into the database with the
		parameters passed in the new_account object */
		function insert_new_account(new_account, callback) {
			let values = {
				full_name: new_account.full_name,
				email: new_account.email,
				permissions: '',
				password: new_account.password.salt + '$' + new_account.password.hash,
				registration_ip: new_account.registration_ip,
				registration_date: util.mysql_iso_time(new Date(Date.now())),
				grad_date: new_account.grad_year,
				mass_mail_optin: new_account.in_mailing_list,
			};

			/* Execute the query using a connection from the connection pool */
			sql_pool.query(
				'INSERT INTO `account` SET ?',
				values,
				function(error, results, fields) {
					if (error) {
						// If there was an error, send it up through the callback
						callback(error);
					} else {
						callback();	// Otherwise call back with no errors
					}
				}
			);
		}
	}

   function list_users(callback) {
		sql_pool.query(
			'SELECT ?? FROM `account`',
			[['email', 'full_name', 'mass_mail_optin', 'grad_date']],
			function(error, results, fields) {
				/* If there was a sql error, send it up through the callback */
				if (error) {
					callback({
						'code': 500,
						'text': error,
					}, null);	// 2nd parameter (which is usually the result) is null
				} else {
                  callback(null, results);
				}
			}
		);
   }

	/* Retrieve an account with the given email address */
	function retrieve(email_addr, callback) {
		/* Form a query to the 'accounts' table for entries with the given email */
		/* Execute the query using a connection from the connection pool */
		sql_pool.query(
			'SELECT ?? FROM `account` WHERE email = ?',
			[['id', 'password', 'full_name'], email_addr],
			function(error, results, fields) {
				/* If there was a sql error, send it up through the callback */
				if (error) {
					callback({
						'code': 500,
						'text': error,
					}, null);	// 2nd parameter (which is usually the result) is null
				} else {
					/* If the results array has any elements in it, call back with the 0th element
					(entries are unique) */
					if (results.length > 0) {
						let pwparts = results[0].password.split('$');
						// Callback with no error, and 2nd param is the results
						callback(null, {	// Encapsulate the results nicely for account_mgmt.js
							'id': results[0].id,
							'salt': pwparts[0],
							'hash': pwparts[1],
							'name': results[0].full_name,
						});
					} else {
						/* Otherwise, call back with a 404 (for no matching record) and null for the result*/
						callback({
							'code': 404,	// No results
							'text': 'No account with email address ' + email_addr,
						}, null);
					}
				}
			}
		);
	}

	/* Retrieve an account by account ID */
	function retrieve_by_id(account_id, callback) {
		/* Execute the query using a connection from the connection pool */
		sql_pool.query(
			'SELECT ?? FROM `account` WHERE id = ?',
			[['id', 'email', 'full_name'], account_id],
			function(error, results, fields) {
				/* If there was a sql error, send it up through the callback */
				if (error) {
					callback({
						'code': 500,
						'text': error,
					}, null);	// 2nd parameter (which is usually the result) is null
				} else {
					/* If the results array has any elements in it, call back with the 0th element
					(entries are unique) */
					if (results.length > 0) {
						callback(null, results[0]);
					} else {
						/* Otherwise, call back with a 404 (for no matching record) and null for the result*/
						callback({
							'code': 404,	// No results
							'text': 'No account with id ' + account_id,
						}, null);
					}
				}
			}
		);
	}

	/* Create an entry in the sessions table */
	function create_session(session_token, account_id,
			start_date, expire_date, ip_address, browser, callback) {
		let values = {
			id: session_token,
			account_id: account_id,
			start_date: util.mysql_iso_time(start_date),
			expire_date: util.mysql_iso_time(expire_date),
			ip_address: ip_address,
			browser: browser,
		};

		/* Execute the query using a connection from the connection pool */
		sql_pool.query(
			'INSERT INTO `session` SET ?',
			values,
			function(error, results, fields) {
				if (error) {
					callback(error);
				} else {
					callback();
				}
			}
		);
	}

	/* Confirms whether the token corresponds to an active session. If it does, calls back
		with the email associated with it.*/
	function get_session(session_token, callback) {
		/* Execute the query using a connection from the connection pool */
		sql_pool.query(
			'SELECT * FROM `session` WHERE ?',
			{id: session_token},
			function(error, results, fields) {
				/* If there were no errors... */
				if (error) {
					// If there was an error, send it up through the callback
					callback(error, null);
				} else {
					/* If there was a match */
					if (results.length > 0) {
						/* Call back with no error and the session */
						callback(null, results[0]);
					} else {
						/* If there was no match */
						/* Call back with no error, but also no session */
						callback(null, null);
					}
				}
			}
		);
	}

	/* Remove an entry from the sessions table */
	function remove_session(session_id, callback) {
		/* Execute the query using a connection from the connection pool */
		sql_pool.query(
			'DELETE FROM `session` WHERE id = ?',
			[session_id],
			function(error, results, fields) {
				if (error) {
					callback(error);
				} else {
					callback();	// Otherwise call back with no errors
				}
			}
		);
	}
	/* Sign a user into an event */
	function sign_in(email, timestamp, callback) {
		let values = {
			email: email,
			timestamp: timestamp,
		};

		sql_pool.query(
			'INSERT INTO `event_sign_ins_old` SET ?',
			values,
			function(error, results, fields) {
				if (error) {
					callback(error);
				} else {
					callback();	// Otherwise call back with no errors
				}
			}
		);
	}

	// Revealing module
	return ({
		create_account: create_account,
		retrieve: retrieve,
		retrieve_by_id: retrieve_by_id,
		create_session: create_session,
		get_session: get_session,
		remove_session: remove_session,
		sign_in: sign_in,
		list_users: list_users,
	});
};

/* Export the module by calling the db_mgmt_module() function, which returns an object
with the intended public interface */
module.exports = db_mgmt_module();
