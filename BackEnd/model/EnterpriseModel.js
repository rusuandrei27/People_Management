const db = require('../config/db');

class EnterpriseModel {

    constructor(name, idAddress, idEnterprise_type) {
        this.name = name;
        this.idAddress = idAddress;
        this.idEnterprise_type = idEnterprise_type;
    }

    async createEnterprise() {
        const sql = 'INSERT INTO enterprise (name, idAddress, idEnterprise_type) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(sql, [this.name, this.idAddress, this.idEnterprise_type]);
        return result.insertId;
    }

    async findEnterpriseByName() {
        const sql = 'SELECT idEnterprise FROM enterprise WHERE name = ?';
        const [rows] = await db.execute(sql, [this.name]);
        return rows[0];
    }
}

module.exports = EnterpriseModel;

console.log("1234")

console.log("4545")
