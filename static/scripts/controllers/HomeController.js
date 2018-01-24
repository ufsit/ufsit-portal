'use strict';
(function() {
	// This is now just a reference to "myModule" in app.js
	let app = angular.module('myModule');

	app.controller('HomeController', function( Session, $http, $rootScope, $log, $location, $scope, $window) {
		$scope.show_name = false;	// Don't show the person's name until it loads

		// Validate the user's session
		validate_session((is_logged_in, user_data)=>{
			/* If the user is not logged in, redirect to the login page*/
			if (!is_logged_in) {
				Session.destroy();
				$location.path('/login');
			} else { // Otherwise, render the page normally
				Session.create(user_data.name);

				$scope.show_name = true;
				$scope.full_name = user_data.name;
				$scope.email_addr = user_data.email;
			}
		});


		function validate_session(callback) {
			$http.get('/api/session/validate')
				.success(function(data, status, headers, config) {
					callback(true, data);
				})
			.error(function(data, status, headers, config) {
				callback(false);
			});
		}

		$scope.sign_in = function() {
			console.log('clicked sign in');
			$http.post('/api/event/sign_in')
				.success(function(data, status, headers, config) {
					alert('Thanks for signing in, ' + $scope.full_name + '.');
				})
			.error(function(data, status, headers, config) {
				if (status == 401) {
					alert('You\'ve already signed-in today!');
				} else {
					alert('Something went wrong');
				}
			});
		};

		// redirect to sharepoint that stores lecture content
		$scope.redirect_lecture_content = function() {
			$window.open('https://uflorida-my.sharepoint.com/personal/elan22_ufl_edu/_layouts/15/guestaccess.aspx?folderid=0d67d1c9bc1be4aa68ea7bd61d21b612a&authkey=AbD-gTKCDdCIpE8vtELGWzw', '_blank'); // eslint-disable-line max-len
		};
		// redirect to googleForms that allows resume' uploads
		$scope.redirect_update_resume = function() {
			$window.open('https://docs.google.com/forms/d/e/1FAIpQLScP-7T3VGFAcgVOcr12ErLfM0qIh4P9YjaxvCE8dqxIQ2sxVQ/viewform', '_blank'); // eslint-disable-line max-len
		};
		// redirect to ufsit.org/blog that allows member to see latest events
		$scope.redirect_events_news = function() {
			$window.open('http://ufsit.org/blog/', '_blank');
		};
		// redirect to googleForms that allows writeup submissions
		$scope.redirect_upload_writeup = function() {
			$window.open('https://goo.gl/forms/nYJ3nI4Eg56pIjyo1', '_blank');
		};
	});
}());
