(function() {
	//This is now just a reference to "myModule" in app.js
	angular.module("myModule").controller("gbm1Controller", function ( $http, $log, $location, $scope, validate) {
		$scope.formData = {
			'name': null,
			'email': null
		};

		$scope.submitLogin = function () {
			$http.post('/api/user/sign_in',$scope.formData)
			.success(function (data, status, headers, config) {
				console.log('Success! Status: ' + status);
				console.log('Data:\n' + data);
			})
			.error(function (data, status, header, config) {
				console.log('Request failed! Status: ' + status);
				console.log('Data:\n' + data);
			});
		};

	});

})();
