class SavedChannels
	constructor : (@App)->
		@App.router.get "/savechannel", @getChannelsForUser
	getChannelsForUser : (req, res)=>
		return @App.sendContent req, res, ""
module.exports = SavedChannels