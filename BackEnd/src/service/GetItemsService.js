const scriptName = "GetItemsService.js";
const ServiceResponse = require('./ServiceResponse');
const EnterpriseModel = require('../model/EnterpriseModel');

class GetItemsService {
    constructor() {
        this.EnterpriseModel = new EnterpriseModel();
    }

    async getAllEnterprises() {
        try {
            const enterprises = await this.EnterpriseModel.getAllEnterprises();

            if (enterprises && enterprises.length > 0 && enterprises[0] && enterprises[0].length > 0) {
                return ServiceResponse.success(enterprises[0]);
            }

            return ServiceResponse.fail("No available enterprises!");

        } catch (error) {
            log(scriptName, "Error encountered when extracting enterprises: " + JSON.stringify(error.message));
            return ServiceResponse.fail("Error extracting enterprises!");
        }
    }
}

module.exports = new GetItemsService();
