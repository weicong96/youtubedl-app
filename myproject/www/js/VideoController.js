angular.module('youtube-dl')
.controller("VideoController", function($scope,Video, videos){
  $scope.videos = videos;
  
  $scope.$on( "$ionicView.enter", function( scopes, states ) {
      if( states.fromCache && states.stateName == "tab.videos" ) {
        Video.query(function(videos){
          $scope.videos = videos;
          console.log(videos);
        });
      }
  });
});
