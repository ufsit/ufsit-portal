(function() {
    //This is now just a reference to "myModule" in app.js
    var app = angular.module("myModule");

    app.controller("homeController", function ( $http, $log, $location, $scope, validate) {
		 $scope.show_name = false;	//Don't show the person's name until it loads

		 //Validate the user's session
		 validate_session((is_logged_in, user_data)=>{
			 /* If the user is not logged in, redirect to the login page*/
			 if(!is_logged_in){
				 $location.path('/login');
			 }
			 /* Otherwise, render the page normally */
			 else {
				 $scope.show_name = true;
				 $scope.full_name = user_data.name;
				 $scope.email_addr = user_data.email;
			 }
		 });


		 function validate_session(callback){
			 $http.get('/api/session/validate')
			 .success(function (data, status, headers, config) {
				 callback(true, data);
			 })
			 .error(function (data, status, headers, config) {
				 callback(false);
			 });
		 }

		 $scope.sign_in = function(){
			 console.log('clicked sign in');
			$http.post('/api/event/sign_in')
			.success(function (data, status, headers, config) {
			   alert('Thanks for signing in, ' + $scope.full_name + '.');
			})
			.error(function (data, status, headers, config) {
			   alert('Something went wrong');
			});
		 }

		 $scope.log_out = function(){
			 $http.post('/api/session/logout');
			 $location.path('/login');
		 }
    });

}());
