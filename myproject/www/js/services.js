angular.module('youtube-dl')
//.constant("API", "http://192.168.1.3:4000")
.constant("API", "http://128.199.100.77:4000")
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
    },
    setUserInfo : function(user){
      Cookie.setCookie("user", user);
    },
    getUserInfo : function(){
      return Cookie.getCookie("user");
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
    request : function(request){
      var accessToken = Cookie.getCookie("accesstoken");
      if(accessToken != ""){
        request['headers']['Access-Token'] = accessToken;
      }
      return request;
    }
  };
})
.factory("Channel", function($q, $http, $resource, API, HttpInterceptor){
  return $resource(API+"/channel/:channelID", {
    channelID : "@channelID"
  }, {
    /*"query" :{
      method : "GET",
      isArray : true,
      params : {},
      interceptor : {
        request : function(response){
          HttpInterceptor.response(response);
        }
      }
    }*/
  });
})
.factory("Search", function(API, $http){
  return {
    search : function(text){
      return $http({method : "GET", url : API+"/search?query="+text });
    },
    getVideoFromChannel : function(channelID){
      return $http({method : "GET", url : API+"/videoschannel?channelId="+channelID });
    }
  }
})
.factory("Video", function(API, $resource){
  return $resource(API+"/video/:videoId", {
    videoId: "@videoID"
  }/*,{
    "downloadVideo" :{
      method: "GET",
      isArray : false,
      url : API+"/video/download/:videoId",
      params : {
        videoId : "@videoId"
      }
    }
  }*/);
})
.factory("VideoProgress", function(API, $q, $http){
  var client = null;
  var subscribedTopic = "";
  return {
    downloadVideo : function(videoID){
      return $http({method : "GET", url : API+"/video/download/"+videoID});
    },
    connect : function(host, port, clientId, onMessageArrived){
      var defer = $q.defer();
      client = new Messaging.Client(host, port, clientId);
      client.onMessageArrived = onMessageArrived;
      var options = {
       //connection attempt timeout in seconds
       timeout: 3,

        //Gets Called if the connection has successfully been established
       onSuccess: function () {
            defer.resolve();
           /*client.subscribe('dlprocess/1', {qos : 2});
            $timeout(function(){
              var message = new Messaging.Message("Hellooo");
            message.destinationName = "dlprocess/1";
            message.qos = 2;
            client.send(message);
            console.log("send data");
            },10* 1000);*/
       },

        //Gets Called if the connection could not be established
        onFailure: function (message) {
          defer.reject(message);
        }
      };
      client.connect(options);
      return defer.promise;
    },
    subscribe : function(topic){
      client.subscribe(topic, {qos : 2});
      subscribedTopic = topic;
    },
    publish : function(topic, data){
      var message = new Messaging.Message(data);
      message.destinationName = topic;
      message.qos = 2;
      client.send(message);
    }
  };
});
