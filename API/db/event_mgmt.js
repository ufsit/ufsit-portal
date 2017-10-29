'use strict';


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

	function get_sign_ins_after(email, afterTime, callback) {
		db_mgmt.get_sign_ins(email, afterTime, (error, results)=>{
			if (error) {
				callback(error, null);
			} else {
				callback(null, results);
			}
		});
	}

	// Revealing Module: Return public interface
	return ({
		get_sign_ins_after: get_sign_ins_after,
		sign_in: sign_in,
	});
};

module.exports = event_mgmt_module();
