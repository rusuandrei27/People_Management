const db = require('../config/db');

class EnterpriseXUserModel {

    constructor(idUser, idEnterprise, isActive, idRole) {
        this.idUser = idUser;
        this.idEnterprise = idEnterprise;
        this.isActive = isActive;
        this.idRole = idRole;
    }

    async findActiveUsersByEnterpriseId() {
        const sql = `SELECT * FROM enterpriseXuser as eXu
                     INNER JOIN user as u on u.idUser = eXu.idUser
                     where eXu.isActive = True and eXu.idEnterprise = ? ;`;

        const [result] = await db.execute(sql, [this.idEnterprise]);
        return result;
    }

    async findUsersByEnterpriseId() {
        const sql = `SELECT * FROM enterpriseXuser as eXu
                     INNER JOIN user as u on u.idUser = eXu.idUser
                     where eXu.idEnterprise = ? ;`;

        const [result] = await db.execute(sql, [this.idEnterprise]);
        return result;
    }

    async findEnterpriseByName() {
        const sql = 'SELECT idEnterprise FROM enterprise WHERE name = ?';
        const [rows] = await db.execute(sql, [this.name]);
        return rows[0];
    }
}

module.exports = EnterpriseXUserModel;
