const express = require('express');
const router = express.Router();

const GetItemsController = require('../controller/GetItemsController');

router.get('/getAllEnterprises', GetItemsController.getAllEnterprises);

module.exports = router;
