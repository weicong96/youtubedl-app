angular.module('youtube-dl')
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
