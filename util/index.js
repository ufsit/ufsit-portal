'use strict';

const fs = require('fs');
const crypto = require('crypto');

let mysql_iso_time = function(date) {
	let dateString = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
										+ ' ' + date.getHours() + ':' + date.getMinutes() + ':'
										+ date.getSeconds();
	return dateString;
};

// A nasty hack until we have a better and unified permissions system
let account_has_admin = function(account) {
	return true;
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

let load_aws = function() {
	const filename = process.env.AWS || 'aws.json';
	let aws_credentials = null;

	try {
		aws_credentials = JSON.parse(fs.readFileSync(filename, 'utf8'));
	} catch (err) {
		console.log('AWS credentials not found. Falling back to environment variables');

		aws_credentials = {
			region: process.env.AWS_REGION,
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			s3Bucket: process.env.AWS_S3_BUCKET,
		};

		if (aws_credentials.region == null ||
			aws_credentials.accessKeyId == null ||
			aws_credentials.secretAccessKey == null ||
			aws_credentials.s3Bucket == null) {
			console.log('[ERROR] Unable to load AWS credentials from \'' + filename +
				'\' OR from the AWS_* environment variables.\n' +
				'Ensure that you have this file available in your current directory.');
			process.exit(1);
			return null;
		}
	}

	console.log('[INFO] Associated with AWS [' + aws_credentials.region +
		' ' + aws_credentials.s3Bucket + ']');

	return aws_credentials;
};

module.exports = {
	mysql_iso_time: mysql_iso_time,
	account_has_admin: account_has_admin,
	md5: md5,
	load_aws: load_aws,
};
