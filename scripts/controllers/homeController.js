(function() {
    //This is now just a reference to "myModule" in app.js
    var app = angular.module("myModule");

    app.controller("homeController", function ( $http, $log, $location, $scope, validate, $window) {

   	   $scope.redirect_lectureContent = function(){
            $window.open('https://uflorida-my.sharepoint.com/personal/elan22_ufl_edu/_layouts/15/guestaccess.aspx?folderid=1d67d1c9bc1be4aa68ea7bd61d21b612a&authkey=AeUSm-60JBHJWPqkG-KaxAU', '_blank');
        };

       $scope.update_resume = function(){
            $window.open('https://docs.google.com/forms/d/e/1FAIpQLScP-7T3VGFAcgVOcr12ErLfM0qIh4P9YjaxvCE8dqxIQ2sxVQ/viewform', '_blank');
        };

    });

}());
