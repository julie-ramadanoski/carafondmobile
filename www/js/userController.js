// public/scripts/userController.js

(function() {

    'use strict';

    angular
        .module('carafond')
        .controller('UserController', UserController);  


    function UserController($http, $auth, $rootScope, $scope, $state) {

        var vm = this;
        vm.villeDepart='';
        vm.villeDepartAlerte='';
        vm.villeArriveeAlerte='';
        vm.heureAlerte='';
        // Liste des alertes recherchées par un conducteur
        vm.alertes;
        // Alerte déposée par le passager
        vm.users;
        vm.error;


        vm.suppAlerte = function(){

            var data = JSON.stringify({
                idAlerte: $rootScope.currentUser.user.alertes[0].id
            });

            $http.post('http://localhost:8000/api/authenticate/alertes/delete', data)
            .success(function(result) {
                console.log(result);

                $rootScope.currentUser.user.alertes ="";

                $state.go('home.conducteur'); // aller à la liste des résultats   
                           
            })            
            .error(function(data, status, header, config) {
                vm.error = data;
            });

        }
        vm.setAlertes = function(){

            var data = JSON.stringify({
                villeDepartAlerte: vm.villeDepartAlerte,
                villeArriveeAlerte: vm.villeArriveeAlerte,
                heureAlerte: vm.heureAlerte
            });

            $http.post('http://localhost:8000/api/authenticate/alertes', data)
            .success(function(deposeAlerte) {
                console.log(deposeAlerte);

                $rootScope.currentUser.user.alertes = deposeAlerte;

                $state.go('home.conducteur'); // aller à la liste des résultats   
                           
            })            
            .error(function(data, status, header, config) {
                vm.error = data;
                $state.go('home.conducteur'); 
            });
        }
        vm.updateDepose = function(){

            $http.get('http://localhost:8000/api/authenticate/user')
            .success(function(user) {
                var user = JSON.stringify(user);

                localStorage.setItem('user', user);

                $rootScope.authenticated = true;
                $rootScope.currentUser = user;
                $state.go('home.passager');   
                           
            })            
            .error(function(data, status, header, config) {
                vm.error = data;
                $state.go('home.conducteur'); 
            });
        }
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