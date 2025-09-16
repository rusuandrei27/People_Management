const db = require('../config/db');

class UserModel {

    constructor(firstName = null, lastName = null, email = null, phone = null, password = null) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }

    insertUser(userData) {
        const { firstName, lastName, email, phone, password } = userData;
        const sql = 'insert into user (firstName, lastName, email, phone, password) VALUES (?, ?, ?, ?, ?);';
        return db.execute(sql, [firstName, lastName, email, phone, password]);
    }

    getUserByEmail(email) {
        const sql = 'select idUser, email, password from user where email = ?;';
        return db.execute(sql, [email]);
    }

    getUserByPhone(phone) {
        const sql = 'select idUser, email, password from user where phone = ?;';
        return db.execute(sql, [phone]);
    }
}

module.exports = UserModel;
