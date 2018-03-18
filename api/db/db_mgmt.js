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
		console.log('[ERROR] Unable to load database credentials from \'' + CREDENTIALS +
				'\' OR from the JAWSDB_MARIA_URL environment.\n' +
			'Ensure that you have this file available in your current directory.');
		process.exit(1);
		return;
	}

	sql_pool = mysql.createPool(url);
}

/* Check if the SQL server credentials are actually valid instead of waiting for the first
   query */
sql_pool.getConnection((error, connection) => {
	if (error) {
		console.log('[ERROR] Could not connect to the database:', error.message);
		console.log('Double check the database configuration you provided.');
		process.exit(1);
		return;
	}

	connection.release();
});

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
		/* Use the account_exists function to check if an account with that
		email address already exists. In the function, we either throw an
		error if there was a conflict, or proceed creating
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
				grad_date: new_account.grad_date,
				mass_mail_optin: new_account.in_mailing_list,
			};

			return await queryAsync('INSERT INTO `account` SET ?', values);
		}
	}

	async function update_account(account_id, account_data) {
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
			throw new createError.BadRequest('Cannot update profile with zero fields');
		}

		// console.log("Updating account", account_id, "with", account_data);

		return await sql_pool.query('UPDATE `account` SET ? WHERE id = ?', [account_data, account_id]);
	}

	async function list_users() {
		return await queryAsync('SELECT ?? FROM `account`',
			[['id', 'email', 'full_name', 'mass_mail_optin', 'grad_date', 'registration_date']]);
	}

	/* Retrieve an account with the given email address */
	async function retrieve(email_addr) {
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
	async function retrieve_by_id(account_id) {
		/* Execute the query using a connection from the connection pool */
		const results = await queryAsync('SELECT * FROM `account` WHERE id = ?', [account_id]);

		if (results.length > 0) {
			// Hide certain fields
			delete results[0].id;
			delete results[0].password;

			return results[0];
		} else {
			/* Otherwise, return a 404 (for no matching record) and null for the result*/
			throw new createError.NotFound('No account with id ' + account_id);
		}
	}

	/* Create an entry in the sessions table */
	async function create_session(session_token, account_id,
			start_date, expire_date, ip_address, browser) {
		const values = {
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
	async function get_session(session_token) {
		const results = await queryAsync('SELECT * FROM `session` WHERE ?', {id: session_token});

		if (results.length > 0) {
			return results[0];
		} else {
			/* Otherwise, return a 404 (for no matching record) and null for the result*/
			throw new createError.NotFound('No session with token ' + session_token);
		}
	}

	/* Remove an entry from the sessions table */
	async function remove_session(session_id) {
		return await queryAsync('DELETE FROM `session` WHERE id = ?', [session_id]);
	}

	/* Sign a user into an event */
	async function sign_in(email, timestamp) {
		let values = {
			email: email,
			timestamp: timestamp,
		};

		return await queryAsync('INSERT INTO `event_sign_ins_old` SET ?', values);
	}

	/* Get all signins for a user with a constraint of time */
	async function get_sign_ins(email, after) {
		return await queryAsync('SELECT * FROM `event_sign_ins_old` WHERE `email` = ? AND `timestamp` >= ?',
			[email, after]);
	}

	/* Get a list of the user's writeup submissions */
	async function get_writeup_submissions(account_id) {
		return await queryAsync('SELECT `key` FROM `writeup_submissions` WHERE `account_id` = ?',
			account_id);
	}

	/* Records a writeup submission */
	async function record_writeup_submission(account_id, key) {
		const values = {
			account_id: account_id,
			key: key,
		};
		return await queryAsync('INSERT INTO `writeup_submissions` SET ?', values);
	}

	/* Records an image upload */
	async function record_image_upload(account_id, key) {
		const values = {
			account_id: account_id,
			key: key,
		};
		return await queryAsync('INSERT INTO `image_uploads` SET ?', values);
	}

	// Function to store election within the database
	async function create_poll(election) {
		if (await poll_exists()) {
			throw new createError.Conflict('Cannot make a new poll when there is already one in process!');
		}
		else {
			await add_candidates(election);
		}

		// Helper function that checks if there is currently an election running
		async function poll_exists() {
			let results = await queryAsync('SELECT * FROM `candidates`');
			return results.length > 0;
		}

		// Helper function that stores candidates and their desired positions
		async function add_candidates(election) {
			election.forEach(function(element) {
				let values = {
					person: element.candidate,
					pres: 0,
					vp: 0,
					treas: 0,
					secr: 0
				}
				if (element.position.includes('President')) { values.pres = 1; }
				if (element.position.includes('VP')) { values.vp = 1; }
				if (element.position.includes('Treasurer')) { values.treas = 1; }
				if (element.position.includes('Secretary')) { values.secr = 1; }
				queryAsync('INSERT INTO `candidates` SET ?', values);
			});
		}
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
		get_writeup_submissions: get_writeup_submissions,
		record_writeup_submission: record_writeup_submission,
		record_image_upload: record_image_upload,
		create_poll: create_poll
	});
};

/* Export the module by calling the db_mgmt_module() function, which returns an object
with the intended public interface */
module.exports = db_mgmt_module();