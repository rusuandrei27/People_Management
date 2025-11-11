const serviceName = "RevenueService.js";
const RevenueModel = require('../model/RevenueModel');
const ServiceResponse = require('./ServiceResponse');
const DateService = require('../service/DateService');

class RevenueService {
    constructor() {
        this.RevenueModel = new RevenueModel();
    }

    async getRevenues(idEnterpriseXuser, startDate, endDate) {
        if (!idEnterpriseXuser) {
            return ServiceResponse.fail("Invalid enterprise or user!");
        }

        if (!startDate || !endDate) {
            return ServiceResponse.fail("Please complete analysis interval!");
        }

        startDate = DateService.convertISODateToMySQL(startDate);
        endDate = DateService.convertISODateToMySQL(endDate);

        try {
            const revenues = await this.RevenueModel.getRevenues(idEnterpriseXuser, startDate, endDate);

            if (revenues && revenues.length > 0 && revenues[0] && revenues[0].length > 0) {
                return ServiceResponse.success(revenues[0]);
            }

            return ServiceResponse.success();

        } catch (error) {
            log(serviceName, "Error occured extracting revenues: " + JSON.stringify(error.message));
            return ServiceResponse.fail("Invalid enterprise or user!");
        }
    }

    async insertRevenue(revenue) {
        if (!revenue) {
            return ServiceResponse.fail("Invalid revenue insert data!");
        }

        const startDate = revenue.startDate ? revenue.startDate : null;
        const endDate = revenue.endDate ? revenue.endDate : null;
        const idEnterpriseXuser = revenue.idEnterpriseXuser ? revenue.idEnterpriseXuser : null;

        if (!startDate || !endDate) {
            return ServiceResponse.fail("Invalid interval! Please complete start and end dates!");
        }

        if (!idEnterpriseXuser) {
            return ServiceResponse.fail("Your session is no longer active! Please log in again!");
        }

        revenue.startDate = DateService.convertISODateToMySQL(startDate);
        revenue.endDate = DateService.convertISODateToMySQL(endDate);

        try {
            const insertedRevenue = await this.RevenueModel.insertRevenue(revenue);
            if (insertedRevenue && insertedRevenue.length > 0 && insertedRevenue[0] && insertedRevenue[0].insertId) {
                return ServiceResponse.success(insertedRevenue);
            }

            return ServiceResponse.fail("Revenue could not be inserted. Please try again!");

        } catch (error) {
            log(serviceName, "Error occured inserting revenue with revenueData: " + JSON.stringify(revenue) + " | error: " + JSON.stringify(error.message));
            return ServiceResponse.fail("Invalid user informations!");
        }
    }
}

module.exports = new RevenueService();
