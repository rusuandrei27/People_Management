const express = require('express');
const router = express.Router();

const AuthController = require('../controller/AuthController');

router.post('/sendRegisterEmail', AuthController.sendRegisterEmail);
router.post('/insertUser', AuthController.insertUser);
router.post('/assignUserToEnterprise', AuthController.assignUserToEnterprise);
router.post('/login', AuthController.login);


module.exports = router;
