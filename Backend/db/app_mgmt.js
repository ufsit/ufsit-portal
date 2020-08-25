'use strict';
const db_mgmt = require('./db_mgmt.js'); // Abstracts away DB interactions

let app_mgmt_module = function () {

    async function custom_tiles() {
        return await db_mgmt.custom_tiles();
    };

    async function tile_click(user_id, tile_id) {
        return await db_mgmt.tile_click(user_id, tile_id);
    };

    async function ctf_click(user_id, tile_id) {
        return await db_mgmt.writeup_click(user_id, tile_id);
    };

    // Revealing Module: Return public interface
    return ({
        custom_tiles: custom_tiles,
        tile_click: tile_click,
        ctf_click: ctf_click
    });

};

module.exports = app_mgmt_module();
