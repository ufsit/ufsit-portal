'use strict';

const routes = require('express').Router(); // eslint-disable-lin new-cap
const db_mgmt = require('./db/db_mgmt.js');

// Manages request to list the candidates in an election
routes.get('/voting/get_candidates', async (req, res) => {
    if (await db_mgmt.current_election()) {     // Check for current election
        if (await db_mgmt.have_not_voted(req.session.account_id)) {      // Check that a users has not voted yet
            if (await db_mgmt.is_eligible()) {      // Check that a user is eligible to vote
                res.status(200).json(await db_mgmt.get_candidates());
            }
            else {
                res.status(403).send('Ineligible to vote');
            }
        }
        else {
            res.status(405).send('Already Voted');
        }
    }
    else {
        res.status(400).send('There is not currently an election to vote on');
    }
});

// Request to log a user's vote
routes.post('/voting/send_vote', async (req, res) => {
    if (await db_mgmt.current_election()) {
        if (await db_mgmt.have_not_voted(req.session.account_id)) {
            if (await db_mgmt.is_eligible()) {
                let candidates = {
                    president: [],
                    vp: [],
                    treasurer: [],
                    secretary: []
                }
                // Add each person from each candidate type to their respective arrays
                arrayify(candidates.president, req.body.presidents);
                arrayify(candidates.vp, req.body.vp);
                arrayify(candidates.treasurer, req.body.treasurer);
                arrayify(candidates.secretary, req.body.secretaries);
                try {
                    await db_mgmt.record_vote(candidates, req.session.account_id);
                    return res.status(200).end();
                } catch (error) {
                    return res.status(409).send('There was an error in the request');
                }
            }
            else {
                res.status(403).send('Ineligible to vote');
            }
        }
        else {
            res.status(405).send('You have already voted');
        }
    }
    else {
        res.status(400).send('There is not currently an election to vote on');
    }
});

// Helper function to package everytyhing into an array for the db.
async function arrayify(position_array, candidates) {
    for(var person of candidates) {
        // Within the Json object, each person is saved as type "person".  Thus, person is used to access entries array,
        // and it's used to access the data members at that spot in the array. Thus we have person.person
        position_array.push(person.person);
    }
}

//TODO: MOVE FUNCTION FROM ADMIN API FILE

module.exports = routes;