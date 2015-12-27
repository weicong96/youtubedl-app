angular.module('youtube-dl')
.directive('videoItem', function(){
	return {
		templateUrl : "templates/directive-video-item.html",
		controller : function($scope, $timeout, VideoProgress){
			

			$scope.downloadVideo = function(){
			    VideoProgress.downloadVideo($scope.video['id'],function(progress){
			    	$scope.video.progress = (progress.loaded/progress.total) * 100;
			    }).then(function(data){
			      $scope.video.status = "File Downloaded";
			      $scope.video.progress = 100;
			    });
			 }
		},
		link : function($scope,element, attrs){
			element.on("click",function(){
				$scope.video.progress=12;
				
				$scope.downloadVideo();
				$scope.$apply();
			});
		},
		scope : {
			video : "="
		},
		replace : true
	};
});