'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap
const util = require.main.require('./util');
const google = require('googleapis');
const googleCal = util.load_googlecal();

// configure a JWT auth client
let jwtClient = new google.google.auth.JWT(
       googleCal.client_email,
       null,
       googleCal.private_key,
       ['https://www.googleapis.com/auth/calendar']);

// Authenticate request
jwtClient.authorize(function(err, tokens) {
 if (err) {
   console.log(err);
   return;
 } else {
   console.log('Connected to Google Calendar');
 }
});

let googleCalendar = google.google.calendar('v3');

routes.get('/googleCal/get_events', async (req, res)=> {
	googleCalendar.events.list({
		auth: jwtClient,
		calendarId: 'valentinocc@ufl.edu',
	}, function(err, response) {
		if (err) {
			console.log('The API returned an error: ' + err);
			res.sendStatus(500);
			return;
		}

		const events = response.data.items;

		if (events.length == 0) {
			console.log('No events found.');
		}
		res.status(200).json(events);
	});
});

module.exports = routes;
