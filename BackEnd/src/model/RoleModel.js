const db = require('../config/db');

class RoleModel {

    constructor(connection = null, name = null) {
        this.name = name;
        this.connection = connection ? connection : db;
    }

    getAllRoles() {
        const sql = `select idRole, name from role
                     order by idRole asc`;

        return this.connection.execute(sql);
    }
}

module.exports = RoleModel;
