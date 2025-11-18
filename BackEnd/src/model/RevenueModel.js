const db = require('../config/db');

class RevenueModel {

    constructor(startDate = null, endDate = null, cash = 0, card = 0, nbClients = 0, note = null, isActive = true, idEnterpriseXuser = null) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.cash = cash;
        this.card = card;
        this.nbClients = nbClients;
        this.note = note;
        this.isActive = isActive;
        this.idEnterpriseXuser = idEnterpriseXuser;
    }

    getRevenues(idEnterpriseXuser, startDate, endDate) {
        const sql = `select idRevenue, startDate, endDate, cash, card, nbClients, note, isActive from revenue
                     where idEnterpriseXuser = ? and Date(startDate) >= Date(?) and Date(endDate) <= Date(?)
                     order by startDate desc;`;

        return db.execute(sql, [idEnterpriseXuser, startDate, endDate]);
    }

    insertRevenue(revenueData) {
        const { startDate, endDate, cash, card, nbClients, note, isActive, idEnterpriseXuser } = revenueData;
        const sql = `insert into revenue (startDate, endDate, cash, card, nbClients, note, isActive, idEnterpriseXuser)
                     values (?, ?, ?, ?, ?, ?, ?, ?)`;

        return db.execute(sql, [startDate, endDate, cash, card, nbClients, note, isActive, idEnterpriseXuser]);
    }

    updateRevenue(updateObj, idRevenue) {
        const sql = `update revenue set ? where idRevenue = ?`;

        return db.query(sql, [updateObj, idRevenue]);
    }
}

module.exports = RevenueModel;
