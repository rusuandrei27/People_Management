const EnterpriseModel = require('../model/EnterpriseModel');


class GetItemsService {
    constructor() {
        this.enterpriseModel = new EnterpriseModel();
    }

    async getAllEnterprises() {

        const enterprises = await this.enterpriseModel.getAllEnterprises();

        if (enterprises && enterprises.length > 0 && enterprises[0] && enterprises[0].length > 0) {
            return enterprises[0];
        }
    }
}

module.exports = new GetItemsService();
