'use strict';
(function() {
	// This is now just a reference to "myModule" in app.js
	angular.module('myModule').controller('gbm1Controller', function( $http, $log, $location, $scope, validate) {
		$scope.formData = {
			'name': null,
			'email': null,
			'subscribe': true,
		};

		/* Control the visibility of different error messages */
		$scope.errors = {
			'invalid_email': false,
		};

		$scope.submitLogin = function() {
			$http.post('/api/user/sign_in', $scope.formData)
			.success(function(data, status, headers, config) {
				alert(data);
				location.reload();
			})
			.error(function(data, status, header, config) {
				alert(data);
			});
		};
	});
})();


/* Stress test: Make tons of requests per second and check if they go through in order and without duplicates
var counter = 0;
var stressTest = function(){
	$http.post('/api/user/sign_in',{
		'name': counter++,
		'email': 'email@address.com',
		'subscribe' : true
	})
	.success(function (data, status, headers, config) {
		console.log(data);
		for(var i = 0; i < 999; i++){var j = i*2;}
		stressTest();
	})
	.error(function (data, status, header, config) {
		console.log(data);
	});
}
stressTest();
*/
