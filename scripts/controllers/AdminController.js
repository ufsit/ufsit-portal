'use strict';
(function() {
	// This is now just a reference to "myModule" in app.js
	let app = angular.module('myModule');

	app.controller('AdminController', function( $http, $log, $location, $scope, validate) {
		console.log('ADMIN');

		$http.get('/api/admin/list_users')
			.success(function(data, status, headers, config) {
				$scope.users = angular.forEach(data, function(v, k) {
					if (v['in_mailing_list'] == 1) {
						v['in_mailing_list'] = 'Yes';
					} else {
						v['in_mailing_list'] = 'No';
					}

					return {k: v};
				});
				console.log(data);
			})
		.error(function(data, status, header, config) {
			$scope.users = [];
			console.log(data);
		});
	});
}());
