class SavedChannels
	constructor : (@App)->
		@App.router.get "/channel", @getChannelsForUser
		@App.router.post "/channel", @postChannel
	postChannel : (req, res)=>
		#@App.Models.Users.insert {}
	getChannelsForUser : (req, res)=>
		#@App.Models.
module.exports = SavedChannels