const db = require('../config/db');

class EnterpriseXUserModel {

    // async findUserAndEnterpriseByEmail(email, idEnterprise) {
    //     const sql = `select exu.idUser, exu.idEnterprise, exu.isActive from enterpriseXuser as eXu
    //                  inner join user as u on u.idUser = eXu.idUser
    //                  where u.email = ? and eXu.idEnterprise = ? ;`;

    //     return await db.execute(sql, [email, idEnterprise]);
    // }

    // async findUserAndEnterpriseByPhone(phone, idEnterprise) {
    //     const sql = `select exu.idUser, exu.idEnterprise, exu.isActive from enterpriseXuser as eXu
    //                  inner join user as u on u.idUser = eXu.idUser
    //                  where u.phone = ? and eXu.idEnterprise = ? ;`;

    //     return await db.execute(sql, [phone, idEnterprise]);
    // }

    async findUserAndEnterpriseByEmail(email) {
        const sql = `select exu.idUser, exu.idEnterprise, exu.isActive from enterpriseXuser as exu
                     inner join user as u on u.idUser = exu.idUser
                     where u.email = ? ;`;

        return await db.execute(sql, [email]);
    }

    async findUserAndEnterprise(idUser, idEnterprise) {
        const sql = `select idUser, idEnterprise, isActive from enterpriseXuser
                     where idUser = ? and idEnterprise = ? ;`;

        return await db.execute(sql, [idUser, idEnterprise]);
    }

    async insertUserToEnterprise(idUser, idEnterprise) {
        const sql = `insert into enterpriseXuser (idUser, idEnterprise, idRole) values (?, ?, (SELECT idRole FROM role WHERE name = 'Employee'));`;

        return await db.execute(sql, [idUser, idEnterprise]);
    }

}

module.exports = EnterpriseXUserModel;
