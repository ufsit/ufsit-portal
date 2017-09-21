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

/* Grab the database credentials from the JSON file */
const credentials = JSON.parse(fs.readFileSync('./credentials.json','utf8'));

/* Create a connection pool for mysql queries */
var sql_pool  = mysql.createPool({
	connectionLimit : 15,	//This max is dictated by our Heroku JawsDB plan lol
	host            : credentials.db.host,	//Use the credentials from the credentials.json file
	port				: credentials.db.port,
	user            : credentials.db.username,
	password        : credentials.db.password,
	database        : credentials.db.database
});

/* Define the database management module and its public API */
var db_mgmt_module = function(){
	/* Create a new account */
	function create(new_record, callback){
		/* Use the check_account_conflict function to check if an account with that
		email address already exists. In the callback function, either throw an
		error up through the callback if there was a conflict, or proceed creating
		the account */
		check_account_conflict(new_record.email, (conflict_exists)=>{
			/* If it does, make a callback with the error */
			if(conflict_exists){
				callback({
					'code': 409,	//HTTP Identifier for the error: 409 => conflict
					'text':'[db_mgmt.js->]: Error - Attempted to create duplicate account: ' + new_record.email
				});
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
					if (error) throw error;	//If there was an error, throw the error
					/* If the results array has any elements in it, call back with true
					(to indicate that there was a conflict) */
					if(results.length > 0)
					callback(true);
					/* Otherwise, call back with false to indicate a lack of conflict */
					else callback(false);
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

	//Revealing module
	return ({
		create: create
	});
}

/* Export the module by calling the db_mgmt_module() function, which returns an object
with the intended public interface */
module.exports = db_mgmt_module();
