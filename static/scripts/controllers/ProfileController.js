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

		$scope.full_name = profile_data.full_name;
		$scope.email = profile_data.email;
		$scope.grad_date = profile_data.grad_date;
		$scope.mass_mail_optin = profile_data.mass_mail_optin === 1 ? 'Yes' : 'No';
		$scope.registration_date = profile_data.registration_date;
	});
}());
