'use strict';

let mysql_iso_time = function(date) {
	return date.toISOString().slice(0, 19).replace('T', ' ');
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
