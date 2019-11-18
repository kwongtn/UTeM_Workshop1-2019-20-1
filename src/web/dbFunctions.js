"use strict";
const debug = true;

// JSON data to be ignored during queries
const ignoreValues = [
    "query",
    "",
    "order",
    "formAddress"
]

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
module.exports.list = (tableName, jsonBody) => {
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
                if (!ignoreValues.includes(attrib)) {
                    queryString += attrib + " like :" + attrib;
                    queryCount++;
                }
            }
            console.log("-" + queryString + "-");
            table.where(queryString);

            // Bind criteria for table
            for (var attrib in jsonBody) {
                if (!ignoreValues.includes(attrib)) {
                    table = table.bind(attrib, jsonBody[attrib]);
                    console.log(attrib + "-" + jsonBody[attrib]);
                }
            }

            return table;
        })

        // Insert Order By functionality
        .then(async table => {
            if (jsonBody.order) {
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
    console.log("Showing login.json");
    console.log(loginJSON);
    const pass = loginJSON.pass;

    const useJSON = {
        query: [
            "matricNo",
            "icNo",
            "custPw"
        ],
        "matricNo": loginJSON.username
    };

    console.log(useJSON);

    const result = await this.list("USER", useJSON);
    if (result.toString() != ""){
        if (result[0][2]) {
            if (result[0][2] == pass) {
                debug ? console.log("Password Correct") : 0;
                return true;
            } else {
                debug ? console.log("Password Wrong") : 0;
                return false;
            }
    
        } else if (result[0][1]) {
            if (result[0][1] == pass) {
                debug ? console.log("IC Correct") : 0;
                return true;
            } else {
                debug ? console.log("IC Wrong") : 0;
                return false;
            }
    
        } else {
            console.log("Error");
            return false;
        }

    } else {
        console.log("Wrong login.");
        return false;
    }




};

// Db data adding function
module.exports.addData = (tableName, jsonBody) => {
    
    // Add data fields to array
    var dataAddArray = [];
    for(let attrib in jsonBody){
        if (!ignoreValues.includes(attrib)){
            dataAddArray.push(attrib);
        }
    }

    // Add data values to array
    var valueAddArray = [];
    for(let attrib in jsonBody){
        if (!ignoreValues.includes(attrib)){
            valueAddArray.push(jsonBody[attrib]);
        }
    }

    
    // To program what wil happen if dbms rejects data.
    reqTable(tableName)
    .then(table => {
        return table.insert(dataAddArray);
    })
    .then(table => {
        return table.values(valueAddArray);
    })
    .then(table => {
        table.execute();
    })
    
    .catch()
    ;

}