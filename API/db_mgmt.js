var fs = require('fs');						//For filesystem I/O
var mysql      = require('mysql');		//For mySQL interaction
var jsonSql = require('json-sql')();	//To make it easier to create queries based on JSON data
jsonSql.configure({
	separatedValues: true,		//Use placeholders for each string value
	namedValues: false,			//Don't use named values (just the symbol)
	valuesPrefix: '?',			//Use '?' instead of the default '$', which allows for simple query execution
	dialect: 'mysql',				//We're using MariaDB
	wrappedIdentifiers: true,	//Wrap all identifiers with dialect wrapper (name -> "name").
	indexedValues: false			//Don't use auto-generated id for values placeholders after the value prefix
});

var sql_pool = null;

try {
	/* Grab the database credentials from the JSON file */
	const credentials = JSON.parse(fs.readFileSync('./credentials.json','utf8'));

	/* Create a connection pool for mysql queries */
	sql_pool  = mysql.createPool({
		connectionLimit : 15,	//This max is dictated by our Heroku JawsDB plan lol
		host            : credentials.db.host,	//Use the credentials from the credentials.json file
		port				 : credentials.db.port,
		user            : credentials.db.username,
		password        : credentials.db.password,
		database        : credentials.db.database
	});

} catch(err) {
	console.log("Failed to read credentials. Checking for available environment variable...");
	var url = process.env.JAWSDB_MARIA_URL;

	if(url == undefined || url == null) {
		throw "Unable to load database credentials";
	}

	sql_pool  = mysql.createPool(url);
}

