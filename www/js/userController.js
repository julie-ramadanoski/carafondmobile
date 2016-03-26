// public/scripts/userController.js

(function() {

    'use strict';

    angular
        .module('carafond')
        .controller('UserController', function UserController($http, $auth, $rootScope, $scope, $state) {

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

                $http.post('http://univoiturage.florian-guillot.fr/api/authenticate/alertes/delete', data)
                .success(function(result) {

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

                $http.post('http://univoiturage.florian-guillot.fr/api/authenticate/alertes', data)
                .success(function(deposeAlerte) {

                    $rootScope.currentUser.user.alertes = deposeAlerte;

                    $state.go('home.conducteur'); // aller à la liste des résultats   
                               
                })            
                .error(function(data, status, header, config) {
                    vm.error = data;
                    $state.go('home.conducteur'); 
                });
            }
            vm.updateDepose = function(){

                $http.get('http://univoiturage.florian-guillot.fr/api/authenticate/user')
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
                var url;
                if(vm.villeDepart){
                 var url ='http://univoiturage.florian-guillot.fr/api/authenticate/alertes/'+ vm.villeDepart;
                    
                }else{
                    
                 var url ='http://univoiturage.florian-guillot.fr/api/authenticate/alertes';
                }

                $http.get(url)
                .success(function(alertes) {
                    $rootScope.alertes = alertes;
                    $state.go('home.alertes'); // aller à la liste des résultats   
                               
                })
                
                .error(function(error) {
                    if(error){
                        vm.error = error;                    
                    }
                });
            }        
        });
})();