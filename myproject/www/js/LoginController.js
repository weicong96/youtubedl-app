angular.module('youtube-dl')
.controller("LoginController" , function($scope,Accounts,Accounts, $state){
  $scope.login = function(){
    Accounts.login($scope.user).then(function(response){
      var body = response.data;
      
      Accounts.setLoginCookie(body.accesstoken);
      Accounts.setUserInfo(body.user);

      console.log(body);
      $state.go("tab.search");
    },function(err){
      $scope.error = err;
    });
  }
})
