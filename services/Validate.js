
var app = angular.module("myModule");

app.factory('validate', function ($http, $log, $location) {
    return {

        username: function (username) {

            var data = JSON.stringify({firstname: username});
            console.log = (data);

            $http({
                method: "GET",
                url: '/data/' + username
            }).then(function successCallback(response) {
                 if(response.data.data !== undefined){
                     $log.info( 'Already Exists!');
                     alert('Username is Unavailable!');
                 }
                 else {
                     $log.info("Creating user");
                     alert("Account Created!");
                     createUser();
                     $location.path('/');
                }
            }, function errorCallback(response) {
                $log.error(response.error);
            });

            var createUser = function () {
                $http({
                    url: '/data',
                    data: data,
                    method: "POST",
                    headers: {"Content-type": "application/json"}
                }).then(function successCallback(response) {
                    $log.info('Successful Post');
                    $location.path('/');
                }, function errorCallback(response) {
                    $log.info('Unsuccessful Post');
                });
            }
        },

        login: function (username) {

            $http({
                method: "GET",
                url: '/data/' + username
            }).then(function successCallback(response) {
                if(response.data.data === undefined){
                    alert( 'Does Not Exists!');
                }
                else {
                    $log.info("Login Success");
                    $location.path('/home/' + username);
                }
            }, function errorCallback(response) {

                $log.info({info:"Login Failure", data: response.error});

        });
        }
    };
});