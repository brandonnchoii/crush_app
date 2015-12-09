var app = angular.module('crush', []);

//var activeuid = null;
//http://stackoverflow.com/questions/21919962/share-data-between-angularjs-controllers

app.controller('mainController', function($scope, $http) {

    $scope.formData = {};
    $scope.todoData = {};
    $scope.registerInfo = {};
    $scope.messages = {};
    $scope.loginInfo = {};
    $scope.activeuid = -1;
    $scope.activeUserData = {};
    $scope.activeUserFriends = {};
    $scope.currentUserData = {};
    $scope.currentView = 'index.html';
    $scope.messageText = {text: ""};
    $scope.relationships = {};
    $scope.friends = {};
    $scope.interests = {};

    $scope.hasActiveID = function() {
        if($scope.activeuid >= 0)
            return true;
        return false;
    }

    $scope.isCurrentView = function(str){
        if ($scope.currentView == str)
            return true;
        return false;
    }

    $scope.setCurrentView = function(str, uid){
        console.log('setCurrentView to ' + str);
        console.log(uid);
        $scope.currentView = str;
        if (str == "profile.html" && uid == null){
            console.log('initializeProfile1');
            $scope.initializeProfile($scope.activeuid);
            $scope.activeUserFriends = $scope.friends;
        }
        if (str == "profile.html" && uid != null){
            console.log('initializeProfile ' + uid);
            $scope.initializeProfile(uid);
            if (uid != $scope.activeuid){
                console.log('not the active id!');
                $scope.loadCurrentUserInfo(uid);
            }
            else{
                $scope.currentUserData = $scope.activeUserData;
            }

        }
    }

    $scope.loadCurrentUserInfo = function(uid) {
        console.log("load current user info");
          $http.get('/crush/user/' + uid)
                    .success(function(data) {
                        if(data.length == 0)
                            console.log('welp');
                        else{
                            $scope.currentUserData = data[0];
                            console.log(data[0]);
                            console.log('current user data ' + $scope.currentUserData);
                        }
                    })
            .error(function(error) {
                //errors always print out as error? how to do error checking?
                console.log("Invalid loadSelectedUserInfo");
                console.log('Error: ' + error);
            // })
        });
    }

    $scope.createAccount = function() {
        console.log("createAccount");

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        $scope.registerInfo.joinDate = yyyy + "-" + mm + "-" + dd;

        $http.post('/crush/user/', $scope.registerInfo)
            .success(function(data) {
                console.log('user created');
                console.log(data);
                console.log(data[0]);
                console.log(data[0].uid);
                $scope.activeuid = data[0].uid;
                $scope.activeUserData = data[0];
                $scope.currentUserData = $scope.activeUserData;
                console.log($scope.activeUserData);
                $scope.setCurrentView('profile.html');
                console.log($scope.activeuid);
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

        // var promise = new Promise(
            // function(resolve, reject){
                $http.get('/crush/user/' + email + "/" + password)
                    .success(function(data) {
                        if(data.length == 0)
                            console.log('login not actually successful');
                        else{
                            console.log('login successful');
                            console.log(data);
                            console.log(data[0]);
                            console.log(data[0].uid);
                            $scope.activeuid = data[0].uid;
                            $scope.activeUserData = data[0];
                            $scope.currentUserData = $scope.activeUserData;
                            console.log($scope.activeuid);
                            console.log($scope.activeUserData);
                            //resolve(data[0]);
                            $scope.setCurrentView('profile.html');
                        }
                    })
            .error(function(error) {
                //errors always print out as error? how to do error checking?
                console.log("Invalid email/password combination.");
                console.log('Error: ' + error);
            // })
        });

    // promise.then(
    //     function(val){
    //         console.log('after promise');
    //         console.log("post promise");
    //         console.log(val);
    //         console.log('set view');
    //         $scope.activeuid = val.uid;
    //         $scope.activeUserData = val;

    //         $scope.currentView = 'profile.html';
    //         console.log($scope.currentView);
    //     })
    // .catch(
    //     function(reason){
    //         console.log('rejection');
    //     })
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

    // $scope.redirect = function(){
    //     console.log('clicked');
    //     console.log(todoData);
    //   //  $location.path('test.html');
    //     $window.location.href = "test.html";
    // }

    // this should be in profilecontroller, but we'll keep it 
    // here for now temporarily until the angular controller problem is fixed
    $scope.initializeProfile = function(uid) {
         // setTimeout(function() {
            $scope.getRelationships(uid);
            $scope.getFriends(uid);
            $scope.getInterests(uid);
            $scope.getMessages(uid);
         // }, 9000);
    }

    $scope.getMessages = function(uid){
        console.log('getMessages()');
        $http.get('/crush/allmess/' + uid)
                .success(function(data) {
                    $scope.messages = data;
                    // for (var i = 0; i < data.length; i ++){
                    //     data[i].name = $scope.getUser(data[i].nfrom);
                    // }
                    
                    console.log('get messages success');
                    console.log(data);
                })
                .error(function(error) {
                    console.log('get messages failed');
                    console.log('Error: ' + error);
                });
    }

    $scope.getRelationships = function(uid) {
        console.log('relationshipsssssssss');
        $http.get('/crush/relationships/' + uid)
                .success(function(data) {
                    $scope.relationships = data;
                    console.log('get relationships success');
                    console.log(data);
                })
                .error(function(error) {
                    console.log('get relationships failed');
                    console.log('Error: ' + error);
                });
    }

    $scope.getFriends = function(uid) {
        console.log('relationshipsssssssss');
        $http.get('/crush/friends/' + uid)
                .success(function(data) {
                    $scope.friends = data;
                    console.log('get friends success');
                    console.log(data);
                })
                .error(function(error) {
                    console.log('get friends failed');
                    console.log('Error: ' + error);
                });
    }

    $scope.getInterests = function(uid) {
         $http.get('/crush/interests/' + uid)
            .success(function(data) {
                console.log('/crush/interests/' + $scope.activeuid);
                console.log(data);
                $scope.interests = data;
                console.log('get interests success');
                console.log(data);
                console.log($scope.interests);
            })
            .error(function(error) {
                console.log('get interests failed');
                console.log('Error: ' + error);
            });
    }

    $scope.getUser = function(uid) {
        $http.get('/crush/name/' + uid)
            .success(function(data) {
                return data;
            })
            .error(function(error) {
                console.log('get interests failed');
                console.log('Error: ' + error);
            });
    }

    $scope.isFriend = function() { //function(uid)
        //console.log('isfriend ' + uid);
        console.log('isfriend');
        console.log($scope.friends);
        console.log($scope.currentUserData);
        if ($scope.activeUserFriends != undefined && $scope.currentUserData.uid != undefined){
            console.log('hay');
            for (var i = 0; i < $scope.friends.length; i++){
                //console.log("i " + i);

                 console.log("loop " + $scope.friends[i].uid + " " + i);
                 console.log("loop " + $scope.currentUserData.uid);
                if ($scope.activeUserFriends[i].uid == $scope.currentUserData.uid){
                    console.log("friend " + $scope.friends[i].uid + " is friends with " + $scope.currentUserData.uid);
                    return true;
                }
            }
        }

        //console.log("friend " + $scope.friends[i].uid + " is not friends with " + $scope.currentUserData.uid);
        console.log("not friends");
        return false;
    }


    //sending a crush message
    $scope.sendCrush = function() {
       alert($scope.messageText.text)
       $http.get()
            .success(function(data) {
                return data;
            })
            .error(function(error) {
                console.log('error in sending crush');
                console.log('Error: ' + error);
            })
    }


//autocomplete
// setTimeout(function(){
//      console.log('profile');
//   $(function() {
//             var availableTags = [
//               "ActionScript",
//               "AppleScript",
//               "Asp",
//               "BASIC",
//               "C",
//               "C++",
//               "Clojure",
//               "COBOL",
//               "ColdFusion",
//               "Erlang",
//               "Fortran",
//               "Groovy",
//               "Haskell",
//               "Java",
//               "JavaScript",
//               "Lisp",
//               "Perl",
//               "PHP",
//               "Python",
//               "Ruby",
//               "Scala",
//               "Scheme"
//             ];
//             $( "#tags" ).autocomplete({
//               source: availableTags
//             });
//           });
// console.log("availableTags");
//              console.log(availableTags);
//          }, 5000);

});

app.controller('profileController', function($scope, $http) {

    console.log('profilecontroller');
    $scope.test2 = 'hello';
    $scope.test = ['hi', 'bye'];
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


/*/crush/relationships/:uid*/



