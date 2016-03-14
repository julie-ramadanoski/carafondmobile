// public/scripts/userController.js

(function() {

    'use strict';

    angular
        .module('carafond')
        .controller('UserController', UserController);  


    function UserController($http, $auth, $rootScope, $scope) {

        var vm = this;
        vm.ville;
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

        vm.getAlertes= function(){
            
            //Grab the list of alertes from the API
            console.log($auth.isAuthenticated());   
          /*  $http({
                method: 'GET', 
                url: 'http://localhost:8000/api/authenticate/alertes?access_token='+localStorage.satellizer_token, 
                headers: {'Authorization': 'Bearer '+localStorage.satellizer_token}
            })*/
            $http.get('http://localhost:8000/api/authenticate/alertes')   
            .success(function(alertes) {
                console.log(alertes);
                $rootScope.alertes = alertes;
            })
            
            .error(function(error) {
                $rootScope.error = error;
            });
        }        
    }
})();