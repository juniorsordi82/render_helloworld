const express = require('express');
const router = express.Router();
const service = require('../services/financeiroService');

router.post("/financeiro/contabancaria", async function (req, res, next) {
    let response = await service.salvarContaBancaria(req.body);
    if (response) {
        response.success = true;
        response.Msg = "Conta criada com sucesso!";
    }
    res.status(200).json(response);
});

router.get("/financeiro/contabancaria", async function (req, res, next) {
    let response = await service.listarContasBancarias(1);
    res.status(200).json(response);
});

module.exports = router;