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
            // Donnée par ce controller
            vm.alertes = JSON.parse(localStorage.getItem('saveAlertes'));
            $scope.alertes = vm.alertes;

            // Utilisateur donné par le controlleur précédent ou réactualisé
            $scope.currentUser = JSON.parse(localStorage.getItem('user'));
            vm.currentUser = $scope.currentUser;
            vm.error ="";

            vm.onTabSelected = function(){

                $state.go('home.conducteur');
            }
            vm.suppAlerte = function(){

                var data = JSON.stringify({
                    idAlerte: $scope.currentUser.alertes[0].id
                });

                $http.post('http://univoiturage.florian-guillot.fr/api/authenticate/alertes/delete', data)
                .success(function(result) {

                    // Vider les alertes et mettre à jour le scope utilisateur
                    vm.currentUser.alertes = [];
                    $scope.currentUser = vm.currentUser;

                    // Sauvegarder l'utilisateur mis à jour
                    var user = JSON.stringify(vm.currentUser);
                    localStorage.setItem('user', user);

                    $state.go('home.passager'); // aller à la liste des résultats   
                               
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
                   
                   // Modifier le scope et mettre à jour la vue
                    $scope.currentUser.alertes[0] = deposeAlerte;
                    vm.currentUser = $scope.currentUser;

                    // Sauvegarder l'utilisateur mis à jour
                    var user = JSON.stringify(vm.currentUser);
                    localStorage.setItem('user', user);

                    $state.go('home.passager'); // aller à la liste des résultats   
                               
                })            
                .error(function(data, status, header, config) {
                    vm.error = data;
                    $state.go('home.passager'); 
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

                    // $scope pour être acheminé à la nouvelle vue
                    $scope.alertes = alertes;
                    $state.go('home.alertes'); // aller à la liste des résultats   
                   
                    // Sauvegarde des alertes si rechargement de la page
                    var saveAlertes = JSON.stringify(alertes);
                    localStorage.setItem('saveAlertes', saveAlertes);
                               
                })
                
                .error(function(error) {
                    if(error){
                        $scope.error = error;                    
                    }
                });
            }        
        });
})();