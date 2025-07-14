const db = require('../config/db');

class UserModel {

    constructor(firstName, lastName, email, phone, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }

    async createUser() {
        const sql = 'INSERT INTO user (firstName, lastName, email, phone, password) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(sql, [this.firstName, this.lastName, this.email, this.phone, this.password]);
        console.log(result)
        return result.insertId;
    }

    async findUserByEmail() {
        const sql = 'SELECT idUser FROM user WHERE email = ?';
        const [rows] = await db.execute(sql, [this.email]);
        return rows[0];
    }

    async findUserByPhone() {
        const sql = 'SELECT idUser FROM user WHERE phone = ?';
        const [rows] = await db.execute(sql, [this.phone]);
        return rows[0];
    }
}

module.exports = UserModel;
