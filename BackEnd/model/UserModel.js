const db = require('../config/db');

class UserModel {

    async insertUser(userData) {
        const { firstName, lastName, email, phone, password } = userData;
        const sql = 'INSERT INTO user (firstName, lastName, email, phone, password) VALUES (?, ?, ?, ?, ?)';
        return await db.execute(sql, [firstName, lastName, email, phone, password]);
    }

    async findUserByEmail(email) {
        const sql = 'SELECT idUser FROM user WHERE email = ?';
        return await db.execute(sql, [email]);
    }

    async findUserByPhone(phone) {
        const sql = 'SELECT idUser FROM user WHERE phone = ?';
        return await db.execute(sql, [phone]);
    }
}

module.exports = UserModel;
