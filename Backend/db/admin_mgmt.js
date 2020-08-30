const db_mgmt = require('./db_mgmt.js'); // Abstracts away DB interactions

const admin_mgmt_module = () => {
  async function list_users() {
    return await db_mgmt.list_users();
  }

  // Revealing Module: Return public interface
  return ({
    list_users,
  });
};

module.exports = admin_mgmt_module();
