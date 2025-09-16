const db = require('../config/db');

class EnterpriseXUserModel {

    constructor(idUser = null, idEnterprise = null, isActive = null, idRole = null) {
        this.idUser = idUser;
        this.idEnterprise = idEnterprise;
        this.isActive = isActive;
        this.idRole = idRole;
    }

    getUserAndEnterpriseByEmail(email) {
        const sql = `select exu.idUser, exu.idEnterprise, exu.isActive from enterpriseXuser as exu
                     inner join user as u on u.idUser = exu.idUser
                     where u.email = ? ;`;

        return db.execute(sql, [email]);
    }

    getUserAndEnterprise(idUser, idEnterprise) {
        const sql = `select idUser, idEnterprise, isActive from enterpriseXuser
                     where idUser = ? and idEnterprise = ? ;`;

        return db.execute(sql, [idUser, idEnterprise]);
    }

    insertUserXEnterprise(idUser, idEnterprise) {
        const sql = `insert into enterpriseXuser (idUser, idEnterprise, idRole) values (?, ?, (SELECT idRole FROM role WHERE name = 'Employee'));`;

        return db.execute(sql, [idUser, idEnterprise]);
    }
}

module.exports = EnterpriseXUserModel;
