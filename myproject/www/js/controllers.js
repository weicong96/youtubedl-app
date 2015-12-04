angular.module('youtube-dl')

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
.controller("LoginController" , function($scope,Accounts,Accounts, $state){
  $scope.login = function(){
    Accounts.login($scope.user).then(function(response){
      var body = response.data;
      Accounts.setLoginCookie(body.accesstoken);
      $state.go("tab.search");
    });
  }
})
.controller("RegisterController" , function($scope,$ionicPopup,$q,  Accounts){

  $scope.showAlert = function(title, message){
    var defer = $q.defer();
    var showAlert = $ionicPopup.alert({
      title : title,
      template : message
    });
    showAlert.then(function(res){
      defer.resolve(res);
    });
    return defer.promise;
  }
  $scope.register = function(){
    Accounts.register($scope.user).then(function(response){
      console.log(response);
    }, function(response){
       var title = "", message = "";

      if(response.data=="ALREADY_REGISTERED"){
        title = "Registered Account";
        message = "Email has been registered. Did you forget your password?";
      }else if(response.data == "NO_NAME_GIVEN"){
        title = "Empty Name";
        message = "Name is empty!";
      }else if(response.data == "NO_EMAIL_GIVEN"){
        title = "Empty Email";
        message = "Email is empty!";
      }else if(response.data == "NO_PASSWORD_GIVEN"){
        title = "Empty password";
        message = "Password is empty!";
      }
      $scope.showAlert(title, message);
    });
  }
})
.controller("ChannelsController", function($scope, Channel){
  Channel.query(function(res){
    $scope.results = res;
  });
}).controller("SearchController", function($scope, $ionicPopup,$state,$stateParams, Search, Channel){
  $scope.data = {};
        $scope.searchResult = [];
  $scope.search = function(){
    var myPopup = $ionicPopup.show({
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
      console.log($scope.data.searchText);

      //Search execute here
      Search.search($scope.data.searchText).then(function(results){
        $scope.searchResult = [];
        results['data'].forEach(function(result){
          var video = {
            image : result['snippet']['thumbnails']['default']['url'],
            type : ((result['id']['kind'] == "youtube#video") ? "video" : "channel"),
            title : result['snippet']['title']
          };
          video['id'] = result['id'][video['type']+"Id"];

          console.log(result);
          $scope.searchResult.push(video);
          console.log($scope.searchResult);
        });
        console.log(results);
      });
      myPopup.close();
    });}
  $scope.nextPage = function(result){
    console.log(result);
    if(result['type'] == "channel"){
      $scope.selections = [
        "Browse videos from channel",
        "Add Channel as daily download channel"
      ];
      var myPopup = $ionicPopup.show({
        template: '<ion-list><ion-item ng-repeat="(index,selection) in selections" on-tap="selectOptions(index)">{{ selection }}</ion-item></ion-list>',
        title: 'Enter Wi-Fi Password',
        scope: $scope,
        buttons: [
          {},
          {}
        ]
      });
      $scope.selectOptions = function(index){
        $scope.selectItemIndex = index;
        if($scope.selectItemIndex == 0){
          $state.go("tab.searchWithChannelId", {channelId : result['id']});
          myPopup.close();
        }else if($scope.selectItemIndex == 1){
          var channel = {
            channelId : result['id'],
            channel : result
          };
          Channel.save(channel,function(res){
            console.log(res);
          });
        }
      }

    }else{
      //show popup to download vide
       var alertPopup = $ionicPopup.alert({
         title : "Download video started",
         template : "Started downloading video"
       });
       alertPopup.then(function(res) {

       });

    }
  }

  if($stateParams.channelId){
    $scope.channelId = $stateParams.channelId;
    Search.getVideoFromChannel($scope.channelId).then(function(results){
      console.log(results);
      results['data'].forEach(function(result){
        $scope.searchResult.push(result);
      });
    });
  }
})
.controller("VideoController", function($scope){

});
