"use strict";
var express = require("express");
var session = require("cookie-session");
var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({ extended: false });
var dbResponse;

// Event emmiter
var events = require("events");
var eventEmitter = new events.EventEmitter();

// Db data listing function
async function list(tableName, jsonBody) {
   return reqTable(tableName)
        
        // Query table
        .then(table => {
            return table.select(jsonBody.query);
        })

        .then(table => {
            // Insert criteria for table
            for (var attrib in jsonBody) {
                if (attrib != "query" && attrib != "order") {
                    table = table.where(attrib + " like :" + attrib);
                }
            }
            
            // Bind criteria to attributes
            for (var attrib in jsonBody) {
                if (attrib != "query" && attrib != "") {
                    table = table.bind(attrib, jsonBody[attrib]);
                }
            }

            // Set ordering if there is
            table = table.orderBy(jsonBody.order);

            return table;
        })
        
        // Execute the query and fetch all matched results
        .then(table => {
            return table.execute();
        })
        .then(table => {
            return table.fetchAll();
        })
        ;
}

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
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())

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


    .post("/list/:tableName", async function (req, res) {
        var listing = await list(req.params.tableName, req.body);
        console.log(listing);
        // res.redirect("/list");
    })

    .get("/list", (req, res) => {
        console.log(dbResponse);
        res.render("listing.ejs", {
            list: dbResponse
        })
    })

    .listen(8080)
    ;


// Send required files to server
app
    .get("/assets/:file", (req, res) => {
        var sendFile = "./assets/" + req.params.file;
        console.log(sendFile);
        res.sendFile(sendFile);
    });
