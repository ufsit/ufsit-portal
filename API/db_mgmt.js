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
		console.log('New Record: ');
		console.log(new_record);
		console.log('Entry:' + db.accounts[new_record.email]);

		/* Check if an account with that email address already exists. */
		var account_already_exists = true;

		/* If it does, log it and make a callback with the error message */
		if(account_already_exists){
			callback('[db_mgmt.js->]: Error - Attempted to create duplicate account: ' + new_record.email);
		}

		else {
			/* Push the sign in data to the meeting date entry */
			db.accounts[new_record.email] = {
				'password': new_record.password,
				'full_name': new_record.full_name,
				'in_mailing_list': new_record.in_mailing_list
			};

			/* Write the object back to the file */
			fs.writeFile(JSON_DB_FILE,JSON.stringify(db,undefined, 2),'utf-8',(err)=>{
				if (err) {
					callback(err);
					console.log(err);
				} else {
					callback();
				}
			});
		}
	}
	/* Just for testing MySQL interaction */
	function test_query(){
		var sql_query = jsonSql.build({
			type: 'insert',
			table: 'accounts',
			values: {
				email: 'jaurj1@ufl.edu',
				password_salt: 'NaCl',
				password_hash: 'tater tots',
				full_name: 'Juan Jauregui',
				in_mailing_list: true
			}
		});

		console.log(sql_query.query);
		console.log(sql_query.values);

		sql_pool.query(
			sql_query.query,
			sql_query.values,
			function (error, results, fields) {
				if (error) throw error;
				console.log(results);
			}
		);
	}


	//Revealing module
	return ({
		// create: create
	});
}

module.exports = db_mgmt_module();

//
// const JSON_DB_FILE = './data/SIT_User_Accs.json';
//
//
// var db_mgmt_module = function(){
//
	/* TO-DO: Actual DB management. Very rudimentary JSON file storage, no error
		checking or duplicate prevention. Temporary while we figure out an actual DB*/
	// function create(new_record, callback){
	// 	fs.readFile(JSON_DB_FILE, 'utf8', function (err, data) {
	// 		/* If the file was unreadable, log the error and return a 500 error */
	// 		if (err) {
	// 			callback(err);
	// 		}
	//
	// 		else {
	// 			/* If the file was empty, initialize it as an empty JSON object */
	// 			if(data.length < 2)	data = '{}';
	//
	// 			/* Turn the file into a JS object so we can manipulate it */
	// 			db = JSON.parse(data);
	//
	// 			/* If there is no entry, initialize it as an empty array */
	// 			if(!db.acounts){
	// 				db.accounts = {};
	// 			}
	// 			console.log('New Record: ');
	// 			console.log(new_record);
	// 			console.log('Entry:' + db.accounts[new_record.email]);
	//
	// 			if(db.accounts[new_record.email]){
	// 				console.log('duplicate');
	// 				callback('User already exists');
	// 			}
	//
	// 			else {
	// 				/* Push the sign in data to the meeting date entry */
	// 				db.accounts[new_record.email] = {
	// 					'password': new_record.password,
	// 					'full_name': new_record.full_name,
	// 					'in_mailing_list': new_record.in_mailing_list
	// 				};
	//
	// 				/* Write the object back to the file */
	// 				fs.writeFile(JSON_DB_FILE,JSON.stringify(db,undefined, 2),'utf-8',(err)=>{
	// 					if (err) {
	// 						callback(err);
	// 						console.log(err);
	// 					} else {
	// 						callback();
	// 					}
	// 				});
	// 			}
	// 		}
	// 	});
	//
	// }
//
// 	//Revealing module
// 	return ({
// 		'create': create
// 	});
// }
//
// module.exports = db_mgmt_module();
