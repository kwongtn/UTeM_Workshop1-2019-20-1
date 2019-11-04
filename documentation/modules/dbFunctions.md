This document desribes methods and criteria for `/src/web/dbFunctions.js`. Due to language requirements and to prevent errors, will be later converted to typescript.


# Defaults
- Strict mode is used.

# Functions and Methods
## async function list(tableName, jsonBody)
- returns `array`

| Parameter | Data Type | Short Description |
| --- | --- | --- |
| tableName | String | The table to be queried from the database. |
| jsonBody | json | JSON file containing parameters to be searched. |

### tableName
- Type: String
- Case insensitive.
- A string containing the table to be queried from database. Throws error when table not found in database.

### jsonBody
- Type: JSON
- A JSON Object containing parameters to be queried. Format as below:
```
{
    "query": [
        "fieldName10",
        "fieldName11",
        .
        .
        .
        "fieldNameN"
    ],
    "fieldName21": "criteria",
    "fieldName22": "criteria",
    .
    .
    .
    "order": "fieldName"
}
```
- `query` contains an array of strings that correspond to the field name of database. 
- \[OPTIONAL] `fieldName` contains a criteria that will be passed to database. If there are multiple criteria present, the intercept of the results will be returned. ("AND" function)
- \[OPTIONAL] `order` is a string that correspond to field name of database. If present then result will be sorted in order according to field.


Note: 
- There can only be a maximum of 1 `query` and 1 `order` in each JSON object.
- It is not required to match `fieldNames`. \
E.g. Any field that has criteria does not need to be defined in `query`