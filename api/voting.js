'use strict';

const routes = require('express').Router(); // eslint-disable-lin new-cap
const db_mgmt = require('./db/db_mgmt.js');

// Manages request to list the candidates in an election
// TODO: error checking
routes.get('/voting/candidates', async (req, res) => {
    //Checks that there is 
    if (await db_mgmt.current_election()) {
        if (await db_mgmt.already_voted(req.account.email)) {
            console.log('cant vote yo');
            //res.status(405).send('You have already voted');
        }
        else {
            // TODO: Check to see that the voter meets the requirements to vote
            res.status(200).json(await db_mgmt.get_candidates());
        }
    }
    else {
        res.status(400).send('There is not currently an election to vote on');
    }
});

//TODO: MOVE FUNCTION FROM ADMIN API FILE

module.exports = routes;