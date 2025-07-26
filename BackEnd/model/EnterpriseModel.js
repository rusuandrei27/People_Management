const db = require('../config/db');

class EnterpriseModel {

    async getAllEnterprises() {
        const sql = `
            SELECT e.idEnterprise, e.name, a.street FROM enterprise as e
            INNER JOIN address as a on a.idAddress = e.idAddress
        `;
        return await db.execute(sql);
    }
}

module.exports = EnterpriseModel;
