'use strict';
(function() {
	// Module "myModule" is created here
	let app = angular.module('myModule', ['ngRoute', 'pascalprecht.translate']);

	app.config(configure);

	configure.$inject = ['$routeProvider', '$translateProvider'];

	function configure($routeProvider, $translateProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'login.html',
				controller: 'LoginController',
			})
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'LoginController',
			controllerAs: 'main',
		})
		.when('/register', {
			templateUrl: 'register.html',
			controller: 'RegisterController',
			controllerAs: 'main',
		})
		.when('/admin', {
			templateUrl: 'admin.html',
			controller: 'AdminController',
			controllerAs: 'main',
		})
		.when('/home', {
			templateUrl: 'views/home.html',
			controller: 'homeController',
			controllerAs: 'home',
		})
		//	.when("/meeting_signin", {
		//		templateUrl: "views/meeting_signin.html",
		//		controller: "meetingController",
		//		controllerAs: "meeting"
		//	})
		.otherwise({redirectTo: '/'});

		console.log(navigator.language);
	}
}());
