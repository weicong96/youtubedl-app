class Search
    constructor : (@App)->
    	@App.router.get "/search", @searchItems
    	@App.router.get "/videoschannel", @getVideosFromChannel
    getVideosFromChannel : (req, res)=>
    	pageToken = ""
    	if !req.query.channelId
    		return @App.sendError req, res, 400, "No channel id"
    	if req.query.pageToken
    		pageToken = req.query.pageToken
    	url = "https://www.googleapis.com/youtube/v3/channels?key=#{@App.config['youtube']['key']}&prettyPrint=false&part=contentDetails&id=#{req.query.channelId}"
    	@App.request
    		.get url, (error, response, body)=>
    			if error
    				return @App.sendError req, res, 400, error
    			else
    				body = JSON.parse(body)
    				playListId = body['items'][0]['contentDetails']['relatedPlaylists']['uploads']
    				playListUrl = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=10&key=#{@App.config['youtube']['key']}&prettyPrint=false&part=contentDetails,snippet&playlistId=#{playListId}"
    				
    				if pageToken
    					playListUrl += "&pageToken=#{pageToken}"
    				@App.request.get playListUrl , (err,response,body)=>
    					if !err
    						body = JSON.parse body
    						items = body['items']
    						videosDl = []
    						for video in items
    							extractVideo = 
    								title : video['snippet']['title']
    								image : video['snippet']['thumbnails']['default']['url']
    								id : video['contentDetails']['videoId']
    							
    							videosDl.push extractVideo
    						return @App.sendContent req, res, videosDl
    					else
    						return @App.sendError req, res, 400, err
    			
    searchItems : (req,res)=>
    	url = "https://www.googleapis.com/youtube/v3/search?key=#{@App.config['youtube']['key']}&prettyPrint=false&part=snippet&q=#{req.query.query}"
    	if !req.query.query
    		return @App.sendError req, res, 400, "No query sent!"
    	if req.query.pageToken
    		url += "&pageToken=#{req.query.pageToken}"
    	@App.request
    		.get url , (error, response, body)=>
    					if !error
	    					if response.statusCode is 200
	    						return @App.sendContent req, res, JSON.parse(body)['items']
	    				else
	    					return @App.sendError req, res, 400, error

module.exports = Search