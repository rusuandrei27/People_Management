const express = require('express');
const router = express.Router();
const Roles = require('../config/Roles');

const GetItemsController = require('../controller/GetItemsController');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');

router.get('/getAllEnterprises', GetItemsController.getAllEnterprises);
router.get('/getAllRoles', verifyToken, verifyRole([Roles.admin, Roles.manager]), GetItemsController.getAllRoles);

module.exports = router;
