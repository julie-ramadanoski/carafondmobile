// public/scripts/userController.js

(function() {

    'use strict';

    angular
        .module('carafond')
        .controller('UserController', UserController);  

    function UserController($http, $auth, $rootScope, $state) {

        //$auth.logout = '/';
        var vm = this;

        vm.users;
        vm.error;

        vm.getAlertes = function(){

            $http.get('http://localhost:8000/api/authenticate/alertes' )
            //$http.get('http://localhost:8000/api/authenticate/alertes?token=' + localStorage.getItem('satellizer_token') )
            .success(function(alertes) {
                vm.alertes = alertes;
                console.log(alertes);
            })
            
            .error(function(error) {
                vm.error = error;
            });
        }

        vm.getUsers = function() {

            //Grab the list of users from the API
            $http.get('http://localhost:8000/api/authenticate')

            .success(function(users) {
                vm.users = users;
                console.log(users);
            })
            
            .error(function(error) {
                vm.error = error;
            });
        }

        // We would normally put the logout method in the same
        // spot as the login method, ideally extracted out into
        // a service. For this simpler example we'll leave it here
        vm.logout = function() {

            $auth.logout().then(function() {

                // Remove the authenticated user from local storage
                localStorage.removeItem('user');

                // Flip authenticated to false so that we no longer
                // show UI elements dependant on the user being logged in
                $rootScope.authenticated = false;

                // Remove the current user info from rootscope
                $rootScope.currentUser = null;

                $state.go('auth');
            });
        }
    }

})();