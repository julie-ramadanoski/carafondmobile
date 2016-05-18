// public/scripts/usercontroller.js

(function() {

    'use strict';


    angular
    .module('carafond')
    .controller('UserController', function UserController($http, $auth, $rootScope, $scope, $state, $ionicPopup, $ionicModal, $ionicHistory) {

        var vm                  = this;
        
        vm.ionicHistory         = $ionicHistory;
        vm.villeDepart          = '';
        vm.villeDepartAlerte    = '';
        vm.villeArriveeAlerte   = '';
        vm.heureAlerte          = '';
        vm.zoneKm               = 5;
        vm.villeGeoloc          = JSON.parse(localStorage.getItem('villeGeoloc'));

        vm.domaine              = "http://univoiturage.florian-guillot.fr";        

        // Load the modal from the given template URL
        $ionicModal.fromTemplateUrl('geomodal.html',{
            scope: $scope, // Use our scope for the scope of the modal to keep it simple                    
            animation: 'slide-in-up' // The animation we want to use for the modal entrance
        }).then(function($ionicModal) {
            vm.modal = $ionicModal;
        });
        $scope.closeModal = function() {
            vm.modal.hide();
        };
        // Liste des alertes recherchées par un conducteur
        vm.alertes = JSON.parse(localStorage.getItem('saveAlertes'));
        $scope.alertes = vm.alertes;

        // Utilisateur donné par le controlleur précédent ou réactualisé
        $scope.currentUser = JSON.parse(localStorage.getItem('user'));
        vm.currentUser = $scope.currentUser;

        // Au refresh réauthentifier l'utilisateur pour le bouton déconnexion
        if (vm.currentUser != null) {
            $rootScope.authenticated = true;
        }
        $scope.goBack = function () {
            $ionicHistory.goBack();
          };
        $scope.autocompleteVille = function(userInputString, timeoutPromise) {
          return $http.get(vm.domaine+'/api/authenticate/autocomplete/ville?term='+userInputString);
        };
        // Retourne une ville selon la géolocation
        vm.geoloc = function(){
            // onSuccess Callback current GPS coordinates
            var onSuccess = function(position) {
                console.log(vm.zoneKm);

                $http.get(vm.domaine+'/api/authenticate/coord/'+ position.coords.latitude +'/'+  position.coords.longitude  +'/'+ vm.zoneKm)
                .success(function(result) {

                    $scope.loading=false;

                    // Vider les alertes et mettre à jour le scope utilisateur
                    if (result.villes.length != 0 || vm.zoneKm > 20 ){

                        vm.villeGeoloc = result;
                        $scope.villeGeoloc = vm.villeGeoloc;
                        // Sauvegarder la ville géolocalisée
                        var strGeoloc = JSON.stringify(vm.villeGeoloc);
                        localStorage.setItem('villeGeoloc', strGeoloc);

                        // Si plusieurs résultat afficher popup
                        if( result.villes.length > 1 ) {

                            // au click accéder à la page de résultat
                            vm.modal.show();

                        // Sinon acceder à la page des résultat de la ville
                        } else {
                            vm.villeDepart = result.villes[0]['nomVille'];
                            vm.getAlertes();
                        }
                        
                    } else {
                        vm.zoneKm +=3;
                        vm.geoloc();
                    }
                })
                .error(function(data, status, header, config) {
                    $scope.loading = false;
                    $scope.showAlertCoord(data);
                });
            };
            // onError Callback receives a PositionError object
            function onError(error) {
                $scope.loading = false;
                $scope.showAlertCoord(error);
            }
            $scope.loading=true;
            navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 10000 });
        };
        vm.choixModal = function(ville){
            vm.modal.hide();
            vm.villeDepart = ville;
            vm.getAlertes();
        };
        // Retourne une ville
        $scope.showAlertCoord = function(error) {
            var msg = error.error?error.error:'Votre position n\'a pu être définie.\n';
            msg += error.message?error.message:'';
            var alertPopup = $ionicPopup.alert({
                title: 'Géolocalisation',
                template: msg
            });
        };

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
        };
        vm.suppAlerte = function(){

            var data = JSON.stringify({
                idAlerte: $scope.currentUser.alertes[0].id
            });

            $scope.loading=true;

            $http.post(vm.domaine+'/api/authenticate/alertes/delete', data)
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
        };
        vm.setAlertes = function(){

            var data = JSON.stringify({
                villeDepartAlerte: document.getElementById('autocompleteDepart_value').value,
                villeArriveeAlerte: document.getElementById('autocompleteArrivee_value').value,
                heureAlerte: vm.heureAlerte
            });

            $scope.loading=true;

            $http.post(vm.domaine+'/api/authenticate/alertes', data)
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
        };
        vm.getAlertes = function(){

            var url;
            var result;
            if( vm.villeDepart ) {
                url = vm.domaine+'/api/authenticate/alertes/' + vm.villeDepart;
                vm.villeDepart = '';
            } else if ( result = document.getElementById('autocomplete_value').value ) {
                url = vm.domaine+'/api/authenticate/alertes/'+ result;
            } else {
                url = vm.domaine+'/api/authenticate/alertes';
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
        };
    });
})();