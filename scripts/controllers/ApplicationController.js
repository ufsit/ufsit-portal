'use strict';

(function() {
	// This is now just a reference to "myModule" in app.js
	let app = angular.module('myModule');

	app.controller('ApplicationController', function( Session, $http, $rootScope, $location, $scope) {
		$scope.session = Session;

		$scope.log_out = function() {
			Session.destroy();
			$http.post('/api/session/logout');
			$location.path('/login');
		};

		$scope.isActive = function(viewLocation) {
			return $location.path().indexOf(viewLocation) === 0;
		};
	});
}());
