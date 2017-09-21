var fs = require('fs');		//For filesystem I/O

const JSON_DB_FILE = './data/SIT_User_Accs.json';


var db_mgmt_module = function(){

	/* TO-DO: Actual DB management. Very rudimentary JSON file storage, no error
		checking or duplicate prevention. Temporary while we figure out an actual DB*/
	function create(new_record, callback){
		fs.readFile(JSON_DB_FILE, 'utf8', function (err, data) {
			/* If the file was unreadable, log the error and return a 500 error */
			if (err) {
				callback(err);
			}

			else {
				/* If the file was empty, initialize it as an empty JSON object */
				if(data.length < 2)	data = '{}';

				/* Turn the file into a JS object so we can manipulate it */
				db = JSON.parse(data);

				/* If there is no entry, initialize it as an empty array */
				if(!db.acounts){
					db.accounts = {};
				}
				console.log('New Record: ' + new_record.emai);
				console.log('Entry:' + db.accounts[new_record.email]);
				
				if(db.accounts[new_record.email]){
					console.log('duplicate');
					callback('User already exists');
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
		});

	}

	//Revealing module
	return ({
		'create': create
	});
}

module.exports = db_mgmt_module();
