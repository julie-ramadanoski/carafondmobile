// Ionic Starter App
// Tutoriel d'authentification avec laravel comme API
// https://scotch.io/tutorials/token-based-authentication-for-angularjs-and-laravel-apps
// http://ryanchenkie.com/token-based-authentication-for-angularjs-and-laravel-apps/

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

/*
* Compatibilité anciennes version android sur le JSON.parse
*/
JSON.originalParse = JSON.parse;
JSON.parse = function (text) {
  if (text) {
    return JSON.originalParse(text);
  } else {
    console.log('no longer crashing on null value but just returning null');
    return null;
  }
};

angular.module('carafond', ['ionic', 'satellizer'])

.run(function($ionicPlatform, $rootScope, $state) {
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
  
        // $stateChangeStart is fired whenever the state changes. We can use some parameters
        // such as toState to hook into details about the state as it is changing
        $rootScope.$on('$stateChangeStart', function(event, toState) {

            // Grab the user from local storage and parse it to an object
            var user = JSON.parse(localStorage.getItem('user'));            

            // If there is any user data in local storage then the user is quite
            // likely authenticated. If their token is expired, or if they are
            // otherwise not actually authenticated, they will be redirected to
            // the auth state because of the rejected request anyway
            if(user) {

                // The user's authenticated state gets flipped to
                // true so we can now show parts of the UI that rely
                // on the user being logged in
                $rootScope.authenticated = true;

                // Putting the user's data on $rootScope allows
                // us to access it anywhere across the app. Here
                // we are grabbing what is in local storage
                $rootScope.currentUser = user;

                // If the user is logged in and we hit the auth route we don't need
                // to stay there and can send the user to the main state
                if(toState.name === "auth") {

                      // Preventing the default behavior allows us to use $state.go
                      // to change states
                      event.preventDefault();

                      // go to the "main" state which in our case is users
                      $state.go('home.conducteur');
                }
            }
        });
    });
})
.config(function($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $httpProvider, $provide, $ionicConfigProvider){

  $ionicConfigProvider.tabs.position('bottom'); // other values: top
  // Définition route par défault
  $urlRouterProvider.otherwise('/auth');

  $authProvider.loginUrl = 'http://univoiturage.florian-guillot.fr/api/authenticate';
  //$authProvider.withCredentials = true;
  // Setup for the $httpInterceptor
  $provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);

  // Push the new factory onto the $http interceptor array
  $httpProvider.interceptors.push('redirectWhenLoggedOut');

    // Définition de la homePage
    $stateProvider.state('auth',{
      url:'/auth',
      templateUrl:'templates/auth.html',
      controller: 'AuthController as auth'
    })
    
    .state('home', {
      url: '/home',
      abstract: true,
      templateUrl: 'templates/home.html',
      controller: 'UserController as user'
    })
    .state('home.conducteur', {
      url: '/conducteur',
      views: {
        'conducteur': {
          templateUrl: "templates/conducteur.html"
        }
      }
    })
    .state('home.alertes', {
      url: '/alertes',
      views: {
        // est relié à la vue conducteur
        'conducteur': { 
          templateUrl: "templates/alertes.html"
        }
      }
    })
    .state('home.passager', {
      url: '/passager',
      views: {
        'passager': {
          templateUrl: "templates/passager.html"
        }
      }
      
    });

  function redirectWhenLoggedOut($q, $injector) {

    return {

      responseError: function(rejection) {

          // Need to use $injector.get to bring in $state or else we get
          // a circular dependency error
          var $state = $injector.get('$state');

          // Instead of checking for a status code of 400 which might be used
          // for other reasons in Laravel, we check for the specific rejection
          // reasons to tell us if we need to redirect to the login state
          var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

          // Loop through each rejection reason and redirect to the login
          // state if one is encountered
          
          angular.forEach(rejectionReasons, function(value, key) {
            if(rejection.data != null){

              if(rejection.data.error === value) {

                  // If we get a rejection corresponding to one of the reasons
                  // in our array, we know we need to authenticate the user so 
                  // we can remove the current user from local storage
                  localStorage.removeItem('user');

                  // Send the user to the auth state so they can login
                  $state.go('auth');
              }
            }
          });

          return $q.reject(rejection);
      }
    }
  };
});