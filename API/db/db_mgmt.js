'use strict';

const fs = require('fs');						// For filesystem I/O
const mysql = require('mysql');		// For mySQL interaction
const util = require.main.require('./util');
const createError = require('http-errors');
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
	function queryAsync(query, values) {
		return new Promise((resolve, reject) => {
			sql_pool.query(
				query,
				values,
				function(error, results, fields) {
					if (error) {
						// Create a generic HTTP error for display
						const httperror = createError();

						// copy the MySQL stack trace as the one we just generated is useless
						httperror.stack = error.stack;

						reject(httperror);
					} else {
						resolve(results);
					}
				}
			);
		});
	}

	/* Create a new account */
	async function create_account(new_record) {
		/* Use the check_account_conflict function to check if an account with that
		email address already exists. In the callback function, either throw an
		error up through the callback if there was a conflict, or proceed creating
		the account */

		if (await account_exists(new_record.email)) {
			throw new createError.Conflict('Attempted to create duplicate account: '
				+ new_record.email
			);
		} else {
			await insert_new_account(new_record);

			return;
		}

		/* Helper function: Check if an account with the given email already exists.*/
		async function account_exists(email) {
			/* Form a query to the 'accounts' table for entries with the given email */
			let results = await queryAsync('SELECT `id` FROM `account` WHERE email = ?', email);

			return results.length > 0;
		}

		/* Helper function: Inserts a new account element into the database with the
		parameters passed in the new_account object */
		async function insert_new_account(new_account) {
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

			return await queryAsync('INSERT INTO `account` SET ?', values);
		}
	}

	function update_account(account_id, account_data, callback) {
		// explicitly prevent primary keys from being clobbered
		if (account_data.id) {
			delete account_data.id;
		}

		// Format the password correctly, if present
		if (account_data.password && account_data.password.salt && account_data.password.hash) {
			account_data.password = account_data.password.salt + '$' + account_data.password.hash;
			delete account_data.salt;
		} else {
			delete account_data.password;
			delete account_data.salt;
		}

		if (account_data.length < 1) {
			return callback('Cannot update profile with zero fields');
		}

		// console.log("Updating account", account_id, "with", account_data);

		sql_pool.query(
			'UPDATE `account` SET ? WHERE id = ?',
			[account_data, account_id],
			function(error, results, fields) {
				if (error) {
					callback(error);
				} else {
					callback();
				}
			}
		);
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
	async function retrieve(email_addr, callback) {
		/* Form a query to the 'accounts' table for entries with the given email */
		/* Execute the query using a connection from the connection pool */
		const results = await queryAsync('SELECT ?? FROM `account` WHERE email = ?',
			[['id', 'password', 'full_name'], email_addr]);

		/* If the results array has any elements in it, call back with the 0th element
		(entries are unique) */
		if (results.length <= 0) {
			throw new createError.NotFound('No account with email address ' + email_addr);
		}

		let pwparts = results[0].password.split('$');

		return {	// Encapsulate the results nicely for account_mgmt.js
			'id': results[0].id,
			'salt': pwparts[0],
			'hash': pwparts[1],
			'name': results[0].full_name,
		};
	}

	/* Retrieve an account by account ID */
	function retrieve_by_id(account_id, callback) {
		/* Execute the query using a connection from the connection pool */
		sql_pool.query(
			'SELECT * FROM `account` WHERE id = ?',
			[account_id],
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
						// Hide certain fields
						delete results[0].id;
						delete results[0].password;

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
	async function create_session(session_token, account_id,
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
		return await queryAsync('INSERT INTO `session` SET ?', values);
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

	/* Get all signins for a user with a constraint of time */
	function get_sign_ins(email, after, callback) {
		sql_pool.query(
			'SELECT * FROM `event_sign_ins_old` WHERE `email` = ? AND `timestamp` >= ?',
			[email, after],
			function(error, results, fields) {
				if (error) {
					callback(error, null);
				} else {
					callback(null, results);
				}
			}
		);
	}

	// Revealing module
	return ({
		create_account: create_account,
		update_account: update_account,
		retrieve: retrieve,
		retrieve_by_id: retrieve_by_id,
		create_session: create_session,
		get_session: get_session,
		remove_session: remove_session,
		sign_in: sign_in,
		get_sign_ins: get_sign_ins,
		list_users: list_users,
	});
};

/* Export the module by calling the db_mgmt_module() function, which returns an object
with the intended public interface */
module.exports = db_mgmt_module();
