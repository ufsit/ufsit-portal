(function() {
	//This is now just a reference to "myModule" in app.js
	var app = angular.module("myModule");
	app.controller("RegisterController", function ($location, validate, $scope, $http, $log) {
		$scope.formData = {
			'name': null,
			'email': null,
			'password': null,
			'grad_year': null,
			'subscribe' : true
		};
		/* Control the visibility of different error messages */
		$scope.notifications = {
			'successful_registration': false,
			'generic_error': false,
			'email_conflict': false,
			'bad_request': false
		}

		$scope.submit_registration = function () {
			if($scope.formData &&
				(null != $scope.formData.name) &&
				(null != $scope.formData.email) &&
				(null != $scope.formData.password) &&
				(null != $scope.formData.grad_year) &&
				(null != $scope.formData.subscribe)){
					$http.post('/api/user/register',$scope.formData)
					.success(function (data, status, headers, config) {
						$scope.notifications.successful_registration = true;
					})
					.error(function (data, status, header, config) {

						if(status === 409){
							$scope.notifications.email_conflict = true;
						}
						else if(status === 400){
							$scope.notifications.bad_request = true;
						}
						else {
							$scope.notifications.generic_error = true;
						}
					});
				}
				else {
					console.log("Incomplete form");
				}
		};
	});
}());
