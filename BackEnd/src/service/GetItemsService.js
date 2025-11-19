const scriptName = "GetItemsService.js";
const ServiceResponse = require('./ServiceResponse');
const EnterpriseModel = require('../model/EnterpriseModel');
const RoleModel = require('../model/RoleModel');


class GetItemsService {
    constructor() {
        this.EnterpriseModel = new EnterpriseModel();
        this.RoleModel = new RoleModel();
    }

    async getAllEnterprises() {
        try {
            const enterprises = await this.EnterpriseModel.getAllEnterprises();

            if (enterprises && enterprises.length > 0 && enterprises[0] && enterprises[0].length > 0) {
                return ServiceResponse.success(enterprises[0]);
            }

            return ServiceResponse.fail("No available enterprises!");

        } catch (error) {
            log(scriptName, "Error encountered extracting enterprises: " + JSON.stringify(error.message));
            return ServiceResponse.fail("Error extracting enterprises!");
        }
    }

    async getAllRoles() {
        try {
            const roles = await this.RoleModel.getAllRoles();

            if (roles && roles.length > 0 && roles[0] && roles[0].length > 0) {
                return ServiceResponse.success(roles[0]);
            }

            return ServiceResponse.fail("No available roles!");

        } catch (error) {
            log(scriptName, "Error encountered extracting roles: " + JSON.stringify(error.message));
            return ServiceResponse.fail("Error extracting roles!");
        }
    }
}

module.exports = new GetItemsService();
