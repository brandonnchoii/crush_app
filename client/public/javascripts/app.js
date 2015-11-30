var app = angular.module('crush', []);

app.controller('mainController', function($scope, $http, $location, $window) {
    $scope.formData = {};
    $scope.todoData = {};

    $http.get('/crush/interests/' + 1)
        .success(function(data) {
            $scope.todoData = data;
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });

    //Note: example: {"interest": "teletubbies"} instead of form data. Right now routes.js processes form data to call data.text, not data.interest
    $scope.addInterest = function(uid) {
        console.log($scope.formData);
        $http.post('/crush/interests/' + uid, $scope.formData)
            .success(function(data) {
                $scope.todoData = data;
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    }

    $scope.removeInterest = function(uid, interest) {
        console.log('removeinterest');
        $http.delete('/crush/interests/' + uid + '/' + interest)
            .success(function(data) {
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




