'use strict';
const db_mgmt = require('./db_mgmt.js');	// Abstracts away DB interactions

let admin_module = function() {
	// eslint-disable-next-line no-unused-vars
	function list_users(callback) {
		db_mgmt.list_users(callback);
	}

	return ({
		list_users: db_mgmt.list_users,
	});
};

module.exports = admin_module();
