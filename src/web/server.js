"use strict";
var express = require("express");
var session = require("cookie-session");
var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({ extended: false });

// Event emmiter
var events = require("events");
var eventEmitter = new events.EventEmitter();

// Db data listing function
eventEmitter.on("list", (res, x) => {
    // console.log(x);
    return x;
    res.render("listing.ejs", {
        list: x
    });
    console.log("Listing Page loaded");
});

// Database connection 
const mysqlx = require('@mysql/xdevapi');

async function reqTable(tableName) {
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

const appName = "club-man";

app.use(session({ secure: true, secret: "someKey" }))
    .use(express.json())
    .use(express.static("views"))

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
    .get("/listUser", function (req, res) {
        var attribList = [
            { "name": "userID", "label": "User ID" },
            { "name": "engName", "label": "English Name" },
            // Due to CJK Problems, we will ignore chinese names for the time being.
            // { "name": "chineseName", "label": "Chinese Name" },
            { "name": "email", "label": "e-mail" },
            { "name": "phoneNo", "label": "Phone Number" },
            { "name": "facebookID", "label": "Facebook ID" },
            { "name": "icNo", "label": "IC Number" },
            { "name": "matricNo", "label": "Matric No" },
            { "name": "hostel", "label": "Hostel" },
            { "name": "faculty", "label": "Faculty" }
        ];
        // var type = userList;

        res.render("query.ejs", {
            attribList: attribList,
            // type: type
        });

    })

    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())

    .post("/listUsers/", function (req, res) {
        var dbResponse;
        reqTable("USER").then(table => {
            return table.select(req.body.query)
                .execute();
        })
            .then(output => {
                return output.fetchAll();
            })
            .then(x => {
                console.log(x);
                console.log("Done with selection");
                dbResponse = eventEmitter.emit("list", res, x)
            })
            ;
            res.render("listing.ejs", {
                list: dbResponse
            });
        
    })

    .listen(8080)
    ;

app
    .get("/assets/:file", (req, res) => {
        var sendFile = "./assets/" + req.params.file;
        console.log(sendFile);
        res.sendFile(sendFile);
    });
