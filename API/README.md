'use strict';
Register
	Description:		Creates a new user given some registration parameters
	URL:					/user/register
	Method:				POST
	URL Parameters: 	None
	Request Body:
			{
				"name":[string],
				"email":[string],
				"password":[string],
				"grad_year":[string],		// e.g. "Spring 2018"
				"subscribe":[boolean]
			}

	Successful Response:
		Status: 200
			Account created

	Error Response:
		Status: 500
			Server error
			OR
		Status: 409
			User with that email already exists
			OR
		Status: 400
			Malformed request (missing/invalid parameters or values)

	Sample call:
		$scope.formData = {
			'name': "Human McPerson",
			'email': "real_person@ufl.edu",
			'password': "123456seven",
			'grad_year': "Spring 2049",
			'subscribe' : true
		};
		$http.post('/api/user/register',$scope.formData)
		.success(function (data, status, headers, config) {
			console.log(data);
		})
		.error(function (data, status, header, config) {
			console.log(data);
		});
=====================================================================
Log In
	Description:		Initiates a session (documented by a cookie) and returns
							the cookie to the caller.
	URL:					/user/login
	Method:				POST
	URL Parameters: 	None
	Request Body:
			{
				"email":[string],
				"password":[string]
			}

	Successful Response:
		Status: 200
		Content: {cookie: [signed base64 cookie]}

	Error Response:
		Status: 500
			Server error
			OR
		Status: 401
			Invalid credentials
			OR
		Status: 400
			Malformed request (missing/invalid parameters or values)

	Sample call:
		$scope.formData = {
			'email': totally_real_person@ufl.edu,
			'password': 123456seven
		};
		$http.post('/api/user/login',$scope.formData)
		.success(function (data, status, headers, config) {
			console.log(data);
		})
		.error(function (data, status, header, config) {
			console.log(data);
		});
=====================================================================
Get Current Events (Requires authentication via cookie)
	Description:		Gets a list of alphanumeric event IDs for currently active
							events (meetings, CTFs, conferences, etc.)
	URL:					/event/get_current_events
	Method:				GET
	URL Parameters: 	None
	Request Body:		{}
	Successful Response:
		Status: 200
		Data:
			{
				"event_list": [string array]
			}

	Error Response:
		Status: 500
			Server error
			OR
		Status: 401
			Request didn't originate from a signed-in user (invalid cookie)

	Sample call:
		$http.get('/api/event/get_current_events')
		.success(function (data, status, headers, config) {
			console.log(data);
		})
		.error(function (data, status, header, config) {
			console.log(data);
		});
=====================================================================
Get Event Info (Requires authentication via cookie)
	Description:		Given an alphanumeric event ID, returns details about
							the event, such as a title, summary, and timeframe.
	URL:					/event/get_event_info?event_id=:id
	Method:				GET
	URL Parameters:
		event_id = [string]

	Request Body:		{}
	Successful Response:
		Status: 200
		Data:
			{
				"title": [string],
				"summary": [string],
				"time": [string]
			}

	Error Response:
		Status: 500
			Server error
			OR
		Status: 401
			Request didn't originate from a signed-in user (invalid cookie)

	Sample call:
		$http.get('/api/event/get_event_info?event_id=a14d198f318e04bc')
		.success(function (data, status, headers, config) {
			console.log(data);
		})
		.error(function (data, status, header, config) {
			console.log(data);
		});
=====================================================================
Sign In To Event
	Description:		Using the cookie in the request header to identify
							a session (and its associated user), logs the user's
							attendance of the event.
	URL:					/event/sign_in?event_id=:id:
	Method:				POST
	URL Parameters: 	None
	Request Body:
			{}

	Successful Response:
		Status: 200
			User successfully signed into the event

	Error Response:
		Status: 500
			Server error
			OR
		Status: 401
			Request didn't originate from a signed-in user (invalid cookie)
			OR

	Sample call:
		$http.post('/api/event/sign_in?event_id=a14d198f318e04bc')
		.success(function (data, status, headers, config) {
			console.log(data);
		})
		.error(function (data, status, header, config) {
			console.log(data);
		});
