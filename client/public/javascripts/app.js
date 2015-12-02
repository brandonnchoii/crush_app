var app = angular.module('crush', ['ngRoute']);

app.config(function($routeProvider) {
        $routeProvider

        .when('/', {
                templateUrl : '/client/views/home.html',// '/pages/home.html',
                //template:' <h1> hi</h1>',
                controller  : 'mainController'
            })
        .when('/test', {
                templateUrl : '/client/views/test.html', //'/pages/test.html',
                controller  : 'mainController'
            })
    });

app.controller('mainController', function($scope, $http, $location, $window) {
    $scope.formData = {};
    $scope.interests = {};
    $scope.newUser = {};
    $scope.activeuid = 1;

    $http.get('/crush/interests/' + $scope.activeuid)
        .success(function(data) {
            $scope.interests = data;
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });

    //Note: example: {"interest": "teletubbies"} instead of form data. Right now routes.js processes form data to call data.text, not data.interest
    $scope.addInterest = function() {
        console.log($scope.formData);
        $http.post('/crush/interests/' + $scope.activeuid, $scope.formData)
            .success(function(data) {
                $scope.interests = data;
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    }

    $scope.createAccount = function() {
        console.log("createAccount");
        console.log($scope.newUser);
        $http.post('/crush/interests/' + $scope.activeuid, $scope.formData)
            .success(function(data) {
                $scope.todoData = data;
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    }

    $scope.getUID = function(email, pw) {
        $http.post('/login/' + email + "/" + pw)
            .success(function(data) {
                console.log(data);
                if (data == null)
                    console.log("invalid user/pw combo");
                else{
                    console.log("login");
                    $scope.activeuid = data.uid;
                }
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    }


    $scope.removeInterest = function(interest) {
        $http.delete('/crush/interests/' + $scope.activeuid + '/' + interest)
            .success(function(data) {
                console.log("successfully removed interest");
                $scope.interests = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.redirect = function(){
        console.log('clicked');
        console.log(interests);
      //  $location.path('test.html');
        $window.location.href = "test.html";
    }

});




