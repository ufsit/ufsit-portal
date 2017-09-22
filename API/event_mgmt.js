

const db_mgmt = require('./db_mgmt.js');	// Abstracts away DB interactions

let event_mgmt_module = function() {
	function sign_in(email, timestamp, callback) {
		db_mgmt.sign_in(email, timestamp, (error)=>{
			if (error) {
				callback(error);
			} else {
				callback();
			}
		});
	}

	// Revealing Module: Return public interface
	return ({
		sign_in: sign_in,
	});
};

module.exports = event_mgmt_module();
