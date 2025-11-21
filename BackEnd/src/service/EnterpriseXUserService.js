const serviceName = "EnterpriseXUserService.js";
const EnterpriseXUserModel = require('../model/EnterpriseXUserModel');
const ServiceResponse = require('./ServiceResponse');

class EnterpriseXUserService {
    constructor() {
        this.EnterpriseXUserModel = new EnterpriseXUserModel();
    }

    async getUserAndEnterprise(idUser, idEnterprise) {
        if (!idUser || !idEnterprise) {
            return ServiceResponse.fail("Invalid user or enterprise!");
        }

        try {
            const userAndEnterprise = await this.EnterpriseXUserModel.getUserAndEnterprise(idUser, idEnterprise);

            if (userAndEnterprise && userAndEnterprise.length > 0 && userAndEnterprise[0] && userAndEnterprise[0].length > 0) {
                return ServiceResponse.success(userAndEnterprise[0]);
            }

            return ServiceResponse.success();

        } catch (error) {
            log(serviceName, "Error occured extracting user and enterprise: " + JSON.stringify(error.message));
            return ServiceResponse.fail("Invalid user or enterprise!");
        }
    }

    async getUserAndEnterpriseByEmail(email) {
        if (!email) {
            return ServiceResponse.fail("Invalid email");
        }

        try {
            const userAndEnterpriseByIdUser = await this.EnterpriseXUserModel.getUserAndEnterpriseByEmail(email);

            if (userAndEnterpriseByIdUser && userAndEnterpriseByIdUser.length > 0 && userAndEnterpriseByIdUser[0] && userAndEnterpriseByIdUser[0].length > 0) {
                return ServiceResponse.success(userAndEnterpriseByIdUser[0]);
            }

            return ServiceResponse.success();

        } catch (e) {
            log(serviceName, "Error occured extracting user and enterprise by email: " + JSON.stringify(error.message));
            return ServiceResponse.fail("Invalid email!");
        }
    }

    async getUsersFromEnterprise(idEnterprise) {
        if (!idEnterprise) {
            return ServiceResponse.fail("Invalid enterprise");
        }

        try {
            const usersFromEnterprise = await this.EnterpriseXUserModel.getUsersFromEnterprise(idEnterprise);

            if (usersFromEnterprise && usersFromEnterprise.length > 0 && usersFromEnterprise[0] && usersFromEnterprise[0].length > 0) {
                return ServiceResponse.success(usersFromEnterprise[0]);
            }

            return ServiceResponse.success();

        } catch (e) {
            log(serviceName, "Error occured extracting users from enterprise: " + JSON.stringify(error.message));
            return ServiceResponse.fail("Invalid enterprise!");
        }
    }

    async insertUserXEnterprise(userData) {
        if (!userData) {
            return ServiceResponse.fail("Invalid user informations!");
        }

        let { idUser, idEnterprise, isActive } = userData;
        if (!idUser) { return ServiceResponse.fail("Invalid user!"); }
        if (!idEnterprise) { return ServiceResponse.fail("Invalid enterprise!"); }
        isActive = isActive && (isActive == "1" || isActive == true) ? "1" : "0";

        try {
            const insertedUserEnterprise = await this.EnterpriseXUserModel.insertUserXEnterprise(idUser, idEnterprise, isActive);
            if (insertedUserEnterprise && insertedUserEnterprise.length > 0 && insertedUserEnterprise[0] && insertedUserEnterprise[0].insertId) {
                return ServiceResponse.success(insertedUserEnterprise);
            }

            return ServiceResponse.fail("User can not be associated to the enterprise. PLease try again!");

        } catch (error) {
            log(serviceName, "Error occured assigning user and enterprise for idUser: " + JSON.stringify(idUser) + " | and email: " + JSON.stringify(email) + " | error: " + JSON.stringify(error.message));
            return ServiceResponse.fail("User can not be assiged to this enterprise!");
        }
    }
}

module.exports = new EnterpriseXUserService();
