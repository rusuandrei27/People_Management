const db = require('../config/db');

class UserConfigurationModel {

    constructor(connection = null, revenuePercentage = null, clientDeduction = null, employmentContractDeduction) {
        this.revenuePercentage = revenuePercentage;
        this.clientDeduction = clientDeduction;
        this.employmentContractDeduction = employmentContractDeduction;
        this.connection = connection ? connection : db;
    }

    insertUserConfiguration(userConfiguration) {
        const { revenuePercentage, clientDeduction, employmentContractDeduction } = userConfiguration;
        const sql = `insert into userConfiguration (revenuePercentage, clientDeduction, employmentContractDeduction) values (?, ?, ?);`;

        return this.connection.execute(sql, [revenuePercentage ?? null, clientDeduction ?? null, employmentContractDeduction ?? null]);
    }

    updateUserConfiguration(updateData, idUserConfiguration) {
        const sql = `update userConfiguration set ? where idUserConfiguration = ?`

        return this.connection.query(sql, [updateData, idUserConfiguration]);
    }
}

module.exports = UserConfigurationModel;
