const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');
let fs = require("fs");

router.post("/auth/login", async function (req, res, next) {
    try {
        // Get user input
        const { email, password } = req.body;
        const user = await controller.userLogin(email, password);
        // user
        if (user) {
            res.cookie("access_token", user.token, {
                httpOnly: true,
                maxAge: 86400000,
                secure: process.env.NODE_ENV === "production",
            });
            //
            res.cookie("user", user, { maxAge: 86400000 });
            res.cookie("IDUser", user.id, { maxAge: 86400000 });
            //*/
            req.session.loggedin = true;
            req.session.userID = user.id;
            //req.session.user = user;
            req.session.token = user.token;
            req.session.save(function (err) { console.log(err); });
            res.status(200).json(user);
        } else {
            res.status(200).json({ success: false, msg: "Invalid Credentials" });
        }

    } catch (err) {
        console.error(`Error while getting response`, err.message);
        next(err);
    }
});

router.get("/auth/login", async function (req, res, next) {
    try {
        // Get user input
        const { email, password } = req.query;
        let user = await controller.searchUser(email, password);
        //const user = await controller.userLogin(email, password);
        // user
        /*
        if (user) {
            res.cookie("access_token", user.token, {
                httpOnly: true,
                maxAge: 86400000,
                secure: process.env.NODE_ENV === "production",
            });
            //
            res.cookie("user", user, { maxAge: 86400000 });
            res.cookie("IDUser", user.id, { maxAge: 86400000 });
            req.session.loggedin = true;
            req.session.userID = user.id;
            //req.session.user = user;
            req.session.token = user.token;
            req.session.save(function (err) { console.log(err); });
            res.status(200).json(user);
        } else {
            res.status(200).json({ success: false, msg: "Invalid Credentials" });
        }
            //*/
        res.status(200).json(user);
    } catch (err) {
        console.error(`Error while getting response`, err.message);
        next(err);
    }
});

router.get("/auth/logout", async function (req, res, next) {
    req.session.destroy();
    res.status(200).json([]);
});

router.post("/auth/register", async function (req, res, next) {
    let response = await controller.userRegister(req.body);
    if (response) {
        response.success = true;
        response.Msg = "Conta criada com sucesso!";
    }
    res.status(200).json(response);
});

router.get("/auth/checkToken", async function (req, res, next) {
    res.status(200).json(req.session);
});

router.get("/auth/testXLSX", async function (req, res, next) {
    let response = await controller.convertToFIMSTemplate();
    res.status(200).json(response);
});

router.get("/auth/testMongo", async function (req, res, next) {
    console.log(req.body);
    let response = await controller.testMongo();
    res.status(200).json(response);
});

router.post("/auth/testMongo", async function (req, res, next) {
    console.log(req.body);
    let response = await controller.testMongo();
    res.status(200).json(response);
});

router.get("/auth/lastRevision", async function (req, res, next) {
    /*
    let revision = require('child_process')
        .execSync('git rev-parse HEAD')
        .toString().trim();
    //*/
    let revision = "";
    const rev = fs.readFileSync('.git/HEAD').toString().trim();
    if (rev.indexOf(':') === -1) {
        revision = rev;
    } else {
        revision = fs.readFileSync('.git/' + rev.substring(5)).toString().trim();
    }
    const package_json = JSON.parse(fs.readFileSync('package.json').toString().trim());

    version = package_json.version;
    res.status(200).json({ revision: revision, version: version });
});

module.exports = router;