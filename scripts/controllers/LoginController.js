(function() {
    //This is now just a reference to "myModule" in app.js
    var app = angular.module("myModule");

    app.controller("LoginController", function ( $http, $log, $location, $scope, validate) {


        $scope.login = function (loginForm) {
            if(loginForm.$valid) {
              validate.login($scope.firstname);
          } else {alert("Please fill in login info!")}
        };

        $scope.register = function () {
            $location.path('/register');
        };

    });

}());