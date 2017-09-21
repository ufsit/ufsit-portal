(function() {

//Module "myModule" is created here
var app = angular.module("myModule", ['ngRoute', 'pascalprecht.translate']);

 app.config(configure);

 configure.$inject = ['$routeProvider', '$translateProvider'];

 function configure($routeProvider, $translateProvider){
 	$routeProvider
 	.when("/", {
 		templateUrl: "login.html",
 		controller: "LoginController"
 	})
	.when("/login", {
 		templateUrl: "login.html",
 		controller: "LoginController",
 		controllerAs: "main"
 	})
 	.when("/register", {
 		templateUrl: "register.html",
 		controller: "RegisterController",
 		controllerAs: "main"
 	})
 // 	.when("/meeting_signin", {
 // 		templateUrl: "views/meeting_signin.html",
 // 		controller: "meetingController",
 // 		controllerAs: "meeting"
 // 	})
 // 	.when("/home", {
 // 		templateUrl: "views/home.html",
 // 		controller: "homeController",
 // 		controllerAs: "home"
 // 	})
	.otherwise({redirectTo: "/"});

  console.log(navigator.language);
 };

// /* Temporary, for GBM1 only */
//  function configure($routeProvider, $translateProvider){
//   $routeProvider
// 	  .when("/", {
// 		  templateUrl: "gbm1.html",
// 		  controller: "gbm1Controller"
// 	  }).otherwise({redirectTo: "/"});
//
// 	console.log(navigator.language);
//  };

}());
