// public/scripts/userController.js

(function() {

    'use strict';

    angular
        .module('carafond')
        .controller('UserController', function UserController($http, $auth, $rootScope, $scope, $state, $ionicPopup) {

            var vm = this;

            vm.villeDepart='';
            vm.villeDepartAlerte='';
            vm.villeArriveeAlerte='';
            vm.heureAlerte='';

            // Liste des alertes recherchées par un conducteur
            vm.alertes = JSON.parse(localStorage.getItem('saveAlertes'));
            $scope.alertes = vm.alertes;

            // Utilisateur donné par le controlleur précédent ou réactualisé
            $scope.currentUser = JSON.parse(localStorage.getItem('user'));
            vm.currentUser = $scope.currentUser;

            // Au refresh réauthentifier l'utilisateur pour le bouton déconnexion
            if (vm.currentUser != null){
                $rootScope.authenticated = true; 
            }


            $scope.showAlertVilleInexistante = function(error) {
                var msg = error?error.error:'Une ou plusieurs villes sont mal orthographiées ou non répertoriées';
                var alertPopup = $ionicPopup.alert({
                    title: 'Ville non trouvée',
                    template: msg
                });
            };
            $scope.showAlertSuppr = function(error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Erreur Suppression',
                    template: error
                });
            };

            vm.onTabSelected = function(){

                $state.go('home.conducteur');
            }
            vm.suppAlerte = function(){

                var data = JSON.stringify({
                    idAlerte: $scope.currentUser.alertes[0].id
                });

                $scope.loading=true;

                $http.post('http://univoiturage.florian-guillot.fr/api/authenticate/alertes/delete', data)
                .success(function(result) {

                    $scope.loading=false;

                    // Vider les alertes et mettre à jour le scope utilisateur
                    vm.currentUser.alertes = [];
                    $scope.currentUser = vm.currentUser;

                    // Sauvegarder l'utilisateur mis à jour
                    var user = JSON.stringify(vm.currentUser);
                    localStorage.setItem('user', user);
                               
                })            
                .error(function(data, status, header, config) {
                    $scope.loading=false;
                    $scope.showAlertSuppr(data);
                });

            }
            vm.setAlertes = function(){

                var data = JSON.stringify({
                    villeDepartAlerte: vm.villeDepartAlerte,
                    villeArriveeAlerte: vm.villeArriveeAlerte,
                    heureAlerte: vm.heureAlerte
                });

                $scope.loading=true;

                $http.post('http://univoiturage.florian-guillot.fr/api/authenticate/alertes', data)
                .success(function(deposeAlerte) {
                   
                   $scope.loading=false;

                   // Modifier le scope et mettre à jour la vue
                    $scope.currentUser.alertes[0] = deposeAlerte;
                    vm.currentUser = $scope.currentUser;

                    // Sauvegarder l'utilisateur mis à jour
                    var user = JSON.stringify(vm.currentUser);
                    localStorage.setItem('user', user);
                               
                })            
                .error(function(data, status, header, config) {

                    $scope.loading=false;
                    $scope.showAlertVilleInexistante();

                });
            }
            
            vm.getAlertes = function(){

                var url;
                if(vm.villeDepart){
                    url ='http://univoiturage.florian-guillot.fr/api/authenticate/alertes/'+ vm.villeDepart;                    
                }else{                    
                    url ='http://univoiturage.florian-guillot.fr/api/authenticate/alertes';
                }

                $scope.loading=true;

                $http.get(url)
                .success(function(alertes) {

                    $scope.loading=false;

                    // $scope pour être acheminé à la nouvelle vue
                    $scope.alertes = alertes;
                    $state.go('home.alertes'); // aller à la liste des résultats   
                   
                    // Sauvegarde des alertes si rechargement de la page
                    var saveAlertes = JSON.stringify(alertes);
                    localStorage.setItem('saveAlertes', saveAlertes);
                               
                })                
                .error(function(error) {
                    $scope.loading=false;
                    $scope.showAlertVilleInexistante(error);
                });
            }        
        });
})();