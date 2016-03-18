// public/scripts/userController.js

(function() {

    'use strict';

    angular
        .module('carafond')
        .controller('UserController', UserController);  


    function UserController($http, $auth, $rootScope, $scope, $state) {

        var vm = this;
        vm.villeDepart='';
        vm.alertes;
        vm.users;
        vm.error;

        vm.getAlertes = function(){

            $http.get('http://localhost:8000/api/authenticate/alertes/'+ vm.villeDepart )
            .success(function(alertes) {
                $rootScope.alertes = alertes;
                $state.go('home.alertes'); // aller à la liste des résultats   
                           
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