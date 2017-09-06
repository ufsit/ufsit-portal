var fs = require('fs');		//For filesystem I/O


var loginModule = (function(){
	//Private functions and variables go here
	var simpleSignIn = function(full_name, email, subscribe, callback){
		if(isEmail(email)){
			// console.log("Signing in with name " + full_name + " and email " + email);
			var sign_in_data = {
				'name': full_name,
				'email': email,
				'subscribe': subscribe,
				'timestamp': Date.now()
			};

			//Write the data somewhere
			var db;
			fs.readFile('./data/gbm1_sign_in.json', 'utf8', function (err, data) {
				if (err) {
					console.log(err);
					callback({
						'http_status_code': 500,
						'text': "Something went wrong on our end. Try again in a little bit."
					});
				} else {
					db = JSON.parse(data);
					// console.log("JSON database: ");
					// console.log(db);
					db['sign-ins'].push(sign_in_data);
					// console.log(JSON.stringify(db));

					fs.writeFile('./data/gbm1_sign_in.json',JSON.stringify(db,undefined, 2),'utf-8',()=>{
						if (err) {
							console.log(err);
							callback({
								'http_status_code': 500,
								'text': "Something went wrong on our end. Try again in a little bit."
							});
						} else {
							callback({
								'http_status_code': 200,
								'text': "Successful sign-in. Thanks for coming!"
							})
						}
					});
				}

			});


		}
		else {
			console.log("invalid email");
			callback({
				'http_status_code': 406,
				'text': "Invalid email address"
			});
		}
	}

	function isEmail(email){
		return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( email );
	}

	//Return public interface
	return {
		//Public methods here
		simple: simpleSignIn
	}
});

module.exports = loginModule();
