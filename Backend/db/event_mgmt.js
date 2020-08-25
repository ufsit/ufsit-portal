'use strict';
const db_mgmt = require('./db_mgmt.js'); // Abstracts away DB interactions

let event_mgmt_module = function() {

    async function sign_in(email, timestamp) {
		await db_mgmt.sign_in(email, timestamp);
	}

	async function get_sign_ins_after(email, afterTime) {
		return await db_mgmt.get_sign_ins(email, afterTime);
	}

	// Revealing Module: Return public interface
	return ({
		get_sign_ins_after: get_sign_ins_after,
		sign_in: sign_in,
    });

};

module.exports = event_mgmt_module();
