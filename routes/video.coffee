fs = require "fs"
class Video
	constructor : (@App)->
		@App.router.post "/video", @downloadVideo
		@App.router.get "/video" , @getVideoForUser
		@App.router.get "/video/download/:videoId", @downloadFile
		@App.router.get "/video/delete", (req, res)=>
			@App.Models.Videos.remove {} ,(err,doc)=>
				if !err and doc
					return @App.sendContent req, res, doc
	downloadFile : (req, res)=>
		path = "video/"+req.params.videoId
		stat = fs.statSync(path)
		res.writeHead 200, {
			'Content-Type' : 'video/mpeg',
			'Content-Length' : stat.size
		}

		stream = fs.createReadStream path
		stream.pipe res
		stream.on "end", ()=>
			@App.Models.Videos.update {id : req.body['id']}, {$set : { downloaded : true , progress : 100}}, (err, doc)=>
				if !err and doc
					console.log "Finished response"
				else
					console.log err
	getVideoForUser : (req, res)=>
		@App.Models.Videos.find({"user._id" : req.user['_id']}).toArray (err,doc)=>
			if !err and doc
				return @App.sendContent req, res, doc
	downloadVideo : (req, res)=>
		if !req.body['id']
			return @App.sendError req, res, 400, "No video id!"
		if !req.body['image']
			return @App.sendError req, res, 400, "No video image!"
		if !req.body['title']
			return @App.sendError req, res, 400, "No title!"
		#if !req.body['id']
		#	return @App.sendError req, res, 400, "No type!"

		@App.Models.Videos.findOne {id : req.body['id']} , (err,doc)=>
			if !err
				#if !doc
				video =
					id : req.body['id']
					image : req.body['image']
					title : req.body['title']
					user : req.user
					status : "Processing"
				@App.Models.Videos.insert video, (err,doc)=>
					if !err and doc
						@App.mqttClient.publish "download/"+req.user['email'] , "recieved_#{req.body['id']}" , {qos : 2}, (err, doc, ch)=>
							console.log doc
						return @App.sendContent req, res, video
					else
						return @App.sendError req, res, 400, err

				#Download, return response immediately
				hereCount = 0
				stream = @App.youtubedl("http://www.youtube.com/watch?v=#{req.body["id"]}", {filter : (format)=>
					return format.container is 'mp4'
				})

				stream
				.pipe(fs.createWriteStream("video/"+req.body['id']+".mp4"))
				.on "error", (err)=>
					console.log err
				.on "finish", ()=>
					@App.Models.Videos.update {id : req.body['id']}, {$set : {status : "Ready to download"}},(err, doc)=>
						if !err
							@App.mqttClient.publish "download/"+req.user['email'] , "finish_#{req.body['id']}" , {qos : 2}, (err,doc)=>
			        			console.log doc
						else
							return @App.sendError req, res, 400, err

				#else
				#	return @App.sendContent req, res, {"error" :"ALREADY_SAVED"}
			else
				return @App.sendError req, res, 400, err
module.exports = Video
