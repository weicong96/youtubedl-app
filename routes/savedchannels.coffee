class SavedChannels
	constructor : (@App)->
		@App.router.get "/channel", @getChannelsForUser
		@App.router.post "/channel", @postChannel
	postChannel : (req, res)=>
		channel =
			channelId : req.body.channelId
			user : req.user

		@App.Models.Channels.insert channel, (err,doc)=>
			if !err and doc
				return @App.sendContent req, res, doc
	getChannelsForUser : (req, res)=>
		user = req.user
		@App.Models.Channels.find({"user._id" : user['_id']}).toArray (err, doc)=>
			if !err and doc
				return @App.sendContent req, res, doc
module.exports = SavedChannels
