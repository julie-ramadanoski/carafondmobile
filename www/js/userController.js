// public/scripts/userController.js

(function() {

    'use strict';

    angular
        .module('carafond')
        .controller('UserController', UserController);  

    function UserController($http, $auth, $rootScope, $scope) {

        var vm = this;
        vm.currentUser;
        vm.ville;
        vm.users;
        vm.error;

        $scope.currentUser = localStorage.user;

        vm.getUsers = function() {


            //Grab the list of users from the API
            $http.get('http://localhost:8000/api/authenticate/')

             
            .success(function(users) {
                $rootScope.users = users;
            })
            
            .error(function(error) {
                $rootScope.error = error;
            });
        }

        vm.getAlertes= function(){
            
            //Grab the list of alertes from the API
            console.log($auth.isAuthenticated());   
            $http({method: 'GET', url: 'http://localhost:8000/api/authenticate/alertes?access_token='+localStorage.satellizer_token, headers: {'Authorization': 'Bearer '+localStorage.satellizer_token}})
            //$http.get('http://localhost:8000/api/authenticate/alertes')   

            .success(function(alertes) {
                $rootScope.alertes = alertes;
            })
            
            .error(function(error) {
                $rootScope.error = error;
            });

        }
        
    }

})();