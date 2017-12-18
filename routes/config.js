'use strict';

(function() {
	// Module "myModule" is created here
	let app = angular.module('myModule', ['ngRoute']);

	app.config(configure);

	configure.$inject = ['$routeProvider', '$locationProvider'];

	function configure($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(true);

		$routeProvider
			.when('/', {
				templateUrl: 'login.html',
				controller: 'LoginController',
			})
		.when('/login', {
			title: 'Sign In',
			templateUrl: 'login.html',
			controller: 'LoginController',
			controllerAs: 'login',
		})
		.when('/register', {
			title: 'Register',
			templateUrl: 'register.html',
			controller: 'RegisterController',
			controllerAs: 'register',
		})
		.when('/admin', {
			templateUrl: 'admin.html',
			controller: 'AdminController',
			controllerAs: 'admin',
		})
		.when('/home', {
			title: 'Home',
			templateUrl: 'views/home.html',
			controller: 'homeController',
			controllerAs: 'home',
		})
		.when('/profile', {
			title: 'Profile',
			templateUrl: 'views/profile.html',
			controller: 'ProfileController',
			controllerAs: 'profile',
			resolve: {
				profile_data: function($http) {
					return $http.get('/api/user/profile').then(function(response) {
						return response.data;
					});
				},
			},
		})
		.otherwise({
			redirectTo: '/',
			resolve: {
				printer: function($window, $http) {
					let badpath = $window.location.pathname;

					// We dont care if this works or not
					// TODO: some how track the previous URL for context
					$http.post('/api/bad_route', {route: badpath});
					console.log('Route 404: ' + badpath);
				},
			},
		});
	}

	app.run(['$location', '$rootScope', function($location, $rootScope) {
		$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
			if (current.hasOwnProperty('$$route')) {
				if (current.$$route.title) {
					$rootScope.title = ' - ' + current.$$route.title;
				} else {
					$rootScope.title = '';
				}
			}
		});
	}]);

	app.run(function($rootScope, $location) {
		$rootScope.$on('$routeChangeError', function(event, current, previous, eventObj) {
			console.log(eventObj);
			$location.path('/');
		});
	});
}());
