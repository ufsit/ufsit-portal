'use strict';

const fs = require('fs');  // For filesystem I/O
const mysql = require('mysql');  // For mySQL interaction
const util = require.main.require('./util');
const createError = require('http-errors');
const CREDENTIALS = process.env.CREDENTIALS || 'credentials.json';

let sql_pool = null;

try {
    /* Grab the database credentials from the JSON file */
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS, 'utf8'));

    /* Create a connection pool for mysql queries */
    sql_pool = mysql.createPool({
        connectionLimit: 15,	// This max is dictated by our Heroku JawsDB plan lol
        host: credentials.db.host,	// Use the credentials from the credentials.json file
        port: credentials.db.port,
        user: credentials.db.username,
        password: credentials.db.password,
        database: credentials.db.database,
    });

    console.log('[INFO] Booted MySQL pool @ \''
        + credentials.db.host + '\' with credentials from file \''
        + CREDENTIALS + '\'');
} catch (err) {
    console.log('Failed to read credentials. Checking for available environment variable...');
    let url = process.env.JAWSDB_MARIA_URL;

    if (url == undefined || url == null) {
        console.log('[ERROR] Unable to load database credentials from \'' + CREDENTIALS +
            '\' OR from the JAWSDB_MARIA_URL environment.\n' +
            'Ensure that you have this file available in your current directory.');
        process.exit(1);
        return;
    }

    sql_pool = mysql.createPool(url);
}

/* Check if the SQL server credentials are actually valid instead of waiting for the first
   query */
sql_pool.getConnection((error, connection) => {
    if (error) {
        console.log('[ERROR] Could not connect to the database:', error.message);
        console.log('Double check the database configuration you provided.');
        process.exit(1);
        return;
    }

    connection.release();
});

