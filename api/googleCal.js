'use strict';

const fs = require('fs');  // For filesystem I/O
const routes = require('express').Router(); // eslint-disable-line new-cap
let google = require('googleapis');
let auth = require('google-auth-library');

const GOOGLECAL = process.env.GOOGLECAL || 'googleCal.json';
const googleCal = JSON.parse(fs.readFileSync(GOOGLECAL, 'utf8'));

// configure a JWT auth client
let jwtClient = new google.google.auth.JWT(
       googleCal.client_email,
       null,
       googleCal.private_key,
       ['https://www.googleapis.com/auth/calendar']);
//authenticate request
jwtClient.authorize(function (err, tokens) {
 if (err) {
   console.log(err);
   return;
 } else {
   console.log("Successfully connected to google!!");
 }
});

let googleCalendar = google.google.calendar('v3');

routes.get('/googleCal/get_events', async (req, res)=> {
	googleCalendar.events.list({
	   auth: jwtClient,
	   calendarId: 'valentinocc@ufl.edu'
	}, function (err, response) {
		   if (err) {
		       console.log('The API returned an error: ' + err);
		       res.sendStatus(500);
		       return;
		   }
		   var events = response.data.items;
		   if (events.length == 0) {
		       console.log('No events found.');
		   }
		   res.status(200).json(events);
		});
});

module.exports = routes;