const db = require('../infra/database');
var crypto = require('crypto');
const jwt = require("jsonwebtoken");
var XLSX = require("xlsx");
let fs = require("fs");
const mongo = require("../infra/mongodb");

async function userLogin(email, password) {
    try {
        // Validate user input
        if (!(email && password)) {
            //res.status(400).send("All input is required");
            return null;
        }
        let hashPassword = crypto.createHash('sha1');
        hashPassword.update(password);
        var tempHash = hashPassword.digest('hex');
        // Validate if user exist in our database
        //const tempUser = await db1.query("SELECT * FROM usuario WHERE email = ?", [email]);
        const user = await db.get("SELECT * FROM usuario WHERE email = ?", [email]);

        if (user && (tempHash == user.senha)) {
            // Create token
            const token = jwt.sign(
                { user_id: user.id, email, foto: user.foto },
                `${process.env.TOKEN_KEY}`,
                {
                    expiresIn: "24h",
                }
            );
            user.initials = utils.createInitials(user.nome);
            // save user token
            user.success = true;
            user.token = token;
            return user;
        } else {

        }
        return null;
    } catch (err) {
        console.log(err);
    }
}

async function userRegister(fields) {
    try {
        let { nome, email, senha, empresa } = fields;
        
        let temp = await companyCtrl.createCompany(empresa);
        let idEmpresa = temp.id;
        ///
        let hashPassword = crypto.createHash('sha1').update(senha);
        var tempHash = hashPassword.digest('hex');
        ///
        let senha2 = tempHash;
        let SQL = `INSERT INTO usuario VALUES (null, '${nome}', '${email}', '${senha2}', null, 1, 1, 0, ${idEmpresa}) returning *`;
        return await db.get(SQL);
    } catch (err) {
        console.log(err);
    }
    
}

async function convertToFIMSTemplate() {
    var workbook = XLSX.readFile("Test.xlsx");
    var sheet_name_list = workbook.SheetNames;
    var sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    let writeStream = "";
    sheetData.map(function(line) {
        writeStream += 'H;' + ';;' + '888888888888;' + line.order + ';' + line.firstName + ' ' + line.lastName + ';;' + line.address1 + ';' + ';' + ';;' + line.city + ';' + line.state + ';' + line.postalCode + ';' + line.country + ';' + line.phoneNumber + ';;' + 'R;' + 'x;' + '41;' + '1;' + ';' + ';' + ';' + ';'+"\n";
        if (line['product0 name']) {
            let weight = (line['product0 weight'] ? line['product0 weight'] : 0);
            writeStream += `D;${line['product0 name']};${line['product0 price']};${weight};875591234567;US;\n`;
        }
        if (line['product1 name']) { 
            let weight = (line['product1 weight'] ? line['product0 weight'] : 0);
            writeStream += `D;${line['product1 name']};${line['product1 price']};${weight};875591234567;US;\n`; 
        }
        if (line['product2 name']) { 
            let weight = (line['product2 weight'] ? line['product2 weight'] : 0);
            writeStream += `D;${line['product2 name']};${line['product2 price']};${weight};875591234567;US;\n`; 
        }
        if (line['product3 name']) { 
            let weight = (line['product3 weight'] ? line['product3 weight'] : 0);
            writeStream += `D;${line['product3 name']};${line['product3 price']};${weight};875591234567;US;\n`; 
        }
        //writeStream += item.join(";")+"\n";
    });
    fs.writeFile("./data.csv", writeStream, (err) => {
        console.log(err || "done");
    });
    /*
    fs.writeFile("file.csv", writeStream)
        .then(file => { console.log(file); });
    //console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]))
    //*/
    return sheet_name_list;
}

async function testMongo(user) {
    /*
    let item = await mongo.db("local")
        .collection("animals")
        .findOne({ my_item: my_item });
    //*/
    databasesList = await mongo.db().admin().listDatabases();

    //console.log("Databases:");
    //databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    const database = mongo.db("DSJ");
    const collection = database.collection("user");
    ///
    const recipes = [
        {
            name: "elotes",
            ingredients: [
                "corn",
                "mayonnaise",
                "cotija cheese",
                "sour cream",
                "lime",
            ],
            prepTimeInMinutes: 35,
        },
        {
            name: "loco moco",
            ingredients: [
                "ground beef",
                "butter",
                "onion",
                "egg",
                "bread bun",
                "mushrooms",
            ],
            prepTimeInMinutes: 54,
        },
        {
            name: "patatas bravas",
            ingredients: [
                "potato",
                "tomato",
                "olive oil",
                "onion",
                "garlic",
                "paprika",
            ],
            prepTimeInMinutes: 80,
        },
        {
            name: "fried rice",
            ingredients: [
                "rice",
                "soy sauce",
                "egg",
                "onion",
                "pea",
                "carrot",
                "sesame oil",
            ],
            prepTimeInMinutes: 40,
        },
    ];
    ///
    try {
        delete user.id;
        const insertManyResult = await collection.insertOne(user);
        console.log(`${insertManyResult.insertedCount} documents successfully inserted.\n`);
    } catch (err) {
        console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
    }

    return databasesList;
}

async function searchUser(email, password) {
    ;
    const collection = mongo.db("DSJ").collection("user");
    const findOneQuery = { email: email };
    try {
        const findOneResult = await collection.findOne(findOneQuery);
        if (findOneResult === null) {
            console.log("Couldn't find any user with this email.\n");
        } else {
            let hashPassword = crypto.createHash('sha1');
            hashPassword.update(password);
            var tempHash = hashPassword.digest('hex');
            const user = findOneResult;
            if (user && (tempHash == user.senha)) {
                const token = jwt.sign(
                    { user_id: user.id, nome: user.nome, email, foto: user.foto },
                    `${process.env.TOKEN_KEY}`,
                    {
                        expiresIn: "24h",
                    }
                );
                user.success = true;
                user.token = token;
                return user;
            } else {

            }
            return null;
        }
    } catch (err) {
        console.error(`Something went wrong trying to find one document: ${err}\n`);
    }
}

module.exports = {
    userLogin,
    userRegister,
    convertToFIMSTemplate,
    testMongo,
    searchUser
}