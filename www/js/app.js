// Ionic Starter App
// Tutoriel d'authentification avec laravel comme API
// https://scotch.io/tutorials/token-based-authentication-for-angularjs-and-laravel-apps

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('carafond', ['ionic', 'satellizer'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider, $authProvider){

  // Satellizer configuration that specifies which API
  // route the JWT should be retrieved from
  $authProvider.loginUrl = 'http://localhost:8000/api/authenticate';

  // Définition de la homePage
  $stateProvider.state('home',{
    url:'/home',
    templateUrl:'templates/home.html',
    controller: 'AuthController as auth'
  })
  .state('users', {
      url: '/users',
      templateUrl: 'templates/user.html',
      controller: 'UserController as user'
  })
  .state('users.detail', {
      url: '/:user', //Parametre de l'enfant de users
      templateUrl: 'templates/users.detail.html',
      controller: function($scope) {
        $scope.items = ["A", "List", "Of", "Items"];
      }
  });

  // Définition route par défault
  $urlRouterProvider.otherwise('/home');
})
