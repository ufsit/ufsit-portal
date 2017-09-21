(function() {
    //This is now just a reference to "myModule" in app.js
    var app = angular.module("myModule");

    app.controller("RegisterController", function ($location, validate, $scope, $http, $log) {

        $scope.login = function () {

            $location.path('/');
        };

        $scope.register = function (registerForm) {
            if(registerForm.$valid) {
                validate.username($scope.username);
            }
            else {alert("Fill in registration info!")};
        };

    });

}());