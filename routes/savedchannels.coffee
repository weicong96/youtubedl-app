class SavedChannels
	constructor : (@App)->
		@App.router.get "/savechannel", @getChannelsForUser
	getChannelsForUser : (req, res)=>
        @App.getCurrentUser(req.query.accesstoken).then (doc)=>
            
module.exports = SavedChannels