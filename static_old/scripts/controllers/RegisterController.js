'use strict';
(function() {
	// This is now just a reference to "myModule" in app.js
	let app = angular.module('myModule');
	app.controller('RegisterController', function($location, $scope, $http, $log) {
		$scope.emailFormat = /^.+@(cise\.)?ufl\.edu$/;
		$scope.formData = {
			'name': null,
			'email': null,
			'confirm_password': '',
			'password': '',
			'grad_year': null,
			'subscribe': true,
		};
		/* Control the visibility of different error messages */
		$scope.notifications = {
			'generic_error': false,
			'email_conflict': false,
			'bad_request': false,
		};

		$scope.submit_registration = function() {
			$http.post('/api/user/register', $scope.formData)
			.success(function(data, status, headers, config) {
				// $scope.notifications.successful_registration = true;
				alert('Success! Your account has been created. You may now log in');
				$location.path('/login');
			})
			.error(function(data, status, header, config) {
				if (status === 409) {
					$scope.notifications.email_conflict = true;
				} else if (status === 400) {
					$scope.notifications.bad_request = true;
				} else {
					$scope.notifications.generic_error = true;
				}
			});
		};
	})
	// XXXXXX: HACK
	.directive('passwordVerifyy', function() {
		return {
			restrict: 'A', // only activate on element attribute
			require: '?ngModel', // get a hold of NgModelController
			link: function(scope, elem, attrs, ngModel) {
				if (!ngModel) return; // do nothing if no ng-model


				// console.log(scope,elem,attrs,ngModel);
				const validate = function() {
					// values
					const dirty1 = scope.register.confirm_password.$dirty;
					const dirty2 = scope.register.password.$dirty;

					if (!dirty1 || !dirty2) {
						return;
					}

					const val1 = scope.formData.confirm_password;
					const val2 = scope.formData.password;

					// set validity
					ngModel.$setValidity('passwordVerifyy', val1 === val2);
				};

				// console.log('Me', attrs.ngModel, 'Watching other', attrs['passwordVerifyy']);

				// watch own value and re-validate on change
				scope.$watch(attrs.ngModel, function() {
					validate();
				});

				// watch the other value and re-validate on change
				scope.$watch(attrs['passwordVerifyy'], function(val) {
					validate();
				});
			},
		};
	});
}());
