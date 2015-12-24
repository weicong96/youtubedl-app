angular.module('youtube-dl')
.controller("VideoController", function($scope,$timeout,$state, $rootScope, $cordovaFile,$ionicPopup,$ionicPlatform, Video, videos, VideoProgress, Accounts){
  $scope.videos = videos;
  //$ionicPlatform.ready(function(){
    //console.log("Device ready!");
    //$cordovaFile.getFreeDiskSpace().then(function(size){
    //  $scope.message = size;
   // });
  //});
  var email = Accounts.getUserInfo()['email'];
  $scope.downloadVideo = function(_video){
    VideoProgress.downloadVideo(_video['id']).then(function(data){
      console.log(data);
    });
  }
  VideoProgress.connect("128.199.100.77", 8080, email, function(message){
    var payloadParts = message['payloadString'].split('_');
    var status = payloadParts[0];
    var id = payloadParts[1];

    console.log(status, " ", id);
    $scope.videos.forEach(function(video , index){
      if(video['id'] === id){
        if(status === "recieved"){
          $scope.videos[index].status = "Processing";
        }else if(status === "finish"){
          $scope.videos[index].status = "Ready to download";
        }

      }
    });

    $scope.$apply();
    VideoProgress.subscribe("download/"+email);//reconnect
  }).then(function(){
    VideoProgress.subscribe("download/"+email);
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
