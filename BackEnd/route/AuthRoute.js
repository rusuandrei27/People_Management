const express = require('express');
const router = express.Router();

const AuthController = require('../controller/AuthController');

router.post('/sendRegisterEmail', AuthController.sendRegisterEmail);
router.post('/insertUser', AuthController.insertUser);
router.post('/assignUserToEnterprise', AuthController.assignUserToEnterprise);
router.post('/login', AuthController.login);


module.exports = router;


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}