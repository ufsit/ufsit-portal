(function() {
	//This is now just a reference to "myModule" in app.js
	angular.module("myModule").controller("gbm1Controller", function ( $http, $log, $location, $scope, validate) {
		$scope.formData = {
			'name': null,
			'email': null,
			'subscribe' : true
		};

		/* Control the visibility of different error messages */
		$scope.errors = {
			'invalid_email': false
		}

		$scope.submitLogin = function () {
			$http.post('/api/user/sign_in',$scope.formData)
			.success(function (data, status, headers, config) {
				alert(data);
				location.reload();
			})
			.error(function (data, status, header, config) {
				alert(data);
			});
		};

	});

})();
