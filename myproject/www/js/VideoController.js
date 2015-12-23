angular.module('youtube-dl')
.controller("VideoController", function($scope,$timeout,$state, $rootScope, $cordovaFile,$ionicPopup, Video, videos, VideoProgress, Accounts){
  $scope.videos = videos;
  document.addEventListener('deviceready', function(){
    console.log("Device ready!");
    $cordovaFile.getFreeDiskSpace().then(function(size){
      console.log(size);
      var popup = $ionicPopup.show({
        template : "Space on disk: "+size,
        title : "Enter wifi password",
        scope : $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.wifi) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data.wifi;
              }
            }
          }
        ]
      });
      $timeout(function() {
         popup.close(); //close the popup after 3 seconds for some reason
      }, 3000);
    });
  });
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
