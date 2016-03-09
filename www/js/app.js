// Ionic Starter App
// Tutoriel d'authentification avec laravel comme API
// https://scotch.io/tutorials/token-based-authentication-for-angularjs-and-laravel-apps
// http://ryanchenkie.com/token-based-authentication-for-angularjs-and-laravel-apps/

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

    $authProvider.loginUrl = 'http://localhost:8000/api/authenticate';

    // Définition de la homePage
    $stateProvider.state('auth',{
    url:'/auth',
    templateUrl:'templates/auth.html',
    controller: 'AuthController as auth'
    })
    .state('user', {
      url: '/user',
      templateUrl: 'templates/user.html',
      controller: 'UserController as user'
    })

    .state('home', {
      url: '/home',
      abstract: true,
      templateUrl: 'templates/home.html'
    })
    .state('home.conducteur', {
      url: '/conducteur',
      views: {
        'conducteur': {
          templateUrl: "templates/conducteur.html" /*,
          controller: 'ConducteurController as conducteur'*/
        }
      }
    })
    .state('home.passager', {
      url: '/passager',
      views: {
        'passager': {
          templateUrl: "templates/passager.html"
           /*, controller: 'PassagerController as passager'*/
        }
      }
    });

  // Définition route par défault
  $urlRouterProvider.otherwise('/auth');
})
