const express = require('express');
const multer = require("multer");
const path = require("path");
const router = express.Router();
const service = require("../services/fimsService");

var fileName = "";

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        fileName = Date.now() + "-" + file.originalname;
        cb(null, fileName);
    }
})

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 5000;
var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize }
});

router.post("/fims/uploadfile", upload.single('file'), async function (req, res, next) {
    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    var infos = JSON.parse(req.body.info);
    let json = await service.convertToFIMSTemplate(fileName, infos);
    res.status(200).json({ success: true, file: fileName, data: json.data, CSV: json.CSV, body: infos });
});

router.post("/fims/createLabelAPI", async function (req, res, next) {
    let data = await service.soapTestXML(req.body, res);
    //res.status(200).json({ success: true, data });
});

module.exports = router;