var express = require("express");
var session = require("cookie-session");
var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({extended: false});

// Database connection 
const mysqlx = require('@mysql/xdevapi');


// 8081 uses x-Protocol, while 8082 uses the old authentication method
const config = {
    password: 'password',
    user: 'root',
    host: 'localhost',
    port: 8081
};

mysqlx.getSession(config)
.then(session => {
    console.log(session.inspect());
})
.catch(console.error());

// Application 
var app = express();

var appName = "club-man";

app.use(session({secure: true, secret: "someKey"}))

.use("/login", function(req, res){

.use("/", function(req, res){
    var now = new Date();
    res.render("login.ejs", {
        appName: appName,
        time: now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "." + now.getMilliseconds()
    });
})

.post("/login",  urlEncodedParser, function(req, res){
    var login = req.body.username;
    var pass = req.body.pass;
    
})

.get("/home", function(req, res){
    res.render("home.ejs",{
        appName: appName
    });
})

.listen(8080)
;
