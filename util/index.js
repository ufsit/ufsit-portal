'use strict';

let mysql_iso_time = function(date) {
	return date.toISOString().slice(0, 19).replace('T', ' ');
};

module.exports = {
	mysql_iso_time: mysql_iso_time,
};
