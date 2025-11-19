const express = require('express');
const router = express.Router();
const Roles = require('../config/Roles');

const UserConfigurationController = require('../controller/UserConfigurationController');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');

router.get('/getUsersFromEnterprise', verifyToken, verifyRole([Roles.admin, Roles.manager]), UserConfigurationController.getUsersFromEnterprise);

module.exports = router;
