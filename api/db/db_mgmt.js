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
		/* Use the account_exists function to check if an account with that
		email address already exists. In the function, we either throw an
		error if there was a conflict, or proceed creating
		the account */

        if (await account_exists(new_record.email)) { //check email
            throw new createError.Conflict('Attempted to create duplicate account: '
                + new_record.email
            );
        }

        if (await account_exists(new_record.ufl_email)) { //check ufl_email
            throw new createError.Conflict('Attempted to create duplicate account: '
                + new_record.ufl_email
            );
        }

        else {
            await insert_new_account(new_record);

            return;
        }

        /* Helper function: Check if an account with the given email already exists.*/
        async function account_exists(email) {
            if (email !== 'left_blank@ufl.edu') //check if placeholder email used
            {
                /* Form a query to the 'accounts' table for entries with the given email */
                let results = await queryAsync('SELECT `id` FROM `account` WHERE email = ?', email);
                if (results.length <= 0)
                    results = await queryAsync('SELECT `id` FROM `account` WHERE ufl_email = ?', email);
                return results.length > 0;
            }
            console.log("ERROR: Tried to lookup account by placeholder email left_blank@ufl.edu");
            return false;
        }

		/* Helper function: Inserts a new account element into the database with the
		parameters passed in the new_account object */
        async function insert_new_account(new_account) {
            let values = {
                full_name: new_account.full_name,
                email: new_account.email,
                ufl_email: new_account.ufl_email,
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

        // console.log("Updating account", account_id, "with", account_data);

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

    async function writeup_click(user_id, writeup_id) {
        const values = { user_id, writeup_id };
        return await queryAsync('INSERT INTO `writeup_clicks` SET ?', values);
    }

    async function writeup_show_hide(id, status) {
        return await queryAsync('UPDATE `writeup_submissions` SET `hidden` = ? WHERE `id` = ?', [!(status), id]);
    }

    async function writeup_difficulty(id, diff) {
        return await queryAsync('UPDATE `writeup_submissions` SET `difficulty` = ? WHERE `id` = ?', [diff, id]);
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

        if (email_addr === 'left_blank@ufl.edu') {
            throw new createError.NotFound('No account with email address ' + email_addr);
        }

        let results = await queryAsync('SELECT ?? FROM `account` WHERE email = ?',
            [['id', 'password', 'full_name'], email_addr]);

		/* If the results array has any elements in it, call back with the 0th element
		(entries are unique) */
        if (results.length <= 0) {
            results = await queryAsync('SELECT ?? FROM `account` WHERE ufl_email = ?',
                [['id', 'password', 'full_name'], email_addr]);
            if (results.length <= 0) {
                throw new createError.NotFound('No account with email address ' + email_addr);
            }
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

    // Function to store election within the database
    async function create_poll(election) {
        if (await election_exists()) {
            throw new createError.Conflict('Cannot make a new poll when there is already one in process!');
        }
        else {
            await add_candidates(election);
        }

        // Helper function that checks if there is currently an election running
        async function election_exists() {
            let results = await queryAsync('SELECT * FROM `candidates`');
            return results.length > 0;
        }

        // Helper function that stores candidates and their desired positions
        async function add_candidates(election) {
            election.forEach(function (element) {
                let values = {
                    person: element.candidate,
                    pres: 0,
                    vp: 0,
                    treas: 0,
                    secr: 0
                }
                if (element.position.includes('President')) { values.pres = 1; }
                if (element.position.includes('VP')) { values.vp = 1; }
                if (element.position.includes('Treasurer')) { values.treas = 1; }
                if (element.position.includes('Secretary')) { values.secr = 1; }
                queryAsync('INSERT INTO `candidates` SET ?', values);
            });
        }
    }

    // Returns true if there is currently an election; otherwise it returns false
    async function current_election() {
        let results = await queryAsync('SELECT * FROM `candidates`');
        return results.length > 0;
    }

    // Grabs the candidates for each position and puts them into a JSON object to be returned to the voting component
    async function get_candidates() {
        return {
            'president': await queryAsync('SELECT `person` FROM `candidates` WHERE `pres` = 1'),
            'vp': await queryAsync('SELECT `person` FROM `candidates` WHERE `vp` = 1'),
            'treasurer': await queryAsync('SELECT `person` FROM `candidates` WHERE `treas` = 1', ),
            'secretary': await queryAsync('SELECT `person` FROM `candidates` WHERE `secr` = 1')
        }
    }

    // Returns true if a person has not voted yet
    async function have_not_voted(user_id) {
        let results = await queryAsync('SELECT * FROM `voters` WHERE `person` = ?', user_id);
        return results.length < 1;
    }

    // Returns true if a person is elibible to vote
    async function is_eligible() {
        return true;
        // TODO: ACTUAL CHECK OF THE DATABASE FOR ELIGIBILITY
    }

    // Validates and records a user's vote
    // TODO: CATCH NULL VOTE
    async function record_vote(vote, user_id) {
        if (await verify_valid_vote()) {
            try {
                if (vote.president.length) await insert_votes('president', vote.president);
                if (vote.vp.length) await insert_votes('vp', vote.vp);
                if (vote.treasurer.length) await insert_votes('treasurer', vote.treasurer);
                if (vote.secretary.length) await insert_votes('secretary', vote.secretary);
                return await record_that_user_voted();
            } catch (error) {
                throw new createError.BadRequest('There seems to be a problem with the db.  Please contact the developers');
            }
        }
        else {
            throw new createError.BadRequest('There is an error in the request');
        }

        // Adds a users email to the voters table so that they cannot vote again
        async function record_that_user_voted() {
            return await queryAsync('INSERT INTO `voters` SET ?', { person: user_id });
        }

        // Verifies that a vote is valid
        async function verify_valid_vote() {
            try {
                // Verifies all president choices
                for (var pres of vote.president) {
                    let count = await queryAsync('SELECT `person` FROM `candidates` WHERE person=? AND `pres`=1', pres);
                    // If the person is not in the list of candidates for president return false
                    if (count.length < 1) { return false; }
                }
                //vote.president.length = 30;
                // Verifies all vp choices
                for (var pres of vote.vp) {
                    let count = await queryAsync('SELECT `person` FROM `candidates` WHERE person=? AND `vp`=1', pres);
                    if (count.length < 1) { return false; }
                }
                //vote.vp.length = 30;
                // Verifies all Treasurer choices
                for (var pres of vote.treasurer) {
                    let count = await queryAsync('SELECT `person` FROM `candidates` WHERE person=? AND `treas`=1', pres);
                    if (count.length < 1) { return false; }
                }
                //vote.treasurer.length = 30;
                // Verifies all Secretary choices
                for (var pres of vote.secretary) {
                    let count = await queryAsync('SELECT `person` FROM `candidates` WHERE person=? AND `secr`=1', pres);
                    if (count.length < 1) { return false; }
                }
                //vote.secretary.length = 30;
                return true;
            } catch (error) {	// Only catches an error when you have tried to vote for a person not running
                return false;
            }
        }

        // Records a users vote after it has been thoroughly validated
        async function insert_votes(position, candidate_array) {
            let values = {}
            for (const [index, value] of candidate_array.entries()) {
                values[(index + 1).toString() + 'th'] = value;
            }
            await queryAsync('INSERT INTO `' + position + '` SET ?', values);
        }
    }

    async function end_election() {
        if (await current_election()) {
            await queryAsync('DELETE FROM `candidates`');
        }
        else {
            throw new createError.BadRequest('There was an error trying to delete from the database');
        }
    }

    // Grabs all the ranking of every position and returns those inside of a promise
    async function get_votes() {
        try {
            const results = {
                president: await queryAsync('SELECT * FROM `president`'),
                vp: await queryAsync('SELECT * FROM `vp`'),
                treasurer: await queryAsync('SELECT * FROM `treasurer`'),
                secretary: await queryAsync('SELECT * FROM `secretary`')
            }
            return results;
        } catch (error) {
            throw new createError.BadRequest('There was an error trying to query the results of the election');
        }
    }

    // Stores the results of an election
    async function store_results(results) {
        // Everything get converted to a string and the results are stored
        try {
            await queryAsync('INSERT INTO `results` SET ?', { position: 'president', json: JSON.stringify(results.president) });
            await queryAsync('INSERT INTO `results` SET ?', { position: 'vp', json: JSON.stringify(results.vp) });
            await queryAsync('INSERT INTO `results` SET ?', { position: 'treasurer', json: JSON.stringify(results.treasurer) });
            await queryAsync('INSERT INTO `results` SET ?', { position: 'secretary', json: JSON.stringify(results.secretary) });
        } catch (error) {
            throw new createError.BadRequest('There was an error trying to store the results of the election');
        }
    }

    // Deletes everything having to do with voting (except candidates running because that was already deleted)
    async function clear_database() {
        try {
            await queryAsync('DELETE FROM `president`');
            await queryAsync('DELETE FROM `vp`');
            await queryAsync('DELETE FROM `treasurer`');
            await queryAsync('DELETE FROM `secretary`');
            await queryAsync('DELETE FROM `results`');
            await queryAsync('DELETE FROM `voters`');
        } catch (error) {
            throw new createError.BadRequest('There was an error deleting data from the database');
        }
    }

    async function get_election_results() {
        let results = {
            president: await queryAsync('SELECT `json` FROM `results` WHERE position="president"'),
            vp: await queryAsync('SELECT `json` FROM `results` WHERE position = "vp"'),
            treasurer: await queryAsync('SELECT `json` FROM `results` WHERE position = "treasurer"'),
            secretary: await queryAsync('SELECT `json` FROM `results` WHERE position = "secretary"')
        }
        results.president = JSON.parse(results.president[0].json);
        results.vp = JSON.parse(results.vp[0].json);
        results.treasurer = JSON.parse(results.treasurer[0].json);
        results.secretary = JSON.parse(results.secretary[0].json);
        return results;
    }

    async function there_are_results() {
        let result = await queryAsync('SELECT * FROM `results`');
        return result.length > 0;
    }

    async function add_tile(name, description, link) {
        const values = { name: name, description: description, link: link };
        return await queryAsync('INSERT INTO `tiles` SET ?', values);
    }

    async function delete_tile(id) {
        return await queryAsync('UPDATE `tiles` SET `deleted` = TRUE WHERE `id` = ?', id);
    }

    /* Get a list of the user's writeup submissions */
    async function get_user_writeup_submissions(account_id) {
        return await queryAsync('SELECT `id`,`name` FROM `writeup_submissions` WHERE `account_id` = ?',
            account_id);
    }

    /* Get all writeup submissions */
    async function get_all_writeup_submissions() {
        const attributes = '`writeup_submissions`.id,`name`,`time_updated`,`full_name`,`hidden`,`difficulty`,`description`';
        return await queryAsync('SELECT ' + attributes + ' FROM `writeup_submissions`,`account` WHERE `writeup_submissions`.account_id = `account`.id');
    }

    /* Get a specific writeup, given its id */
    async function get_writeup(id) {
        return await queryAsync('SELECT `name`,`full_name` FROM `writeup_submissions`,`account` WHERE `writeup_submissions`.account_id = `account`.id AND `writeup_submissions`.id = ?', id);
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

    /* Records a file upload */
    async function get_resume_key(account_id) {
        return await queryAsync('SELECT `resume` FROM `account` WHERE `id`=?', account_id);
    }

    /* Records a resume upload */
    async function record_resume_upload(account_id, key) {
        return await queryAsync('UPDATE `account` SET `resume`=? WHERE `id`=?',
            [key, account_id]);
    }

    /* Returns a user's resume questions */
    async function get_resume_questions(account_id) {
        return await queryAsync('SELECT `research`,`internship`,`major`,`grad_date`,`gpa` FROM `account` WHERE `id`=?',
                                account_id);
    }

    /* Returns a user's resume questions */
    async function set_resume_questions(account_id, new_data) {
        return await queryAsync('UPDATE `account` SET `research`=?,`internship`=?,`major`=?,`grad_date`=?,`gpa`=? WHERE `id`=?',
                                [new_data.research, new_data.internship, new_data.major, new_data.grad_date, new_data.gpa, account_id]);
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
        get_user_writeup_submissions: get_user_writeup_submissions,
        get_all_writeup_submissions: get_all_writeup_submissions,
        get_writeup: get_writeup,
        record_writeup_submission: record_writeup_submission,
        update_writeup_submission: update_writeup_submission,
        record_file_upload: record_file_upload,
        get_file_uploads: get_file_uploads,
        writeup_click: writeup_click,
        writeup_show_hide: writeup_show_hide,
        writeup_difficulty: writeup_difficulty,
        add_tile: add_tile,
        delete_tile: delete_tile,
        custom_tiles: custom_tiles,
        tile_click: tile_click,
        get_resume_key: get_resume_key,
        record_resume_upload: record_resume_upload,
        get_resume_questions: get_resume_questions,
        set_resume_questions: set_resume_questions
        create_poll: create_poll,
        current_election: current_election,
        get_candidates: get_candidates,
        have_not_voted: have_not_voted,
        is_eligible: is_eligible,
        record_vote: record_vote,
        end_election: end_election,
        get_votes: get_votes,
        store_results: store_results,
        there_are_results: there_are_results,
        get_election_results: get_election_results,
        clear_database: clear_database,
    });
};

/* Export the module by calling the db_mgmt_module() function, which returns an object
with the intended public interface */
module.exports = db_mgmt_module();