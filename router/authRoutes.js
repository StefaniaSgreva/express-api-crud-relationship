const express = require('express');
const router = Router();
const authController = require("../controllers/authController");
const { checkSchema } = require("express-validator");
const { checkValidity } = require('../middleware/schemaValidator');
const userRegister = require("../validations/userRegister");
const userLogin = require("../validations/userLogin");

router.post("/register", checkSchema(userRegister), checkValidity, authController.register);
router.post("/login", checkSchema(userLogin), checkValidity, authController.login);

module.exports = router;
