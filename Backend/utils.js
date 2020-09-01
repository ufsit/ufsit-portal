const crypto = require('crypto');
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

module.exports = {
  mysql_iso_time,
  account_has_admin,
  md5,
};
