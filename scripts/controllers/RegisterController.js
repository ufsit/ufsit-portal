(function() {
    //This is now just a reference to "myModule" in app.js
    var app = angular.module("myModule");

    app.controller("RegisterController", function ($location, validate, $scope, $http, $log) {

		 $scope.formData = {
		  'name': null,
		  'email': null,
		  'password': null,
		  'gradYear': null,
		  'subscribe' : true
	  };

	  /* Control the visibility of different error messages */
	  $scope.errors = {
		  'invalid_email': false
	  }

	  $scope.submitLogin = function () {
		  $http.post('/api/user/register',$scope.formData)
		  .success(function (data, status, headers, config) {
			  console.log(data);
		  })
		  .error(function (data, status, header, config) {
			  console.log(data);
		  });
	  };

    });

}());
