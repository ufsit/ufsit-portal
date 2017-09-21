(function() {
	//This is now just a reference to "myModule" in app.js
	var app = angular.module("myModule");

	app.controller("LoginController", function ( $http, $log, $location, $scope, validate) {

		$scope.formData = {
			'email': null,
			'password': null
		};

		/* Control the visibility of different error messages */
		$scope.notifications = {
			'invalid_credentials': false,
			'generic_error': false,
			'bad_request': false
		}

		$scope.submitLogin = function () {
			/* If the form values are valid */
			if($scope.formData &&
				(null != $scope.formData.email) &&
				(null != $scope.formData.password)){
					/* Make a request to the services to log in */
					$http.post('/api/user/login',$scope.formData)
					.success(function (data, status, headers, config) {
						console.log(status);
						console.log(headers);
						console.log(data);
					})
					.error(function (data, status, header, config) {
						if(status === 401){
							$scope.notifications.invalid_credentials = true;
						}
						else if(status === 400){
							$scope.notifications.bad_request = true;
						}
						else {
							$scope.notifications.generic_error = true;
						}
					});
			}
		};

		$scope.register = function () {
			$location.path('/register');
		};

	});


	//  app.controller("LoginController", function ( $http, $log, $location, $scope, validate) {
	//      $scope.login = function (loginForm) {
	//          if(loginForm.$valid) {
	//            validate.login($scope.firstname);
	//        } else {alert("Please fill in login info!")}
	//      };
	//
	//      $scope.register = function () {
	//          $location.path('/register');
	//      };
	//
	//  });

}());
