const express = require('express');
const router = express.Router();
const Roles = require('../config/Roles');

const RevenuesController = require('../controller/RevenueController');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');

router.get('/getRevenues', verifyToken, verifyRole([Roles.admin, Roles.manager, Roles.supervisor, Roles.employee]), RevenuesController.getRevenues);
router.post('/insertRevenue', verifyToken, verifyRole([Roles.admin, Roles.manager, Roles.supervisor, Roles.employee]), RevenuesController.insertRevenue);

module.exports = router;
