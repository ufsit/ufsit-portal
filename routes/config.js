(function() {

//Module "myModule" is created here
var app = angular.module("myModule", ['ngRoute', 'pascalprecht.translate']);

 app.config(configure);

 configure.$inject = ['$routeProvider', '$translateProvider'];

 // function configure($routeProvider, $translateProvider){
 // 	$routeProvider
 // 	.when("/", {
 // 		templateUrl: "login.html",
 // 		controller: "LoginController"
 // 	})
 // 	.when("/register", {
 // 		templateUrl: "register.html",
 // 		controller: "RegisterController",
 // 		controllerAs: "main"
 // 	})
 // 	.when("/home/:username", {
 // 		templateUrl: "views/home.html",
 // 		controller: "mainController",
 // 		controllerAs: "main"
 // 		}).otherwise({redirectTo: "/"});
 //
 //  console.log(navigator.language);
 // };

 function configure($routeProvider, $translateProvider){
  $routeProvider
	  .when("/", {
		  templateUrl: "gbm1.html",
		  controller: "gbm1Controller"
	  }).otherwise({redirectTo: "/"});

	console.log(navigator.language);
 };

}());
