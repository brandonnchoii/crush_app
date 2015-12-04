var app = angular.module('crush', []);

//var activeuid = null;
//http://stackoverflow.com/questions/21919962/share-data-between-angularjs-controllers

app.controller('mainController', function($scope, $http, $location, $window) {
    $scope.formData = {};
    $scope.todoData = {};
    $scope.registerInfo = {};
    $scope.loginInfo = {};
    $scope.activeuid = -1;
    $scope.activeUserData;
    $scope.currentView = 'index.html';


    
   // $scope.getInterests = function() {
        $http.get('/crush/interests/' + $scope.activeuid)
            .success(function(data) {
                $scope.todoData = data;
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    //}

    //don't really need this here twice...
   // $scope.getInterests();

    $scope.hasActiveID = function() {
        if($scope.activeuid >= 0)
            return true;
        return false;
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

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        $scope.registerInfo.joinDate = yyyy + "-" + mm + "-" + dd;
        console.log($scope.registerInfo);

        $http.post('/crush/user/', $scope.registerInfo)
            .success(function(data) {
                console.log('user created');
                console.log(data);
                $scope.activeuid = data[0].uid;
                $scope.currentView = 'profile.html';
            })
            .error(function(error) {
                //errors always print out as error? how to do error checking?
                console.log('Error: ' + error);
            });
    }

    $scope.login = function() {
        console.log('loginnnn');
        console.log($scope.loginInfo);
        //get requests cannot be sent with a message body
        var email = $scope.loginInfo.email;
        var password = $scope.loginInfo.password;

        $http.get('/crush/user/' + email + "/" + password)
            .success(function(data) {
                if(data.length == 0)
                    console.log('login not actually successful');
                else{
                    console.log('login successful');
                    console.log(data);
                    $scope.activeuid = data[0].uid;
                    $scope.activeUserData = data[0];
                    console.log($scope.activeUserData);
                    $scope.currentView = 'profile.html';
                }
            })
            .error(function(error) {
                //errors always print out as error? how to do error checking?
                console.log("Invalid email/password combination.");
                console.log('Error: ' + error);
            });
        
    }

    $scope.logout = function() {
        $scope.activeuid = -1;
        $scope.currentView = 'index.html';
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

app.controller('profileController', function($scope, $http, $location, $window) {
    console.log('profilecontroller');
    $scope.interests = {};

    //upon loading
     $http.get('/crush/interests/' + $scope.activeuid)
            .success(function(data) {
                $scope.interests = data;
                console.log('get interests success');
                console.log(data);
            })
            .error(function(error) {
                console.log('get interests failed');
                console.log('Error: ' + error);
            });




});




