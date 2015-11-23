password = require "password-hash-and-salt"
randomstr = require "randomstring"
class User
	constructor : (@App)->
		@App.router.post "/register", @register
		@App.router.post "/login", @login
		@App.router.get "/accesstoken/verify", @verifyAccessToken
		
	verifyAccessToken : (req, res)=>
		@App.Models.Users.find({accesstoken : req.query.accesstoken}).toArray (err,doc)=>
			if !err
				if doc 
					return @App.sendContent req, res, {status : "VALID"}
				else
					return @App.sendContent req, res, {status : "INVALID"}
			else
				return @App.sendError req, res, err
	login : (req, res)=>
		if !req.body.email
			return @App.sendError req, res, "No email given"
		if !req.body.password
			return @App.sendError req, res, "No password given"

		@App.Models.Users.find {email : req.body.email}, (err,user)=>
			if !err
				if !user
					return @App.sendContent req, res , {status : "UNAUTHORIZED"}
				password(req.body.password).verifyAgainst "pbkdf2$10000$"+user['password']+"$"+user['salt'], (err,verified)=>
					if !err
						if verified
							access_token = randomstr.generate()
							@App.Models.Users.update {_id : user['_id']}, {$push : {accesstoken : access_token}}, (err,doc)=>
								if !err and doc
									return @App.sendContent req, res, {status : "VERIFIED", accesstoken : accesstoken}
		 				else
							return @App.sendContent req, res , {status : "UNAUTHORIZED"}
					else
						return @App.sendError req, res, err
			else
				return @App.sendError req, res, err
	register : (req, res)=>
		if !req.body.email
			return @App.sendError req, res, "No email given"
		if !req.body.password
			return @App.sendError req, res, "No password given"
		user= 
			email : req.body.email
		password(req.body.password).hash (error, hash)=>
			if error
				console.log error
			else
				user['password'] = hash.split("$")[2]
				user['salt'] = hash.split("$")[3]

				@App.Models.Users.insert user, (err, doc)=>
					if !err
						return @App.sendContent req, res, "Registered"
					else
						return @App.sendError req, res, err
module.exports = User