/* Define the database management module and its public API */
let db_mgmt_module = function () {
    function queryAsync(query, values) {
        return new Promise((resolve, reject) => {
            sql_pool.query(
                query,
                values,
                function (error, results, fields) {
                    if (error) {
                        // Create a generic HTTP error for display
                        const httperror = createError();

                        // copy the MySQL stack trace as the one we just generated is useless
                        httperror.stack = error.stack;

                        reject(httperror);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }

    /* Create a new account */
    async function create_account(new_record) {
		/* Use the check_account_conflict function to check if an account with that
		email address already exists. In the function, we either throw an
		error if there was a conflict, or proceed creating
		the account */

        if (await account_exists(new_record.email)) {
            throw new createError.Conflict('Attempted to create duplicate account: '
                + new_record.email
            );
        } else {
            await insert_new_account(new_record);

            return;
        }

        /* Helper function: Check if an account with the given email already exists.*/
        async function account_exists(email) {
            /* Form a query to the 'accounts' table for entries with the given email */
            let results = await queryAsync('SELECT `id` FROM `account` WHERE email = ?', email);

            return results.length > 0;
        }

		/* Helper function: Inserts a new account element into the database with the
		parameters passed in the new_account object */
        async function insert_new_account(new_account) {
            let values = {
                full_name: new_account.full_name,
                email: new_account.email,
                permissions: '',
                password: new_account.password.salt + '$' + new_account.password.hash,
                registration_ip: new_account.registration_ip,
                registration_date: util.mysql_iso_time(new Date(Date.now())),
                grad_date: new_account.grad_date,
                mass_mail_optin: new_account.in_mailing_list,
            };

            return await queryAsync('INSERT INTO `account` SET ?', values);
        }
    }

    async function update_account(account_id, account_data) {
        // explicitly prevent primary keys from being clobbered
        if (account_data.id) {
            delete account_data.id;
        }

        // Format the password correctly, if present
        if (account_data.password && account_data.password.salt && account_data.password.hash) {
            account_data.password = account_data.password.salt + '$' + account_data.password.hash;
            delete account_data.salt;
        } else {
            delete account_data.password;
            delete account_data.salt;
        }

        if (account_data.length < 1) {
            throw new createError.BadRequest('Cannot update profile with zero fields');
        }

        return await sql_pool.query('UPDATE `account` SET ? WHERE id = ?', [account_data, account_id]);
    }

    async function custom_tiles() {
        return await queryAsync('SELECT * FROM `tiles` WHERE `deleted`= FALSE');
    }

    async function tile_click(user_id, tile_id) {
        const results = await queryAsync('SELECT * FROM `tile_clicks` WHERE `user_id` = ? AND `tile_id` = ?', [user_id, tile_id]);
        if (results.length <= 0) {
            const values = { user_id, tile_id };
            return await queryAsync('INSERT INTO `tile_clicks` SET ?', values);
        }
    }

    async function list_users() {
        return await queryAsync('SELECT ?? FROM `account`',
            [['id', 'email', 'full_name', 'mass_mail_optin', 'grad_date', 'registration_date']]);
    }

    async function add_tile(name, description, link) {
        const values = { name: name, description: description, link: link };
        return await queryAsync('INSERT INTO `tiles` SET ?', values);
    }

    async function delete_tile(id) {
        return await queryAsync('UPDATE `tiles` SET `deleted` = TRUE WHERE `id` = ?', id);
    }

    /* Retrieve an account with the given email address */
    async function retrieve(email_addr) {
        /* Form a query to the 'accounts' table for entries with the given email */
        /* Execute the query using a connection from the connection pool */
        const results = await queryAsync('SELECT ?? FROM `account` WHERE email = ?',
            [['id', 'password', 'full_name'], email_addr]);

        /* If the results array has any elements in it, call back with the 0th element
        (entries are unique) */
        if (results.length <= 0) {
            throw new createError.NotFound('No account with email address ' + email_addr);
        }

        let pwparts = results[0].password.split('$');

        return {	// Encapsulate the results nicely for account_mgmt.js
            'id': results[0].id,
            'salt': pwparts[0],
            'hash': pwparts[1],
            'name': results[0].full_name,
        };
    }

    /* Retrieve an account by account ID */
    async function retrieve_by_id(account_id) {
        /* Execute the query using a connection from the connection pool */
        const results = await queryAsync('SELECT * FROM `account` WHERE id = ?', [account_id]);

        if (results.length > 0) {
            // Hide certain fields
            delete results[0].id;
            delete results[0].password;

            return results[0];
        } else {
            /* Otherwise, return a 404 (for no matching record) and null for the result*/
            throw new createError.NotFound('No account with id ' + account_id);
        }
    }

    /* Create an entry in the sessions table */
    async function create_session(session_token, account_id,
        start_date, expire_date, ip_address, browser) {
        const values = {
            id: session_token,
            account_id: account_id,
            start_date: util.mysql_iso_time(start_date),
            expire_date: util.mysql_iso_time(expire_date),
            ip_address: ip_address,
            browser: browser,
        };

        /* Execute the query using a connection from the connection pool */
        return await queryAsync('INSERT INTO `session` SET ?', values);
    }

    /* Confirms whether the token corresponds to an active session. If it does, calls back
        with the email associated with it.*/
    async function get_session(session_token) {
        const results = await queryAsync('SELECT * FROM `session` WHERE ?', { id: session_token });

        if (results.length > 0) {
            return results[0];
        } else {
            /* Otherwise, return a 404 (for no matching record) and null for the result*/
            throw new createError.NotFound('No session with token ' + session_token);
        }
    }

    /* Remove an entry from the sessions table */
    async function remove_session(session_id) {
        return await queryAsync('DELETE FROM `session` WHERE id = ?', [session_id]);
    }

    /* Sign a user into an event */
    async function sign_in(email, timestamp) {
        let values = {
            email: email,
            timestamp: timestamp,
        };

        return await queryAsync('INSERT INTO `event_sign_ins_old` SET ?', values);
    }

    /* Get all signins for a user with a constraint of time */
    async function get_sign_ins(email, after) {
        return await queryAsync('SELECT * FROM `event_sign_ins_old` WHERE `email` = ? AND `timestamp` >= ?',
            [email, after]);
    }

    /* Get a list of the user's writeup submissions */
    async function get_writeup_submissions(account_id) {
        return await queryAsync('SELECT `id`,`name` FROM `writeup_submissions` WHERE `account_id` = ?',
            account_id);
    }

    /* Get a specific writeup, given its id */
    async function get_writeup(id) {
        return await queryAsync('SELECT `name` FROM `writeup_submissions` WHERE `id` = ?',
            id);
    }

    /* Get a list of the user's writeup submissions */
    async function get_file_uploads(account_id) {
        return await queryAsync('SELECT `id`,`name` FROM `file_uploads` WHERE `account_id` = ?',
            account_id);
    }

    /* Records a writeup submission */
    async function record_writeup_submission(account_id, name) {
        const values = {
            account_id: account_id,
            name: name,
            time_created: new Date(),
            time_updated: new Date(),
        };
        return await queryAsync('INSERT INTO `writeup_submissions` SET ?', values);

        return await queryAsync('SELECT * FROM `writeup_submissions` WHERE `account_id` = ? AND `name` = ?',
                                [account_id, name]);
    }

    /* Records a writeup submission */
    async function update_writeup_submission(account_id, name, id) {
        let results = await queryAsync('SELECT * FROM `writeup_submissions` WHERE `account_id` = ? AND `id` = ?',
                        [account_id, id]);
        if (results.length === 0) {
            throw new createError.BadRequest('Cannot update a different user\'s writeup');
        }

        return await queryAsync('UPDATE `writeup_submissions` SET `name` = ?, `time_updated` = ? WHERE `account_id` = ? AND `id` = ?',
                                [name, new Date(), account_id, id]);
    }

    /* Records a file upload */
    async function record_file_upload(account_id, name) {
        const values = {
            account_id: account_id,
            time_created: new Date(),
            name: name,
        };
        return await queryAsync('INSERT INTO `file_uploads` SET ?', values);
    }

    // Revealing module
    return ({
        create_account: create_account,
        update_account: update_account,
        retrieve: retrieve,
        retrieve_by_id: retrieve_by_id,
        create_session: create_session,
        get_session: get_session,
        remove_session: remove_session,
        sign_in: sign_in,
        get_sign_ins: get_sign_ins,
        list_users: list_users,
        get_writeup_submissions: get_writeup_submissions,
        get_writeup: get_writeup,
        record_writeup_submission: record_writeup_submission,
        update_writeup_submission: update_writeup_submission,
        record_file_upload: record_file_upload,
        get_file_uploads: get_file_uploads,
        add_tile: add_tile,
        delete_tile: delete_tile,
        custom_tiles: custom_tiles,
        tile_click: tile_click,
    });
};

/* Export the module by calling the db_mgmt_module() function, which returns an object
with the intended public interface */
module.exports = db_mgmt_module();
