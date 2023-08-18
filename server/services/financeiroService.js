var crypto = require('crypto');
const jwt = require("jsonwebtoken");
const mongo = require("../infra/mongodb");
const util = require("../infra/utils");
var ObjectId = require('mongodb').ObjectId;

async function salvarContaBancaria(fields) {
    try {
        fields.ativo = 1;
        fields.id_empresa = 1;
        fields.saldo_atual = fields.saldo_inicial;
        const collection = mongo.db("DSJ").collection("financeiro_contabancaria");
        try {
            const insertOneResult = await collection.insertOne(fields);
            console.log(`item successfully inserted.\n`);
            return insertOneResult;
        } catch (err) {
            console.error(`Something went wrong trying to insert the new item: ${err}\n`);
        }
        return fields;
    } catch (err) {
        console.log(err);
    }
}

async function listarContasBancarias(idEmpresa) {
    try {
        const collection = mongo.db("DSJ").collection("financeiro_contabancaria");
        const options = {
            // sort returned documents in ascending order by title (A->Z)
            sort: { nome: 1 },
            //projection: { _id: 1, nome: 1, email: 1, is_admin: 1, ativo: 1 },
        };
        const accountsList = await collection.find({ id_empresa: idEmpresa }, options).toArray(function (err, docs) { return docs; });
        return accountsList;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    salvarContaBancaria,
    listarContasBancarias,
}