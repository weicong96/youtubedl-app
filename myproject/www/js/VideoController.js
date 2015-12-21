angular.module('youtube-dl')
.controller("VideoController", function($scope,$timeout,$state, $rootScope, $cordovaFile, Video, videos, VideoProgress, Accounts){
  $scope.videos = videos;
  document.addEventListener('deviceready', function(){
    console.log("Device ready!");
    $cordovaFile.getFreeDiskSpace().then(function(size){
      console.log(size);      
    });
  });
  var email = Accounts.getUserInfo()['email'];
  $scope.downloadVideo = function(_video){
    VideoProgress.downloadVideo(_video['id']).then(function(data){
      console.log(data);
    });
  }
<<<<<<< HEAD
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
=======
  $timeout(function(){
    VideoProgress.publish("dlprocess/"+client_id, "hello");
  }, 1000);
  VideoProgress.connect("128.199.100.77", 8080, client_id, $scope.messageArrived).then(function(){
    VideoProgress.subscribe("dlprocess/"+client_id);

>>>>>>> parent of 50eef36... Added download
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
