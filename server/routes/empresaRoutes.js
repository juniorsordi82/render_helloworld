const express = require('express');
const router = express.Router();
const service = require('../services/empresaService');

router.post("/empresa/usuario", async function (req, res, next) {
    let response = await service.salvarUsuario(req.body);
    if (response) {
        response.success = true;
        response.Msg = "Conta criada com sucesso!";
    }
    res.status(200).json(response);
});

router.get("/empresa/usuario", async function (req, res, next) {
    let response = await service.listarUsuarios(1);
    res.status(200).json(response);
});

router.put("/empresa/usuario", async function (req, res, next) {
    let response = await service.atualizarUsuario(req.body);
    res.status(200).json(response);
});

router.get("/empresa/usuario/:id", async function (req, res, next) {
    let response = await service.pegarUsuario(req.params.id);
    res.status(200).json(response);
});

module.exports = router;