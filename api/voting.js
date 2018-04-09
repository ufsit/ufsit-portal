'use strict';

const routes = require('express').Router(); // eslint-disable-lin new-cap
const db_mgmt = require('./db/db_mgmt.js');
const util = require.main.require('./util');

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

routes.post('/voting/end_election', async (req, res) => {
    if (util.account_has_admin(req.account)) {
        try {
            await db_mgmt.end_election();
            return res.status(200).end();
        } catch (error) {
            res.status(400).send('There was an error trying to delete from the database');
        }
    }
    else {
        res.status(403).send('Access denied');
    }
});

// Retrieves the results of the election from the database and then calculates the results here
routes.get('/voting/get_election_results', async (req, res) => {
    if (util.account_has_admin(req.account)) {
        try {
            let results = await db_mgmt.get_election_results();
            let president_array = await map_to_array(results.president);
            let vp_array = await map_to_array(results.vp);
            let treasurer_array = await map_to_array(results.treasurer);
            let secretary_array = await map_to_array(results.secretary);
            console.log(await runoff(president_array, {}));
            let winners = {
                president: await runoff(president_array, {}),
                vp: await runoff(vp_array, {}),
                treasurer: await runoff(treasurer_array, {}),
                secretary: await runoff(secretary_array, {})
            }
            res.status(200).json(winners);
        } catch(error) {
            res.status(400).send('There was an error querying the database.  Contact the developers immediately\
            because you have likely destroyed your database');
        }
    }
    else {
        res.status(403).send('Access denied');
    }
});

// Helper function to map jsons into arrays
// TODO: SIMPLIFY TO ARRAY USING PROPERTIES OF JSON OBJECT. (you're stupid spencer, you should have seen that before)
async function map_to_array(old_array) {
    return old_array.map(function(item) {
        let x = [];
        for(let p = 1; p < 31; p++) {
            if(!item[p.toString()+'th']) {break;}
            x.push(item[p.toString()+'th']);
        }
        return x;
    });
}


// The *Algorithm* that calculates the winner of an election using ranked choice voting
async function runoff(voters, results) {
    // This terminates the recursive calls
    if (!voters.length || !voters[0].length) return
  
    let min = Number.MAX_VALUE
  
    const counts = {}
  
    for (let voter of voters)   // Maps every remaining candidates to the number of votes they have
      counts[voter[0]] = (counts[voter[0]] || 0) + 1
  
    for (let key in counts) {
        min = Math.min(counts[key], min)    // Calculates the minunum number of votes received by the candidates
        // Once a winner has been found, the recursive function continues to find the scores of the people left
        // so that we know the placement of everyone in the election
        if (counts[key] * 2 > voters.length) {
            runoff(voters.filter(x => x[0] !== key), results);
            results[key] = counts[key];
            return results;
        }
    }

    // This part filters out all candidates that received the minimum number of votes, and it gives those
    // votes to the next ranked candidate still in the competition
    return await runoff(voters.map(xs => xs.filter(function(person) {
        if (counts[person] === min) {
            results[person] = min;
        }
        return counts[person] > min;
    })), results);
  }

//TODO: MOVE FUNCTION FROM ADMIN API FILE

module.exports = routes;