"use strict";

// 8081 uses x-Protocol, while 8082 uses the old authentication method
const config = {
    password: 'password',
    user: 'root',
    host: 'localhost',
    port: 8081
};

// Database connection 
const mysqlx = require('@mysql/xdevapi');

// Function to request table.
// Modularized to enable other functions to request for table for CRUD functions.
function reqTable(tableName) {
    return mysqlx.getSession(config)
        .then(session => {
            return session.getSchema("CLUB-MAN").getTable(tableName.toUpperCase());
        })
};

// Db data listing function
module.exports.list = async function (tableName, jsonBody) {
    return reqTable(tableName)

        // Query table
        .then(table => {
            return table.select(jsonBody.query);
        })

        .then(table => {
            // Insert criteria for table
            var queryCount = 0, queryString = "";
            for (var attrib in jsonBody) {
                if (queryCount != 0) {
                    queryString += " && "
                }
                if (attrib != "query" && attrib != "" && attrib != "order") {
                    queryString += attrib + " like :" + attrib;
                    queryCount++;
                }
            }
            console.log("-" + queryString + "-");
            table.where(queryString);

            // Bind criteria for table
            for (var attrib in jsonBody) {
                if (attrib != "query" && attrib != "" && attrib != "order") {
                    table = table.bind(attrib, jsonBody[attrib]);
                    console.log(attrib + "-" + jsonBody[attrib]);
                }
            }
            
            return table;
        })
        
        // Insert Order By functionality
        .then(async table => {
            if(jsonBody.order){
                table = await table.orderBy(jsonBody.order);
            }
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

// Login check
module.exports.login = async (loginJSON) => {
    console.log(loginJSON);
    const pass = loginJSON.pass;

    const useJSON = {
        query: [
            "matricNo",
            "icNo",
            "custPw"
        ],
        "matricNo" : loginJSON.username
    };

    const result = await this.list("USER", useJSON);
    console.log(result[0]);
    console.log(pass);
    
    if(result[0][2]){
        if(result[0][2] == pass){
            console.log("Password Correct");
            return true;
        } else {
            console.log("Password Wrong");
            return false;
        }

    } else if (result[0][1]){
        if(result[0][1] == pass){
            console.log("IC Correct");
            return true;
        } else {
            console.log("IC Wrong");
            return false;
        }

    } else {
        console.log("Error");
    }
     
};