'use strict';
(function() {
	let app = angular.module('myModule');

	app.controller('ProfileController', function($location, profile_data, $scope, $log, $window) {
		$scope.profile_name = profile_data.profile_name;

		if (profile_data.user_id) {
			console.log(profile_data);
			$scope.user_link = '/profile/' + profile_data.user_id;
		} else {
			$scope.user_link = '/profile';
		}

		const dateaddtz = function(dt) {
			const tzo = new Date().getTimezoneOffset();
			const dif = tzo >= 0 ? '+' : '-';
			const pad = function(num) {
				const norm = Math.floor(Math.abs(num));
				return (norm < 10 ? '0' : '') + norm;
			};

			return dt.replace('Z', dif + pad(tzo / 60) +
				':' + pad(tzo % 60));
		};

		$scope.full_name = profile_data.full_name;
		$scope.email = profile_data.email;
		$scope.grad_date = profile_data.grad_date;
		$scope.mass_mail_optin = profile_data.mass_mail_optin === 1 ? 'Yes' : 'No';
		$scope.registration_date = dateaddtz(profile_data.registration_date);
	});
}());
