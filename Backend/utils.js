const fs = require('fs');
const crypto = require('crypto');

const cached_credentials = {};

const mysql_iso_time = (date) => {
  const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return dateString;
};

// A nasty hack until we have a better and unified permissions system
const account_has_admin = (account) => {
  if (!account.permissions) {
    return false;
  }

  try {
    const permissions = JSON.parse(account.permissions);

    if (permissions.admin) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const md5 = (data) => crypto.createHash('md5').update(data).digest('hex');

const load_aws = () => {
  const filename = process.env.AWS || 'aws.json';
  let aws_credentials = null;

  if (cached_credentials.aws) {
    return cached_credentials.aws;
  }

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

    if (aws_credentials.region == null
			|| aws_credentials.accessKeyId == null
			|| aws_credentials.secretAccessKey == null || aws_credentials.s3Bucket == null) {
      console.log(`[ERROR] Unable to load AWS credentials from '${filename}' OR from the AWS_* environment variables.\nEnsure that you have this file available in your current directory.`);
      process.exit(1);
      return null;
    }
  }

  console.log(`[INFO] Associated with AWS [${aws_credentials.region
  } ${aws_credentials.s3Bucket}]`);

  cached_credentials.aws = aws_credentials;
  return aws_credentials;
};

const load_googlecal = () => {
  const filename = process.env.GOOGLECAL || 'googleCal.json';
  let google_credentials = null;

  try {
    google_credentials = JSON.parse(fs.readFileSync(filename, 'utf8'));
  } catch (err) {
    console.log('GoogleCal credentials not found. Falling back to environment variable');

    google_credentials = JSON.parse(process.env.GOOGLECAL);
  }

  console.log(`[INFO] Associated with GoogleCal for ${google_credentials.client_email}`);

  return google_credentials;
};

module.exports = {
  mysql_iso_time,
  account_has_admin,
  md5,
  load_aws,
  load_googlecal,
};
