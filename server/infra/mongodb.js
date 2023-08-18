const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_CONNECTION_STRING;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = client;

/*
LX562715142US
http://mailviewshipper.fedex.com/shipper_package_summary.aspx?txtPostalIDNumber=LX562715142US
*/