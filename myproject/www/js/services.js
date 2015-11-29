angular.module('youtube-dl')
.constant("API", "http://localhost:4000")
.factory("Accounts", function($resource,$http, API,Cookie){
  return {
    login : function(user){
      return $http.post(API+"/login", user);
    },
    register : function(user){
      return $http.post(API+"/register", user);
    },
    setLoginCookie : function(accesstoken){
      Cookie.setCookie("accesstoken", accesstoken);
    }, 
    removeLoginCookie : function(){
      Cookie.deleteCookie("accesstoken");
    },
    getLoginCookie : function(){
      return Cookie.getCookie("accesstoken");
    }
  };
})
.factory("Cookie", function(localStorageService){
  var storage = null;
  if(localStorageService.isSupported){
    storage = localStorageService;
  }else if(localStorageService.cookie.isSupported){
    storage = localStorageService.cookie;
  }

  return {
    setCookie : function(key, value){
      storage.set(key, value);
    },
    deleteCookie : function(key){
      storage.remove(key);
    },
    getCookie : function(key){
      return storage.get(key);
    }
  };
})
.factory("HttpInterceptor", function($q, Cookie){
  return {
    response : function(response){
      var accessToken = Cookie.getCookie("accesstoken");
      if(accessToken != ""){
        response.config['headers']['Access-Token'] = accessToken;
      }
      return response;
    }
  };
})
.factory("Channel", function($q, $http, $resource, API){
  return $resource(API+"/");

});
