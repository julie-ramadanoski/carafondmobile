// public/scripts/userController.js

(function() {

    'use strict';

    angular
        .module('carafond')
        .controller('UserController', UserController);  

    function UserController($http, $auth, $rootScope, $scope) {

        var vm = this;
        vm.currentUser = localStorage.user;
        vm.users;
        vm.error;

        vm.getUsers = function() {

            //Grab the list of users from the API
            $http.get('http://localhost:8000/api/authenticate')
             
            .success(function(users) {
                $rootScope.users = users;
            })
            
            .error(function(error) {
                $rootScope.error = error;
            });
        }

        
    }

})();