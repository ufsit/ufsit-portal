'use strict';
(function() {
	// This is now just a reference to "myModule" in app.js
	let app = angular.module('myModule');

	app.controller('AdminController', function( $http, $log, $location, $scope, validate) {
		$http.get('/api/admin/list_users')
			.success(function(data, status, headers, config) {
				$scope.users = angular.forEach(data, function(v, k) {
					if (v['mass_mail_optin'] == 1) {
						v['mass_mail_optin'] = 'Yes';
					} else {
						v['mass_mail_optin'] = 'No';
					}

					return {k: v};
				});
			})
		.error(function(data, status, header, config) {
			$scope.users = [];
			console.log(data);
		});
	});
}());
