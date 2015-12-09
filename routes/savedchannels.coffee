class SavedChannels
	constructor : (@App)->
		@App.router.get "/channel", @getChannelsForUser
		@App.router.post "/channel", @postChannel
		@App.router.get "/channel/delete", (req, res)=>
			@App.Models.Channels.remove {} , (err,doc)=>
				if !err and doc
					return @App.sendContent req, res, doc
	postChannel : (req, res)=>
		channel = req.body.channel
		channel['user'] = req.user

		@App.Models.Channels.findOne {"user._id" : req.user['_id'], "id" : channel['id']}, (err, doc)=>
			if !err
				if !doc or doc.length is 0
					console.log doc
					@App.Models.Channels.insert channel, (err,doc)=>
						if !err and doc
							return @App.sendContent req, res, doc
				else
					return @App.sendContent req, res, {"error" : "ALREADY_HAVE_CHANNEL"}
	getChannelsForUser : (req, res)=>
		user = req.user
		@App.Models.Channels.find({"user._id" : user['_id']}).toArray (err, doc)=>
			if !err and doc
				return @App.sendContent req, res, doc
module.exports = SavedChannels
