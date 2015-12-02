var app = angular.module('crush', []);

app.controller('mainController', function($scope, $http, $location, $window) {
    $scope.formData = {};
    $scope.todoData = {};
    $scope.activeuid = 1;

    $http.get('/crush/interests/' + $scope.activeuid)
        .success(function(data) {
            $scope.todoData = data;
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




