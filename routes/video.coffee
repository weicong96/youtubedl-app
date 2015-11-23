class Video
	constructor : (@App)->
		@App.router.post "/video/download", @downloadVideo 
	downloadVideo : (req, res)=>
		
module.exports = Video