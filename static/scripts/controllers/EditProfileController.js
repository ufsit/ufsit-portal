'use strict';
(function() {
	let app = angular.module('myModule');

	app.filter('anyInvalidDirtyFields', function() {
		return function(form) {
			for (let prop in form) {
				if (form.hasOwnProperty(prop)) {
					if (form[prop] === undefined || form[prop].$invalid && form[prop].$dirty) {
						return true;
					}
				}
			}
			return false;
		};
	});

	app.controller('EditProfileController', function($location, profile_data, $scope, $http, $log, $window) {
		// reformat this profile data item to work with checkbox
		profile_data.mass_mail_optin = profile_data.mass_mail_optin === 1;

		$scope.profile_name = profile_data.profile_name;

		console.log(profile_data);

		$scope.formData = {
			name: profile_data.full_name,
			email: profile_data.email,
			grad_year: profile_data.grad_date,
			subscribe: profile_data.mass_mail_optin,
		};

		// Control the visibility of messages
		$scope.notification = {
			'generic_error': false,
			'generic_success': false,
		};

		$scope.cancel_update = function() {
			$location.path('/');
		};

		const form_changed = function() {
			return $scope.formData.name !== profile_data.full_name ||
				$scope.formData.email !== profile_data.email ||
				$scope.formData.grad_year !== profile_data.grad_date ||
				$scope.formData.subscribe !== profile_data.mass_mail_optin ||
				($scope.formData.new_password && $scope.formData.old_password);
		};

		$scope.update_profile = function() {
			$window.scrollTo(0, 0);

			if (!form_changed()) {
				$scope.notification.error_text = 'Profile unchanged';
				$scope.notification.generic_error = true;
				$scope.notification.generic_success = false;
				return;
			}

			let endpoint = '';

			if (profile_data.user_id) {
				endpoint = '/api/user/profile/' + profile_data.user_id;
			} else {
				endpoint = '/api/user/profile';
			}

			$http.post(endpoint, $scope.formData)
			.success(function(data, status, headers, config) {
				$scope.notification.generic_success = true;
				$scope.notification.generic_error = false;
				$scope.edit_profile.$setPristine();

				$scope.notification.success_text = 'Profile updated. Changed:';
				$scope.notification.success_items = data;
			})
			.error(function(data, status, header, config) {
				if (status === 500) {
					$scope.notification.error_text = 'Internal server error';
				} else if (status === 400 || status === 401 || status === 403) {
					$scope.notification.error_text = data;
				} else {
					$scope.notification.error_text = 'Unknown error';
				}

				$scope.notification.generic_error = true;
				$scope.notification.generic_success = false;
				$window.scrollTo(0, 0);
			});
		};
	})
	.directive('passwordVerify', function() {
		return {
			restrict: 'A', // only activate on element attribute
			require: '?ngModel', // get a hold of NgModelController
			link: function(scope, elem, attrs, ngModel) {
				if (!ngModel) return; // do nothing if no ng-model

				// console.log(scope,elem,attrs,ngModel);
				const validate = function() {
					// values
					const dirty1 = scope.edit_profile.confirm_password.$dirty;
					const dirty2 = scope.edit_profile.new_password.$dirty;

					if (!dirty1 || !dirty2) {
						return;
					}

					const val1 = scope.formData.confirm_password;
					const val2 = scope.formData.new_password;

					// set validity
					ngModel.$setValidity('passwordVerify', val1 === val2);
				};

				// console.log('Me', attrs.ngModel, 'Watching other', attrs['passwordVerify']);

				// watch own value and re-validate on change
				scope.$watch(attrs.ngModel, function() {
					validate();
				});

				// watch the other value and re-validate on change
				scope.$watch(attrs['passwordVerify'], function(val) {
					validate();
				});
			},
		};
	});
}());
