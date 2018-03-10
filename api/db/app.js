'use strict';
const db_mgmt = require('./db_mgmt.js');

let app_module = function () {
    return ({
        custom_tiles: db_mgmt.custom_tiles,
    });
};

module.exports = app_module();
