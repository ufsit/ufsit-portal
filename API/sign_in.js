/* Simple, non-account sign-in. Scrap for parts :) */

let fs = require('fs');		// For filesystem I/O

const JSON_DB_FILE = './data/GBM_Sign_Ins.json';

let loginModule = (function() {
	let simpleSignIn = function(full_name, email, subscribe, callback) {
		if (isEmail(email)) {
			// console.log("Signing in with name " + full_name + " and email " + email);
			let timestamp = new Date(Date.now());
			let timestamp_options = {
				hour: '2-digit', minute: '2-digit', second: '2-digit',
			};

			// Bundle up the data that we're going to store
			let sign_in_data = {
				'name': full_name,
				'email': email,
				'subscribe': subscribe,
				'timestamp': timestamp.toLocaleTimeString('en-us', timestamp_options),
			};

			// Write the data to the JSON database file
			let db;
			fs.readFile(JSON_DB_FILE, 'utf8', function(err, data) {
				/* If the file was unreadable, log the error and return a 500 error */
				if (err) {
					console.log(err);
					callback({
						'http_status_code': 500,
						'text': 'Something went wrong on our end. Try again in a little bit.',
					});
				} else {
					/* If the file was empty, initialize it as an empty JSON object */
					if (data.length < 2)	data = '{}';

					/* Turn the file into a JS object so we can manipulate it */
					db = JSON.parse(data);

					/* Get the date in MM/DD/YYYY format, which we'll use as the key in the DB */
					let meeting_date = timestamp.toLocaleDateString('en-US');

					/* If there is no entry for this date, initialize it as an empty array */
					if (!db[meeting_date]) {
						db[meeting_date] = [];
					}

					/* Push the sign in data to the meeting date entry */
					db[meeting_date].push(sign_in_data);

					/* Write the object back to the file */
					fs.writeFile(JSON_DB_FILE, JSON.stringify(db, undefined, 2), 'utf-8', ()=>{
						if (err) {
							console.log(err);
							callback({
								'http_status_code': 500,
								'text': 'Something went wrong on our end. Try again in a little bit.',
							});
						} else {
							callback({
								'http_status_code': 200,
								'text': 'Successful sign-in. Thanks for coming!',
							});
						}
					});
				}
			});
		} else {
			// console.log("invalid email");
			callback({
				'http_status_code': 406,
				'text': 'Invalid email address',
			});
		}
	};

	function isEmail(email) {
		return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( email ); // eslint-disable-line
	}

	// Return public interface
	return {
		// Public methods here
		simple: simpleSignIn,
	};
});

module.exports = loginModule();
