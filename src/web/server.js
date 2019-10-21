var express = require("express");
var session = require("cookie-session");
var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({extended: false});
var mysql = require("mysql2");

var app = express();

var appName = "club-man";

// Declaring application 
app.use(session({secure: true, secret: "someKey"}))

.use("/login", function(req, res){
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
;

// Declaring all mySQL connections
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password"
})