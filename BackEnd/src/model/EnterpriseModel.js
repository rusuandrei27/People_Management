const db = require('../config/db');

class EnterpriseModel {

    constructor(connection = null, name = null, idAddress = null, idEnterprise_type = null) {
        this.name = name;
        this.idAddress = idAddress;
        this.idEnterprise_type = idEnterprise_type;
        this.connection = connection ? connection : db;
    }

    getAllEnterprises() {
        const sql = `select e.idEnterprise, e.name, a.street from enterprise as e
                     inner join address as a on a.idAddress = e.idAddress;`;

        return this.connection.execute(sql);
    }
}

module.exports = EnterpriseModel;
