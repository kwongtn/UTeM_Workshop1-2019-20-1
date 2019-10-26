"use strict";
var express = require("express");
var session = require("cookie-session");
var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({ extended: false });

// Database connection 
const mysqlx = require('@mysql/xdevapi');


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

    .get("/home", function (req, res) {
        res.render("home.ejs", {
            appName: appName
        });
    })

    .get("/listUsers", function (req, res) {
        var userList = mysqlx.getSession(config)
            .then(session => {
                return session.getSchema("CLUB-MAN").getTable("USER");
            })
            .then(table => {
                return table.select(["userID", "engName", "email", "faculty"])
                    .bind('fac', 'FTMK')
                    .execute();
            })
            .then(output => {
                console.log(output.fetchAll());
                console.log("==================");
            });

        res.render("listUsers.ejs", {

        })

    })


    .listen(8080)
    ;