/* Define the database management module and its public API */
var db_mgmt_module = function(){
	/* Create a new account */
	function create_account(new_record, callback){
		/* Use the check_account_conflict function to check if an account with that
		email address already exists. In the callback function, either throw an
		error up through the callback if there was a conflict, or proceed creating
		the account */
		check_account_conflict(new_record.email, (error)=>{
			/* If it does, make a callback with the error */
			if(error){
				if(error.code === 409){
					callback({
						'code': 409,	//HTTP Identifier for the error: 409 => conflict
						'text':'[db_mgmt.js->]: Error - Attempted to create duplicate account: ' + new_record.email
					});
				} else {
					callback({
						'code': 500,	//HTTP Identifier for the error: 500 => Mysql error
						'text': error.text
					});
				}

			}
			/* Otherwise proceed creating the account */
			else {
				insert_new_account(new_record, (err)=>{
					/* If there was an error inserting the record, send it up through the callback */
					if (err) callback({
						'code': 500,	//HTTP Identifier for the error: 409 => conflict
						'text': err		//Just send back the raw error text
					});
					else callback();	//Otherwise call back with no error
				});
			}
		});
		/* Helper function: Check if an account with the given email already exists.
		If it does, call back  with true. If it doesn't, call back with false. */
		function check_account_conflict(new_email, callback){
			/* Form a query to the 'accounts' table for entries with the given email */
			var sql_query = jsonSql.build({
				type: 'select',
				table: 'accounts',
				fields: ['email'],
				condition: {
					email: new_email
				}
			});

			/* Execute the query using a connection from the connection pool */
			sql_pool.query(
				sql_query.query,
				sql_query.values,
				function (error, results, fields) {
					if (error){	//If there was an error, pass it up through the callback
						callback({
							'code': 500,
							'text': error
						});
					} else {
						/* If the results array has any elements in it, call back with true
						(to indicate that there was a conflict) */
						if(results.length > 0){
							callback({
								'code': 409	//Duplicate
							});
						}
						/* Otherwise, call back withhout an error to indicate a lack of conflict */
						else callback();
					}
				}
			);
		}

		/* Helper function: Inserts a new account element into the database with the
		parameters passed in the new_account object */
		function insert_new_account(new_account, callback){
			var sql_query = jsonSql.build({
				type: 'insert',
				table: 'accounts',
				values: {
					email: new_account.email,
					password_salt: new_account.password.salt,
					password_hash: new_account.password.hash,
					full_name: new_account.full_name,
					grad_year: new_account.grad_year,
					in_mailing_list: new_account.in_mailing_list
				}
			});

			/* Execute the query using a connection from the connection pool */
			sql_pool.query(
				sql_query.query,
				sql_query.values,
				function (error, results, fields) {
					if (error)
					callback(err);	//If there was an error, send it up through the callback
					else callback();	//Otherwise call back with no errors
				}
			);
		}
	}

	/* Retrieve an account with the given email address */
	function retrieve(email_addr, callback){
		/* Form a query to the 'accounts' table for entries with the given email */
		var sql_query = jsonSql.build({
			type: 'select',
			table: 'accounts',
			fields: ['password_salt','password_hash','full_name'],
			condition: {
				email: email_addr
			}
		});

		/* Execute the query using a connection from the connection pool */
		sql_pool.query(
			sql_query.query,
			sql_query.values,
			function (error, results, fields) {
				/* If there was a sql error, send it up through the callback */
				if (error){
					callback({
						'code': 500,
						'text': error
					}, null);	//2nd parameter (which is usually the result) is null
				} else {
					/* If the results array has any elements in it, call back with the 0th element
					(entries are unique) */
					if(results.length > 0){
						//Callback with no error, and 2nd param is the results
						callback(null,{	//Encapsulate the results nicely for account_mgmt.js
							'salt': results[0].password_salt,
							'hash': results[0].password_hash,
							'name': results[0].full_name
						});
					}

					/* Otherwise, call back with a 404 (for no matching record) and null for the result*/
					else callback({
						'code': 404,	//No results
						'text': 'No account with email address ' + email_addr
					}, null);
				}
			}
		);
	}

	/* Create an entry in the sessions table */
	function create_session(session_token,email_addr,expiry_date,callback){
		var sql_query = jsonSql.build({
			type: 'insert',
			table: 'sessions',
			values: {
				session_id: session_token,
				email: email_addr,
				expiry_date: expiry_date
			}
		});

		/* Execute the query using a connection from the connection pool */
		sql_pool.query(
			sql_query.query,
			sql_query.values,
			function (error, results, fields) {
				if (error)
					callback(err);	//If there was an error, send it up through the callback
				else callback();	//Otherwise call back with no errors
			}
		);
	}

	/* Confirms whether the token corresponds to an active session. If it does, calls back
		with the email associated with it.*/
	function validate_session(session_token,callback){
		var sql_query = jsonSql.build({
			type: 'select',
			table: 'sessions',
			fields: ['email'],
			condition: {
				session_id: session_token
			}
		});
		/* Execute the query using a connection from the connection pool */
		sql_pool.query(
			sql_query.query,
			sql_query.values,
			function (error, results, fields) {
				if (error){
					//If there was an error, send it up through the callback
					callback(err,false,null);	//is_valid= false, email = null
				}
				/* If there were no errors... */
				else {
					/* If there was a match */
					if(results.length > 0){
						/* Call back with no error, is_valid=true, and the match email */
						callback(null, true, results[0].email);
					}
					/* If there was no match */
					else {
						/* Call back with no error, is_valid=false, and email=null */
						callback(null,false,null);
					}
				}
			}
		);
	}

	/* Remove an entry from the sessions table */
	function remove_session(session_id, callback){
		var sql_query = jsonSql.build({
			type: 'remove',
			table: 'sessions',
			condition: {
				'session_id': session_id,
			}
		});
		/* Execute the query using a connection from the connection pool */
		sql_pool.query(
			sql_query.query,
			sql_query.values,
			function (error, results, fields) {
				if (error)
					callback(err);	//If there was an error, send it up through the callback
				else callback();	//Otherwise call back with no errors
			}
		);
	}
	/* Sign a user into an event */
	function sign_in(email, timestamp, callback){
		var sql_query = jsonSql.build({
			type: 'insert',
			table: 'event_sign_ins',
			values: {
				email: email,
				timestamp: timestamp
			}
		});

		/* Execute the query using a connection from the connection pool */
		sql_pool.query(
			sql_query.query,
			sql_query.values,
			function (error, results, fields) {
				if (error)
					callback(err);	//If there was an error, send it up through the callback
				else callback();	//Otherwise call back with no errors
			}
		);
	}

	//Revealing module
	return ({
		create_account: create_account,
		retrieve: retrieve,
		create_session: create_session,
		validate_session: validate_session,
		remove_session: remove_session,
		sign_in: sign_in
	});
}

/* Export the module by calling the db_mgmt_module() function, which returns an object
with the intended public interface */
module.exports = db_mgmt_module();
