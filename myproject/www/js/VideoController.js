angular.module('youtube-dl')
.controller("VideoController", function($scope,Video, videos, $timeout,VideoProgress, Accounts){
  $scope.videos = videos;
  var client_id = Accounts.getLoginCookie().substring(0, 23);

  $scope.messageArrived = function(message){
    console.log("messageArrived"+message);
  }
  $timeout(function(){
    VideoProgress.publish("dlprocess/"+client_id, "hello");
  }, 1000);
  VideoProgress.connect("128.199.100.77", 8080, client_id, $scope.messageArrived).then(function(){
    VideoProgress.subscribe("dlprocess/"+client_id);
    
  });
  
  $scope.$on( "$ionicView.enter", function( scopes, states ) {
      if( states.fromCache && states.stateName == "tab.videos" ) {
        Video.query(function(videos){
          $scope.videos = videos;
          console.log(videos);
        });
      }
  });
});
