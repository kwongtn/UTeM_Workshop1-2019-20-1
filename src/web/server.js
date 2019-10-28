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

    .use("/listUsers", function (req, res) {
        // console.log(userList);
        // var userList = eventEmitter.emit("dbConnect", "USER");
        // console.log(userList);

        // mysqlx.getSession(config)
        //     .then(session => {
        //         return session.getSchema("CLUB-MAN").getTable("USER");
        //     })
        reqTable("USER").then(table => {
                return table.select(["userID", "engName", "chineseName", "email", "phoneNo", "facebookID", "icNo", "matricNo", "hostel", "faculty"])
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
                list: x
            });
            console.log("Page loaded");

        })

    })


    .listen(8080)
    ;

