config = require("./config")
request = require("request")
express = require("express")
mongodb = require("mongodb")
bodyParser = require "body-parser"
moment = require("moment")
fs = require("fs")
q = require("q")

Search = require("./routes/search")

class App
    Models : {}
    constructor : (@App)->
        @router = new express()
        @router.use bodyParser.urlencoded({extended : true})
        @router.use bodyParser.json {limit : '50mb'}

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
    sendContent : (req, res,content)=>
        res.status 200
        return res.json content
    sendError: (req, res, error, content)=>
        res.status error
        return res.end content
new App()
module.exports = App