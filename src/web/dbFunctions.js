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

async function reqTable(tableName) {
    const session = await mysqlx.getSession(config);
    const table = session.getSchema("CLUB-MAN").getTable(tableName);
    return table;
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

            table.where(queryString);

            // Bind criteria for table
            for (var attrib in jsonBody) {
                if (attrib != "query" && attrib != "" && attrib != "order") {
                    table = table.bind(attrib, jsonBody[attrib]);
                }
            }
            return table;
        })

        // Insert Order By functionality
        .then(table => {
            return table.orderBy(jsonBody.order);
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
