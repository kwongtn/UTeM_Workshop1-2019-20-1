"use strict";
var express = require("express");
var session = require("cookie-session");
var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({ extended: false });

// Event emmiter
var events = require("events");
var eventEmitter = new events.EventEmitter();

// Database connection 
const mysqlx = require('@mysql/xdevapi');

async function reqTable(tableName){
    const session = await mysqlx.getSession(config);
    const table = session.getSchema("CLUB-MAN").getTable(tableName);
    return table;
};


// 8081 uses x-Protocol, while 8082 uses the old authentication method
const config = {
    password: 'password',
    user: 'root',
    host: 'localhost',
    port: 8081
};

// Application 
var app = express();

var appName = "club-man";

app.use(session({ secure: true, secret: "someKey" }))

    .get("/", function (req, res) {
        var now = new Date();
        res.render("login.ejs", {
            appName: appName,
            time: now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "." + now.getMilliseconds()
        });
    })

    .post("/login/", urlEncodedParser, function (req, res) {
        var login = req.body.username;
        var pass = req.body.pass;

        console.log("Login: " + req.body.username);
        console.log("Password: " + req.body.pass);

        res.redirect("/home");
    })

    .use("/home", function (req, res) {
        res.render("home.ejs", {
            appName: appName
        });
    })
    //To add entry for search functionality
    .get("/listUsers", function (req, res) {
        eventEmitter.emit("listUsers");
        var attribList = [
            { "name": "engName", "label": "English Name" },
            { "name": "chineseName", "label": "Chinese Name" },
            { "name": "email", "label": "e-mail" },
            { "name": "phoneNo", "label": "Phone Number" },
            { "name": "facebookID", "label": "Facebook ID" },
            { "name": "icNo", "label": "IC Number" },
            { "name": "matricNo", "label": "Matric No" },
            { "name": "hostel", "label": "Hostel" },
            { "name": "faculty", "label": "Faculty" }
        ];

        var passedAttrib = ["userID", "engName", "chineseName", "email", "phoneNo", "facebookID", "icNo", "matricNo", "hostel", "faculty"];

        reqTable("USER").then(table => {
                return table.select(passedAttrib)
                .where("faculty like :fac")
                .bind('fac', 'FTMK')
                .execute();
            })
            .then(output => {
                return output.fetchAll(); 
            })
            .then(x => {
                eventEmitter.emit("listUsers", x)
            })
            
            ;

        
        eventEmitter.on("listUsers", x => {
            res.render("listUsers.ejs", {
                list: x,
                attribList: attribList
            });
            console.log("Page loaded");

        })

    })

    .post("/listUsers", urlEncodedParser, function (req, res){
        console.log(req.body.engName);
        console.log(req.body.chineseName);

        res.redirect("/home");
    })

    .listen(8080)
    ;

