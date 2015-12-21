angular.module('youtube-dl')
.controller("SearchController", function($scope, $ionicPopup,$state,$stateParams,$rootScope, Search, Channel,Video){
  $scope.data = {};
  $scope.searchResult = [];
  var myPopup;
  $scope.search = function(){
    myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.searchText">',
      title: 'What are u looking for?',
      subTitle: 'Type what you would on Youtube',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Search</b>',
          type: 'button-positive'
        }
      ]
    });
    myPopup.then(function(res) {
      //Search execute here
      Search.search($scope.data.searchText).then(function(results){
        $scope.searchResult = [];
        results['data'].forEach(function(result){
          var video = {
            image : result['snippet']['thumbnails']['default']['url'],
            type : ((result['id']['kind'] == "youtube#video") ? "video" : "channel"),
            title : result['snippet']['title'],
            saved : result['saved']
          };
          video['id'] = result['id'][video['type']+"Id"];
          $scope.searchResult.push(video);
        });
      });
      myPopup.close();
    });
  }
  $scope.nextPage = function(result){
    console.log(result);
    if(result['type'] == "channel"){
      $scope.selections = [
        "Browse videos from channel",
        "Add Channel as daily download channel"
      ];
      var myPopup = $ionicPopup.show({
        template: '<ion-list><ion-item ng-repeat="(index,selection) in selections" on-tap="selectOptions(index)">{{ selection }}</ion-item></ion-list>',
        scope: $scope,
        title : "What to do with this?",
        buttons: [
        ]
      });
      $scope.selectOptions = function(index){
        $scope.selectItemIndex = index;
        if($scope.selectItemIndex == 0){
          $state.go("tab.searchWithChannelId", {channelId : result['id']});
          myPopup.close();
        }else if($scope.selectItemIndex == 1){
          var channel = {
            channel : result
          };
          if(!result['saved']){
            Channel.save(channel,function(res){
                $state.go("tab.channels",{});
                myPopup.close();
            });
          }else{
            $state.go("tab.channels",{});
            myPopup.close();
          }
        }
      }

    }else{
      //show popup to download vide
      var alertPopup = $ionicPopup.alert({
        title : "Download video started",
        template : "Started downloading video"
      });
      alertPopup.then(function(res) {

        Video.save(result, function(res){
        });
      });

    }
  }

  if($stateParams.channelId){
    $scope.channelId = $stateParams.channelId;
    Search.getVideoFromChannel($scope.channelId).then(function(results){
      results['data'].forEach(function(result){
        $scope.searchResult.push(result);
      });
    });
  }
})
