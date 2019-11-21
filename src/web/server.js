"use strict";
const db = require("./dbFunctions");
var express = require("express");
var session = require("cookie-session");
var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({ extended: false });
var dbResponse;

const debugMode = true;

// Application 
var app = express();

const appName = "club-man";

app.use(session({ secure: true, secret: "someKey" }))
    .use(express.json())
    .use(express.static("views"))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())

    .get("/", (req, res) => {
        var now = new Date();
        res.render("login.ejs", {
            appName: appName,
            time: now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "." + now.getMilliseconds()
        });
    })

    .post("/login/", urlEncodedParser, async (req, res) => {
        const loginOrNot = await db.login(req.body);
        console.log(loginOrNot);
        if (loginOrNot) {
            res.redirect("/home");

        } else {
            res.redirect("/");

        }

    })

    .use("/home", (req, res) => {
        res.render("home.ejs", {
            appName: appName
        });
    })

    //To add entry for search functionality
    .get("/list/users", (req, res) => {
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
            attribList: attribList
        });

    })


    .post("/list/:tableName/", async (req, res) => {
        dbResponse = await db.list(req.params.tableName, req.body);
        console.log(dbResponse);
        // Unsure of reason no redirection is being done
        res.redirect("/listing");
    })

    .get("/listing", (req, res) => {
        res.render("listing_user.ejs", {
            list: dbResponse
        });
    })

    .get("/registration", (req, res) => {
        var attribList = [
            { "name": "engName", "label": "English Name", "required": true },
            // Due to CJK Problems, we will ignore chinese names for the time being.
            // { "name": "chineseName", "label": "Chinese Name", "required": true },
            { "name": "email", "label": "e-mail", "required": true },
            { "name": "phoneNo", "label": "Phone Number", "required": true },
            { "name": "facebookID", "label": "Facebook ID", "required": false },
            { "name": "icNo", "label": "IC Number", "required": true },
            { "name": "hostel", "label": "Hostel", "required": false },
            { "name": "faculty", "label": "Faculty", "required": false },
            { "name": "course", "label": "Course", "required": false },
            { "name": "hometown", "label": "Hometown", "required": false },
            { "name": "matricNo", "label": "Matric No", "required": true },
            { "name": "custPw", "label": "Custom Password", "required": false }
        ];
        res.render("singleRegistration.ejs", {
            attribList: attribList
        });
    })

    .get("/user/:userID", async (req, res) => {
        console.log(req.params.userID);
        var jsonBody = {
            "query":["userID", "engName", "email", "phoneNo", "facebookID", "icNo", "matricNo", "hostel", "faculty", "course", "hometown"],
            "userID": req.params.userID
        };

        var attribList = [
            { "name": "userID", "label": "userID", "required": true },
            { "name": "engName", "label": "English Name", "required": true },
            // Due to CJK Problems, we will ignore chinese names for the time being.
            // { "name": "chineseName", "label": "Chinese Name", "required": true },
            { "name": "email", "label": "e-mail", "required": true },
            { "name": "phoneNo", "label": "Phone Number", "required": true },
            { "name": "facebookID", "label": "Facebook ID", "required": false },
            { "name": "matricNo", "label": "Matric No", "required": true },
            { "name": "icNo", "label": "IC Number", "required": true },
            { "name": "hostel", "label": "Hostel", "required": false },
            { "name": "faculty", "label": "Faculty", "required": false },
            { "name": "course", "label": "Course", "required": false },
            { "name": "hometown", "label": "Hometown", "required": false } //,
            // { "name": "custPw", "label": "Custom Password", "required": false }
        ];

        const dbResponse = await db.list("USER", jsonBody);
        console.log(dbResponse);

        res.render("userProfile.ejs", {
            profile: dbResponse[0],
            userID: req.params.userID,
            attribList: attribList
        });
    })

    .post("/addData/:tableName/", (req, res) => {
        console.log(req.params.tableName, req.body);
        db.addData(req.params.tableName, req.body);
    })

    .listen(8080)
    ;


// Send required files from server
app.get("/assets/:file", (req, res) => {
    var sendFile = "./assets/" + req.params.file;
    console.log(sendFile);
    res.sendFile(sendFile);
});
