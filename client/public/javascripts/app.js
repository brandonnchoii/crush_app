var app = angular.module('crush', []);

app.controller('mainController', function($scope, $http, $location, $window) {
    $scope.formData = {};
    $scope.todoData = {};
    $scope.registerInfo = {};
    $scope.activeuid = 1;
    $scope.currentView = 'index.html';

    $http.get('/crush/interests/' + $scope.activeuid)
        .success(function(data) {
            $scope.todoData = data;
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });

    $scope.checkActiveID = function() {
        if($scope.activeuid == null)
            return false;
        return true;
    }

    $scope.isCurrentView = function(str){
       // console.log('check if currentview is ' + str);
       // console.log('current view is ' + $scope.currentView);
        if ($scope.currentView == str)
            return true;
        return false;
    }

    $scope.setCurrentView = function(str){
        $scope.currentView = str;
        console.log('setCurrentView to ' + str);
    }

    $scope.createAccount = function() {
        console.log("createAccount");
        console.log($scope.registerInfo);
        $http.post('/crush/user/', $scope.registerInfo)
            .success(function(data) {
                console.log('user created');
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    }

    //Note: example: {"interest": "teletubbies"} instead of form data. Right now routes.js processes form data to call data.text, not data.interest
    $scope.addInterest = function() {
        console.log($scope.formData);
        $http.post('/crush/interests/' + $scope.activeuid, $scope.formData)
            .success(function(data) {
                $scope.todoData = data;
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    }

    $scope.removeInterest = function(interest) {
        $http.delete('/crush/interests/' + $scope.activeuid + '/' + interest)
            .success(function(data) {
                console.log("successfully removed");
                $scope.todoData = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.redirect = function(){
        console.log('clicked');
        console.log(todoData);
      //  $location.path('test.html');
        $window.location.href = "test.html";
    }

});




