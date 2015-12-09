angular.module('youtube-dl')
.controller("LoginController" , function($scope,Accounts,Accounts, $state){
  $scope.login = function(){
    console.log($scope.user);
    Accounts.login($scope.user).then(function(response){
      var body = response.data;
      Accounts.setLoginCookie(body.accesstoken);
      $state.go("tab.search");
    },function(err){
      console.log(err);
    });
  }
})
