const mysql = require('mysql');  // For mySQL interaction
const util = require('../utils');
const createError = require('http-errors');

/* Create a connection pool for mysql queries */
let sql_pool = mysql.createPool({
	connectionLimit: 15,	// This max is dictated by our Heroku JawsDB plan lol
	host: process.env.DB_HOST,	// Use the credentials from the .env file
	port: process.env.DB_PORT,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	insecureAuth: true, // Will change later
});

console.log(`[INFO] Booted MySQL pool @ ${process.env.DB_HOST} with credentials from file `);

/* Check if the SQL server credentials are actually valid instead of waiting for the first query */
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
let db_mgmt_module = function () {
	function queryAsync(query, values) {
		return new Promise((resolve, reject) => {
			sql_pool.query(
				query,
				values,
				function (error, results, fields) {
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

		if (await account_exists(new_record.email)) { //check email
			throw new createError.Conflict('Attempted to create duplicate account: '
				+ new_record.email
			);
		}

		if (await account_exists(new_record.ufl_email)) { //check ufl_email
			throw new createError.Conflict('Attempted to create duplicate account: '
				+ new_record.ufl_email
			);
		}

		else {
			await insert_new_account(new_record);

			return;
		}

		/* Helper function: Check if an account with the given email already exists.*/
		async function account_exists(email) {
			if (email !== 'left_blank@ufl.edu') //check if placeholder email used
			{
				/* Form a query to the 'accounts' table for entries with the given email */
				let results = await queryAsync('SELECT `id` FROM `account` WHERE email = ?', email);
				if (results.length <= 0)
					results = await queryAsync('SELECT `id` FROM `account` WHERE ufl_email = ?', email);
				return results.length > 0;
			}
			console.log("ERROR: Tried to lookup account by placeholder email left_blank@ufl.edu");
			return false;
		}

		/* Helper function: Inserts a new account element into the database with the
		parameters passed in the new_account object */
		async function insert_new_account(new_account) {
			let values = {
				full_name: new_account.full_name,
				email: new_account.email,
				ufl_email: new_account.ufl_email,
				permissions: '',
				password: new_account.password.salt + '$' + new_account.password.hash,
				registration_ip: new_account.registration_ip,
				registration_date: util.mysql_iso_time(new Date(Date.now())),
				grad_date: new_account.grad_date,
//				mass_mail_optin: new_account.in_mailing_list,
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

		if (email_addr === 'left_blank@ufl.edu') {
			throw new createError.NotFound('No account with email address ' + email_addr);
		}

		let results = await queryAsync('SELECT ?? FROM `account` WHERE email = ?',
			[['id', 'password', 'full_name'], email_addr]);

		/* If the results array has any elements in it, call back with the 0th element
		(entries are unique) */
		if (results.length <= 0) {
			results = await queryAsync('SELECT ?? FROM `account` WHERE ufl_email = ?',
				[['id', 'password', 'full_name'], email_addr]);
			if (results.length <= 0) {
				throw new createError.NotFound('No account with email address ' + email_addr);
			}
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
		const results = await queryAsync('SELECT * FROM `session` WHERE ?', { id: session_token });

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

	// Function to store election within the database
	async function create_poll(election) {
		if (await election_exists()) {
			throw new createError.Conflict('Cannot make a new poll when there is already one in process!');
		}
		else {
			await add_candidates(election);
		}

		// Helper function that checks if there is currently an election running
		async function election_exists() {
			let results = await queryAsync('SELECT * FROM `candidates`');
			return results.length > 0;
		}

		// Helper function that stores candidates and their desired positions
		async function add_candidates(election) {
			election.forEach(function (element) {
				let values = {
					person: element.candidate,
					pres: 0,
					vp: 0,
					treas: 0,
					secr: 0,
					develop: 0,
				};
				if (element.position.includes('President')) { values.pres = 1; }
				if (element.position.includes('VP')) { values.vp = 1; }
				if (element.position.includes('Treasurer')) { values.treas = 1; }
				if (element.position.includes('Secretary')) { values.secr = 1; }
				if (element.position.includes('Competition & Development')) { values.develop = 1; }
				queryAsync('INSERT INTO `candidates` SET ?', values);
			});
		}
	}

	// Returns true if there is currently an election; otherwise it returns false
	async function current_election() {
		let results = await queryAsync('SELECT * FROM `candidates`');
		return results.length > 0;
	}

	// Grabs the candidates for each position and puts them into a JSON object to be returned to the voting component
	async function get_candidates() {
		return {
			'president': await queryAsync('SELECT `person` FROM `candidates` WHERE `pres` = 1'),
			'vp': await queryAsync('SELECT `person` FROM `candidates` WHERE `vp` = 1'),
			'treasurer': await queryAsync('SELECT `person` FROM `candidates` WHERE `treas` = 1', ),
			'secretary': await queryAsync('SELECT `person` FROM `candidates` WHERE `secr` = 1'),
			'development': await queryAsync('SELECT `person` FROM `candidates` WHERE `develop` = 1'),
		};
	}

	// Returns true if a person has not voted yet
	async function have_not_voted(user_id) {
		let results = await queryAsync('SELECT * FROM `voters` WHERE `person` = ?', user_id);
		return results.length < 1;
	}

	// Returns true if a person is elibible to vote
	async function is_eligible(id) {
		let results = await queryAsync('SELECT * FROM eligible_voters WHERE id = ?', id);
		return results.length > 0;
	}

	// Validates and records a user's vote
	async function record_vote(vote, user_id) {
		if (await verify_valid_vote()) {
			try {
				sql_pool.getConnection(function(err, connection) {
					if (err) {
						throw err;
					}

					connection.beginTransaction(function(err) {
						if(err) {
							connection.release();
							throw err;
						}

						// Every function called below is executed inside of the connection query
						// thus, everything between here and commit will be rolled back in case of an error
						try {
							record_that_user_voted(connection);
							if (vote.president.length) { insert_votes('`president`', vote.president, connection); }
							if (vote.vp.length) { insert_votes('`vp`', vote.vp, connection); }
							if (vote.treasurer.length) { insert_votes('`treasurer`', vote.treasurer, connection); }
							if (vote.secretary.length) { insert_votes('`secretary`', vote.secretary, connection); }
							if (vote.development.length) { insert_votes('`development`', vote.development, connection); }
						} catch (err) {
							connection.release();
							throw err;
						}

						connection.commit(function(err) {
							if (err) {
								connection.rollback(function() {
									connection.release();
									throw err;
								});
							} else {
								connection.release();
							}
						});
					});
				});
			} catch (error) {
				throw new createError.BadRequest('There seems to be a problem with the db.  Please contact the developers');
			}
		} else {
			throw new createError.BadRequest('There is an error in the request');
		}

		// Adds a users email to the voters table so that they cannot vote again
		function record_that_user_voted(connection) {
			connection.query('INSERT INTO `voters` SET ?', {person: user_id}, function(err) {
				if (err) { throw err; }
			});
		}

		// Verifies that a vote is valid
		async function verify_valid_vote() {
			try {
				// Verifies all president choices
				for (var pres of vote.president) {
					let count = await queryAsync('SELECT `person` FROM `candidates` WHERE person=? AND `pres`=1', pres);
					// If the person is not in the list of candidates for president return false
					if (count.length < 1) { return false; }
				}
				//vote.president.length = 30;
				// Verifies all vp choices
				for (var pres of vote.vp) {
					let count = await queryAsync('SELECT `person` FROM `candidates` WHERE person=? AND `vp`=1', pres);
					if (count.length < 1) { return false; }
				}
				//vote.vp.length = 30;
				// Verifies all Treasurer choices
				for (var pres of vote.treasurer) {
					let count = await queryAsync('SELECT `person` FROM `candidates` WHERE person=? AND `treas`=1', pres);
					if (count.length < 1) { return false; }
				}
				//vote.treasurer.length = 30;
				// Verifies all Secretary choices
				for (var pres of vote.secretary) {
					let count = await queryAsync('SELECT `person` FROM `candidates` WHERE person=? AND `secr`=1', pres);
					if (count.length < 1) { return false; }
				}
				//vote.secretary.length = 30;
				// Verifies all C&D choices
				for (var pres of vote.development) {
					let count = await queryAsync('SELECT `person` FROM `candidates` WHERE person=? AND `develop`=1', pres);
					if (count.length < 1) { return false; }
				}
				return true;
			} catch (error) {	// Only catches an error when you have tried to vote for a person not running
				return false;
			}
		}

		// Records a users vote after it has been thoroughly validated
		function insert_votes(position, candidate_array, connection) {
			let values = {}
			for (const [index, value] of candidate_array.entries()) {
				values[(index + 1).toString() + 'th'] = value;
			}
			connection.query('INSERT INTO ' + position + ' SET ?', values, function (error) {
				if (error) { throw error; }
			});
		}
	}

	async function end_election() {
		if (await current_election()) {
			await queryAsync('DELETE FROM `candidates`');
		}
		else {
			throw new createError.BadRequest('There was an error trying to delete from the database');
		}
	}

	// Grabs all the ranking of every position and returns those inside of a promise
	async function get_votes() {
		try {
			const results = {
				president: await queryAsync('SELECT * FROM `president`'),
				vp: await queryAsync('SELECT * FROM `vp`'),
				treasurer: await queryAsync('SELECT * FROM `treasurer`'),
				secretary: await queryAsync('SELECT * FROM `secretary`'),
				development: await queryAsync('SELECT * FROM `development`'),
			};
			return results;
		} catch (error) {
			throw new createError.BadRequest('There was an error trying to query the results of the election');
		}
	}

	// Stores the results of an election
	async function store_results(results) {
		// Everything get converted to a string and the results are stored
		try {
			await queryAsync('INSERT INTO `results` SET ?', { position: 'president', json: JSON.stringify(results.president) });
			await queryAsync('INSERT INTO `results` SET ?', { position: 'vp', json: JSON.stringify(results.vp) });
			await queryAsync('INSERT INTO `results` SET ?', { position: 'treasurer', json: JSON.stringify(results.treasurer) });
			await queryAsync('INSERT INTO `results` SET ?', { position: 'secretary', json: JSON.stringify(results.secretary) });
			await queryAsync('INSERT INTO `results` SET ?', { position: 'development', json: JSON.stringify(results.development) });
		} catch (error) {
			throw new createError.BadRequest('There was an error trying to store the results of the election');
		}
	}

	// Deletes everything having to do with voting (except candidates running because that was already deleted)
	async function clear_database() {
		let delete_error = new createError.BadRequest('There was an error trying to delete the results of the election');

		sql_pool.getConnection(function(err, connection) {
			if (err) { throw delete_error; }

			connection.beginTransaction(function(err) {
				if (err) { throw delete_error; }

				// Either delete from president or role back any changes that had been made
				connection.query('DELETE FROM `president`', function (err, result) {
					if (err) { throw delete_error; }
				});
				connection.query('DELETE FROM `vp`', function(err, result) {
					if (err) { throw delete_error;}
				});
				connection.query('DELETE FROM `treasurer`', function (err, result) {
					if (err) { throw delete_error; }
				});
				connection.query('DELETE FROM `secretary`', function(err, result) {
					if (err) {throw delete_error;}
				});
				connection.query('DELETE FROM `development`', function(err, result) {
					if (err) {throw delete_error;}
				});
				connection.query('DELETE FROM `voters`', function (err, result) {
					if (err) { throw delete_error; }
				});
				connection.query('DELETE FROM `results`', function(err, result) {
					if (err) {throw delete_error;}
				});

				// TODO: make sure this list is cleared from year to year
				//connection.query('DELETE FROM `eligible_voters`', function(err, result) {
				//	if (err) {throw delete_error;}
				//});

				connection.commit(function(err) {
					if (err) {
						connection.rollback(function() {
							connection.release();
							throw err;
						});
					} else {
						connection.release();
					}
				});
			});
		});
	}

	async function get_election_results() {
		let results = {
			president: await queryAsync('SELECT `json` FROM `results` WHERE position="president"'),
			vp: await queryAsync('SELECT `json` FROM `results` WHERE position = "vp"'),
			treasurer: await queryAsync('SELECT `json` FROM `results` WHERE position = "treasurer"'),
			secretary: await queryAsync('SELECT `json` FROM `results` WHERE position = "secretary"'),
			development: await queryAsync('SELECT `json` FROM `results` WHERE position="development"'),
		}
		results.president = JSON.parse(results.president[0].json);
		results.vp = JSON.parse(results.vp[0].json);
		results.treasurer = JSON.parse(results.treasurer[0].json);
		results.secretary = JSON.parse(results.secretary[0].json);
		results.development = JSON.parse(results.development[0].json);
		return results;
	}

	async function there_are_results() {
		let result = await queryAsync('SELECT * FROM `results`');
		return result.length > 0;
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
		create_poll: create_poll,
		current_election: current_election,
		get_candidates: get_candidates,
		have_not_voted: have_not_voted,
		is_eligible: is_eligible,
		record_vote: record_vote,
		end_election: end_election,
		get_votes: get_votes,
		store_results: store_results,
		there_are_results: there_are_results,
		get_election_results: get_election_results,
		clear_database: clear_database
	});
};

/* Export the module by calling the db_mgmt_module() function, which returns an object
with the intended public interface */
module.exports = db_mgmt_module();
