const db = require('../config/db');

class EnterpriseXUserModel {

    constructor(connection = null, idUser = null, idEnterprise = null, isActive = null, idRole = null) {
        this.idUser = idUser;
        this.idEnterprise = idEnterprise;
        this.isActive = isActive;
        this.idRole = idRole;
        this.connection = connection ? connection : db;
    }

    getUserAndEnterpriseByEmail(email) {
        const sql = `select exu.idEnterpriseXuser, exu.idUser, exu.idEnterprise, exu.isActive, a.street, a.streetNo, c.name as cityName, r.name as roleName, u.firstName from enterpriseXuser as exu
                     inner join user as u on u.idUser = exu.idUser
                     left join role as r on r.idRole = exu.idRole
                     left join enterprise as e on e.idEnterprise = exu.idEnterprise
                     left join address as a on a.idAddress = e.idAddress
                     left join city as c on c.idCity = a.idCity
                     where u.email = ? ;`;

        return this.connection.execute(sql, [email]);
    }

    getUserAndEnterprise(idUser, idEnterprise) {
        const sql = `select idUser, idEnterprise, isActive from enterpriseXuser
                     where idUser = ? and idEnterprise = ? ;`;

        return this.connection.execute(sql, [idUser, idEnterprise]);
    }

    getUsersFromEnterprise(idEnterprise) {
        const sql = `select exu.idUser, exu.idEnterprise, exu.isActive, exu.idEnterpriseXuser, u.firstName, u.lastName, r.idRole, r.name as roleName, uc.revenuePercentage, uc.clientDeduction, uc.employmentContractDeduction from enterpriseXuser as exu
                     inner join user as u on u.idUser = exu.idUser
                     left join role as r on r.idRole = exu.idRole
                     left join userConfiguration as uc on uc.idUserConfiguration = exu.idUserConfiguration
                     where idEnterprise = ?;`;

        return this.connection.execute(sql, [idEnterprise]);
    }

    getUserConfigurationFromEnterpriseXUser(idEnterpriseXuser) {
        const sql = `select exu.idEnterpriseXuser, uc.idUserConfiguration, uc.revenuePercentage, uc.clientDeduction, uc.employmentContractDeduction from enterpriseXuser as exu
                     inner join userConfiguration as uc on uc.idUserConfiguration = exu.idUserConfiguration
                     where idEnterpriseXuser = ?;`;

        return this.connection.execute(sql, [idEnterpriseXuser]);
    }

    insertUserXEnterprise(idUser, idEnterprise, isActive) {
        const sql = `insert into enterpriseXuser (idUser, idEnterprise, isActive, idRole) values (?, ?, ?, (SELECT idRole FROM role WHERE name = 'Employee'));`;

        return this.connection.execute(sql, [idUser, idEnterprise, isActive]);
    }

    updateUserXEnterprise(updateData, idEnterpriseXuser) {
        const sql = `update enterpriseXuser set ? where idEnterpriseXuser = ?`

        return this.connection.query(sql, [updateData, idEnterpriseXuser]);
    }
}

module.exports = EnterpriseXUserModel;
