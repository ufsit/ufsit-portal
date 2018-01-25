/* eslint-disable no-invalid-this */
'use strict';

(function() {
	// Module "myModule" is created here
	let app = angular.module('myModule', ['ngRoute', 'yaru22.angular-timeago']);

	app.config(configure);

	app.service('Session', ['$http', function($http) {
		this.login = function(data) {
			return $http.post('/api/user/login', data);
		};

		this.logout = function() {
			return $http.post('/api/session/logout');
		};

		this.create = function(test) {
			this.id = test;
		};

		this.destroy = function() {
			this.id = null;
		};
	}]);

	app.filter('anyInvalidDirtyFields', function() {
		return function(form) {
			for (let prop in form) {
				if (form.hasOwnProperty(prop)) {
					if (form[prop] === null || form[prop] === undefined || form[prop].$invalid && form[prop].$dirty) {
						console.log(prop + ': Invalid!');
						return true;
					}
				}
			}
			return false;
		};
	});

	configure.$inject = ['$routeProvider', '$locationProvider'];

	function configure($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');

		$routeProvider
			.when('/', {
				templateUrl: 'views/login.html',
				controller: 'LoginController',
			})
		.when('/login', {
			title: 'Sign In',
			templateUrl: 'views/login.html',
			controller: 'LoginController',
			controllerAs: 'login',
		})
		.when('/register', {
			title: 'Register',
			templateUrl: 'views/register.html',
			controller: 'RegisterController',
			controllerAs: 'register',
		})
		.when('/admin', {
			title: 'Admin List',
			templateUrl: 'views/admin.html',
			controller: 'AdminController',
			controllerAs: 'admin',
		})
		.when('/home', {
			title: 'Home',
			templateUrl: 'views/home.html',
			controller: 'HomeController',
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
		.when('/profile/edit', {
			title: 'Edit Profile',
			templateUrl: 'views/edit_profile.html',
			controller: 'EditProfileController',
			controllerAs: 'edit_profile',
			resolve: {
				profile_data: function($http) {
					return $http.get('/api/user/profile').then(function(response) {
						return response.data;
					});
				},
			},
		})
		.when('/profile/:user_id', {
			templateUrl: 'views/profile.html',
			controller: 'ProfileController',
			controllerAs: 'profile',
			resolve: {
				profile_data: function($http, $route) {
					// see https://docs.angularjs.org/api/ngRoute/service/$routeParams
					const user_id = $route.current.params.user_id;

					return $http.get('/api/user/profile/' + user_id).then(function(response) {
						response.data.user_id = user_id;
						return response.data;
					});
				},
			},
		})
		.when('/profile/:user_id/edit', {
			templateUrl: 'views/edit_profile.html',
			controller: 'EditProfileController',
			controllerAs: 'edit_profile',
			resolve: {
				profile_data: function($http, $route) {
					// see https://docs.angularjs.org/api/ngRoute/service/$routeParams
					const user_id = $route.current.params.user_id;

					return $http.get('/api/user/profile/' + user_id).then(function(response) {
						response.data.user_id = user_id;
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
			if (eventObj.status === 403) {
				console.log('Session expired.');
				$location.path('/');
			} else {
				console.log('Unknown route change error. Object:', eventObj);
			}
		});
	});
}());
