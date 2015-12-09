angular.module('youtube-dl')

.controller("ChannelsController", function($scope, Channel, channels){
  $scope.channels = channels;

  $scope.$on( "$ionicView.enter", function( scopes, states ) {
      if( states.fromCache && states.stateName == "tab.channels" ) {
        Channel.query(function(channels){
          $scope.channels = channels;
        });
      }
  });
})
