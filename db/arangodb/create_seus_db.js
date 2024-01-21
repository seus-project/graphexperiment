'use strict';

const db = require('@arangodb').db;
const databaseName = 'seus';

// Create a new database (remove if the previous exists)
if (db._databases().includes(databaseName)) {
    db._dropDatabase(databaseName);
}
db._createDatabase(
    databaseName, 
    {},
    [{ 
        username: process.env.SEUS_USERNAME, 
        passwd: process.env.SEUS_PASSWORD,
        active: true
    }]);
