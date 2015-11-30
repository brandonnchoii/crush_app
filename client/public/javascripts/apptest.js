var app = angular.module('crush', []);

app.controller('mainController', function($scope, $http, $location, $window) {
    $scope.formData = {};
    $scope.todoData = {};

    //Get all todos
    // $http.get('/api/v1/todos')
    //     .success(function(data) {
    //         $scope.todoData = data;
    //         console.log('hi');
    //         console.log(data);
    //     })
    //     .error(function(error) {
    //         console.log('Error: ' + error);
    //     });

    var id = 1;
    $http.get('/crush/interests/' + 1)
        .success(function(data) {
            $scope.todoData = data;
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });

    //{"interest": "teletubbies"}
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

    // // Create a new todo
    // $scope.createTodo = function(todoID) {
    //     $http.post('/api/v1/todos', $scope.formData)
    //         .success(function(data) {
    //             $scope.formData = {};
    //             $scope.todoData = data;
    //             console.log(data);
    //         })
    //         .error(function(error) {
    //             console.log('Error: ' + error);
    //         });
    // };



    // // Delete a todo
    // $scope.deleteTodo = function(todoID) {
    //     $http.delete('/api/v1/todos/' + todoID)
    //         .success(function(data) {
    //             $scope.todoData = data;
    //             console.log(data);
    //         })
    //         .error(function(data) {
    //             console.log('Error: ' + data);
    //         });
    // };

    $scope.redirect = function(){
        console.log('clicked');
        console.log(todoData);
      //  $location.path('test.html');
        $window.location.href = "test.html";
    }

});




