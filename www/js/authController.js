// public/scripts/authController.js

(function() {

    'use strict';

    angular
        .module('carafond')
        .controller('AuthController', function AuthController($auth, $state, $http, $rootScope, $scope, $ionicPopup, $ionicPopover) {

            var vm = this;

            $ionicPopover.fromTemplateUrl('menu.html', {
              scope: $scope
            })
            .then(function(popover) {
              $scope.popover = popover;
            });
            $scope.openPopover = function($event) {
              $scope.popover.show($event);
            };
            $scope.closePopover = function() {
              $scope.popover.hide();
            };

            // déclarer pop up alerte (btn OK seulement)
            $scope.showAlertConnexion = function() {
                var alertPopup = $ionicPopup.alert({
                    title: 'Connexion impossible',
                    template: 'Vérifiez votre login et mot de passe'
                });
            };

            vm.login = function() {

                var credentials = {
                    email: vm.email,
                    password: vm.password
                }

                $scope.loading=true;

                $auth.login(credentials)
                .then( 
                    // Return an $http request for the now authenticated
                    // user so that we can flatten the promise chain
                    function() {                        
                        return $http.get('http://univoiturage.florian-guillot.fr/api/authenticate/user');
                    }, 
                    // Handle errors
                    function(error) { 
                        $scope.loading=false;                       
                        $scope.showAlertConnexion();                        
                    }
                )
                // Because we returned the $http.get request in the $auth.login
                // promise, we can chain the next promise to the end here
                .then(function(response) {

                    $scope.loading=false;
                   
                    if(response){   

                        var user = JSON.stringify(response.data.user);

                        // Set the stringified user data into local storage
                        localStorage.setItem('user', user);
                        $rootScope.authenticated = true;
                        $rootScope.currentUser = response.data.user;

                        $state.go('home.place');

                    }else{
                      console.log("Pas de réponse serveur");
                    }
                });
                
            }

            // We would normally put the logout method in the same
            // spot as the login method, ideally extracted out into
            // a service. For this simpler example we'll leave it here
            vm.logout = function() {

                $auth.logout().then(function() {

                    // Remove the authenticated user from local storage
                    localStorage.removeItem('user');
                    localStorage.removeItem('villeGeoloc');
                    localStorage.removeItem('saveAlertes');

                    // Flip authenticated to false so that we no longer
                    // show UI elements dependant on the user being logged in
                    $rootScope.authenticated = false;

                    // Remove the current user info from rootscope
                    $rootScope.currentUser = null;

                    $state.go('auth');
                });
            }
        });
})();