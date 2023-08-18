//const sqlite3 = require('sqlite3').verbose();
const sqlite3 = require('sqlite3');
const util = require('util');
//const dyn = require("./dynamo");

//
/*
let db1 = new sqlite3.Database('./databaseDL.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the chatbot database.');
});
//*/
var db = new sqlite3.Database('mcu.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log("Getting error " + err);
        exit(1);
    }
});

db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);

module.exports = db;
///#############################################################################
