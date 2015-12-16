fs = require "fs"
class Video
	constructor : (@App)->
		@App.router.post "/video", @downloadVideo
		@App.router.get "/video" , @getVideoForUser
		@App.router.del "/video", (req, res)=>
			@App.Models.Videos.remove {} ,(err,doc)=>
				if !err and doc
					return @App.sendContent req, res, doc

	getVideoForUser : (req, res)=>
		@App.Models.Videos.find({}).toArray (err,doc)=>
			if !err and doc
				return @App.sendContent req, res, doc
		#return @App.sendContent req, res, req.user
	downloadVideo : (req, res)=>
		if !req.body['id']
			return @App.sendError req, res, 400, "No video id!"
		if !req.body['image']
			return @App.sendError req, res, 400, "No video image!"
		if !req.body['title']
			return @App.sendError req, res, 400, "No title!"
		if !req.body['id']
			return @App.sendError req, res, 400, "No type!"


		@App.Models.Videos.findOne {id : req.body['id']} , (err,doc)=>
			if !err
				#if !doc
				#Download, return response immediately
				hereCount = 0
				stream = @App.youtubedl("http://www.youtube.com/watch?v=#{req.body["id"]}", {filter : (format)=>
					return format.container is 'mp4'
				})
				
				stream
				.pipe(fs.createWriteStream("video/"+req.body['id']+".mp4"))
				.on "drain", ()=>
					hereCount++
				.on "finish", ()=>
					console.log hereCount
				
				@App.Models.Videos.insert req.body, (err,doc)=>
					if !err and doc

						return @App.sendContent req, res, req.body
					else
						return @App.sendError req, res, 400, err
				#else
				#	return @App.sendContent req, res, {"error" :"ALREADY_SAVED"}
			else
				return @App.sendError req, res, 400, err

		
		

module.exports = Video
