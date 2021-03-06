config = require("./config")
request = require("request")
express = require("express")
mongodb = require("mongodb")
ObjectID = require("mongodb").ObjectID


bodyParser = require "body-parser"
moment = require("moment")
fs = require("fs")
q = require("q")
youtubedl = require "ytdl-core"
mqtt = require "mqtt"


Search = require("./routes/search")
SavedChannels = require "./routes/savedchannels"
User = require "./routes/user"
Video = require "./routes/video"

class App
    Models : {}
    constructor : (@App)->
        @router = new express()
        @router.use bodyParser.urlencoded({extended : true})
        @router.use bodyParser.json {limit : '50mb'}

        @config = config
        @request = request
        @moment = moment
        @ObjectID = ObjectID
        @q = q
        @mqttClient = mqtt.connect @config['mqtt']
        @mqttClient.on "connect" , ()=>
            @mqttClient = @mqttClient
            console.log "connect"

        @youtubedl = youtubedl
        #@youtubedl('http://www.youtube.com/watch?v=A02s8omM_hI')
        #    .pipe(fs.createWriteStream('video.flv'));
        @router.use express.static "video"
        @router.use (req, res, next)=>
            res.setHeader "Access-Control-Allow-Origin", "*"
            res.setHeader "Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, OPTIONS, DELETE"
            res.setHeader "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Token"
            res.setHeader "Access-Control-Allow-Credentials", true
            next()
        @router.use (req, res, next)=>
            if req.headers['access-token'] and req.headers['access-token'] isnt "null"
              @getCurrentUser(req.headers['access-token']).then (user)=>
                  req.user = user
                  next()
            else
                next()
        cors = require "cors"

        @router.use cors()
        mongodb.connect config.mongodb , (err,db)=>
            if !err

                @router.listen config.port , ()=>
                    console.log "Server listening on #{config.port}"

                @Models.Users = db.collection "users"
                @Models.Channels = db.collection "channels"
                @Models.Videos = db.collection "videos"

                search = new Search(@)
                savedChannels = new SavedChannels(@)
                user = new User(@)
                video = new Video(@)
    sendContent : (req, res,content)=>
        res.status 200
        return res.json content
    sendError: (req, res, error, content)=>
        res.status error
        return res.end content
    getCurrentUser : (_accesstoken)=>
        defer = q.defer();
        @Models.Users.findOne {accesstoken : _accesstoken},{password : 0, salt : 0}, (err, doc)=>
            if !err and doc
                defer.resolve doc
            else
                defer.reject {}
        return defer.promise
new App()
module.exports = App
