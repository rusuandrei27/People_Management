const db = require('../config/db');

class UserModel {

    constructor(connection = null, firstName = null, lastName = null, email = null, phone = null, password = null) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.connection = connection ? connection : db;
    }

    insertUser(userData) {
        const { firstName, lastName, email, phone, password } = userData;
        const sql = 'insert into user (firstName, lastName, email, phone, password) VALUES (?, ?, ?, ?, ?);';
        return this.connection.execute(sql, [firstName, lastName, email, phone, password]);
    }

    updateUser(userData, idUser) {
        const sql = `update user set ? where idUser = ?`

        return this.connection.query(sql, [userData, idUser]);
    }

    getUserByEmail(email) {
        const sql = 'select idUser, email, password from user where email = ?;';
        return this.connection.execute(sql, [email]);
    }

    getUserByPhone(phone) {
        const sql = 'select idUser, email, password from user where phone = ?;';
        return this.connection.execute(sql, [phone]);
    }

    setConnection(connection) {
        this.conenction = connection;
    }
}

module.exports = UserModel;
