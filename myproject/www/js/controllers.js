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
.controller("LoginController" , function($scope,Accounts,Accounts){
  $scope.login = function(){
    Accounts.login($scope.user).then(function(response){
      var body = response.data;
      Accounts.setLoginCookie(body);
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
});
