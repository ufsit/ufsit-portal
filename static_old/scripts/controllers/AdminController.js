'use strict';
(function() {
	// This is now just a reference to "myModule" in app.js
	let app = angular.module('myModule');

	app.controller('AdminController', function( $http, $log, $location, $scope) {
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

		$http.get('/api/admin/list_users')
			.success(function(data, status, headers, config) {
				$scope.users = angular.forEach(data, function(v, k) {
					if (v['mass_mail_optin'] == 1) {
						v['mass_mail_optin'] = 'Yes';
					} else {
						v['mass_mail_optin'] = 'No';
					}

					v['registration_date'] = dateaddtz(v['registration_date']);

					return {k: v};
				});
			})
		.error(function(data, status, header, config) {
			$scope.users = [];
			console.log(data);
		});
	});
}());
