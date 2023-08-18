var crypto = require('crypto');
const jwt = require("jsonwebtoken");
const mongo = require("../infra/mongodb");
const util = require("../infra/utils");
var ObjectId = require('mongodb').ObjectId;

async function salvarUsuario(fields) {
    try {
        let { nome, email, senha, id_empresa, id_tipo_login, foto } = fields;
        let hashPassword = crypto.createHash('sha1').update(senha);
        var tempHash = hashPassword.digest('hex');
        let senha2 = tempHash;
        fields.senha = senha2;
        fields.initials = util.createInitials(fields.nome);
        fields.ativo = 1;
        fields.id_tipo_login = 1;
        const collection = mongo.db("DSJ").collection("user");
        try {
            const insertOneResult = await collection.insertOne(fields);
            console.log(`${insertOneResult} item successfully inserted.\n`);
        } catch (err) {
            console.error(`Something went wrong trying to insert the new item: ${err}\n`);
        }
        return fields;
    } catch (err) {
        console.log(err);
    }
}

async function listarUsuarios(idEmpresa) {
    try {
        const collection = mongo.db("DSJ").collection("user");
        const options = {
            // sort returned documents in ascending order by title (A->Z)
            sort: { nome: 1 },
            projection: { _id: 1, nome: 1, email: 1, is_admin: 1, ativo: 1 },
        };
        const usersList = await collection.find({ id_empresa: idEmpresa }, options).toArray(function (err, docs) { return docs; });
        return usersList;
    } catch (err) {
        console.log(err);
    }
}

async function atualizarUsuario(json) {
    try {
        const collection = mongo.db("DSJ").collection("user");
        const options = { upsert: false };
        //console.log(json._id);
        var idUsuario = json._id;
        let copy = json;
        delete copy._id;
        const usersList = await collection.updateOne({ "_id": new ObjectId(idUsuario) }, { $set: copy }, options);
        return usersList;
    } catch (err) {
        console.log(err);
    }
}

async function pegarUsuario(idUsuario) {
    try {
        const collection = mongo.db("DSJ").collection("user");
        const usersList = await collection.findOne({ "_id": new ObjectId(idUsuario) }, function (err, result) {
            if (err) throw err;
            return result;
        });/*
        const usersList = await collection.findOne({ email: idUsuario }, function (err, result) {
            if (err) throw err;
            console.log(result);
            //db.close();
            return result;
        });//*/
        return usersList;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    salvarUsuario,
    listarUsuarios,
    pegarUsuario,
    atualizarUsuario
}