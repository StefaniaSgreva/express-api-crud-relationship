const express = require('express');
const { Router } = require('express');
const router = Router();
const authController = require("../controllers/authController");
// const { checkSchema } = require("express-validator");
// const { checkValidity } = require('../middleware/schemaValidator');
const validate = require('../middleware/schemaValidator'); // Middleware helper che esporta un array di funzioni (checkSchema + checkValidity)
const userRegister = require("../validations/userRegister");
const userLogin = require("../validations/userLogin");


// router.post("/register", checkSchema(userRegister), checkValidity, authController.register);
// router.post("/login", checkSchema(userLogin), checkValidity, authController.login);

router.post("/register", ...validate(userRegister), authController.register);
router.post("/login", ...validate(userLogin), authController.login);

module.exports = router;
