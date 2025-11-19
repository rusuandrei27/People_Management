const db = require('../config/db');

class RoleModel {

    constructor(name = null) {
        this.name = name;
    }

    getAllRoles() {
        const sql = `select idRole, name from role
                     order by idRole asc`;

        return db.execute(sql);
    }
}

module.exports = RoleModel;
