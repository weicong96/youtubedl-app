// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('youtube-dl', ['ionic',"ngResource", "LocalStorageModule"])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

})

.config(function($stateProvider, $urlRouterProvider, $httpProvider,localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix("youtubeDl");
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $httpProvider.interceptors.push("HttpInterceptor");
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('login', {
    url : '/login',
    templateUrl : 'templates/login.html',
    controller : "LoginController"
  })
  .state('register', {
    url : '/register',
    templateUrl : 'templates/register.html',
    controller : "RegisterController"
  })
  .state('tab.channels', {
    url: '/channels',
    views: {
      'tab-channels': {
        templateUrl: 'templates/tab-channels.html',
        controller: 'ChannelsController'
      }
    },
    resolve : {
      channels : function(Channel){
        return Channel.query();
      }
    }
  })
  .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchController'
      }
    }
  })
  .state('tab.searchWithChannelId', {
    url: '/search?channelId',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchController'
      }
    }
  })
  .state("tab.videos", {
    url : '/videos',
    views : {
      'tab-videos' : {
        templateUrl : 'templates/tab-videos.html',
        controller : 'VideoController'
      }
    },
    resolve : {
      videos : function(Video){
        return Video.query();
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
