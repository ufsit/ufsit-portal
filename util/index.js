'use strict';

const crypto = require('crypto');

let mysql_iso_time = function(date) {
	let dateString = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
										+ ' ' + date.getHours() + ':' + date.getMinutes() + ':'
										+ date.getSeconds();
	return dateString;
};

// A nasty hack until we have a better and unified permissions system
let account_has_admin = function(account) {
	if (!account.permissions) {
		return false;
	}

	try {
		const permissions = JSON.parse(account.permissions);

		if (permissions.admin) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
};

let md5 = function(data) {
	return crypto.createHash('md5').update(data).digest('hex');
}

module.exports = {
	mysql_iso_time: mysql_iso_time,
	account_has_admin: account_has_admin,
	md5: md5,
};
