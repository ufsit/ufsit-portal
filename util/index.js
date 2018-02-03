'use strict';

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

module.exports = {
	mysql_iso_time: mysql_iso_time,
	account_has_admin: account_has_admin,
};
