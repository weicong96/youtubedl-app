config = require("./config")
request = require("request")
express = require("express")
mongodb = require("mongodb")
moment = require("moment")
fs = require("fs")
q = require("q")

Search = require("./routes/search")

class App
    Models : {}
    constructor : (@App)->
        @router = new express()
        @router.use express.json()
        @router.use express.urlencoded()

        @config = config
        @request = request
        @moment = moment

        @router.use (req, res, next)=>
            res.setHeader "Access-Control-Allow-Origin", "*"
            res.setHeader "Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, OPTIONS, DELETE"
            res.setHeader "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"
            res.setHeader "Access-Control-Allow-Credentials", true
            next()
        @router.listen config.port , ()=>
            console.log "Server listening on #{config.port}"
        mongodb.connect config.mongodb , (err,db)=>
            if !err
                @Models.Users = db.collection "users"

                search = new Search(@)
new App()
module.exports = App