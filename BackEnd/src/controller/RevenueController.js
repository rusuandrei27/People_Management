const scriptName = "RevenueController.js";
const RevenueService = require('../service/RevenueService');

class RevenueController {
    async getRevenues(req, res) {
        try {
            log(scriptName, "Function 'getRevenues' | Started with query: " + JSON.stringify(req.query));

            let { idEnterpriseXuser, startDate, endDate } = req.query;

            if (!idEnterpriseXuser) {
                return res.status(400).json({ error: "Invalid enterprise or user!" });
            }

            if (!startDate) {
                return res.status(400).json({ error: "Invalid startDate!" });
            }

            if (!endDate) {
                return res.status(400).json({ error: "Invalid endDate!" });
            }

            try {
                startDate = decodeURIComponent(startDate);
                endDate = decodeURIComponent(endDate);

            } catch (error) {
                log(scriptName, "Function 'getRevenues' | " + JSON.stringify(req.query) + " | dates are already decoded by the framework | error: " + JSON.stringify(error.message));
            }

            startDate = new Date(startDate).toISOString();
            endDate = new Date(endDate).toISOString();

            if (!startDate || !endDate || (new Date(startDate) > new Date(endDate))) {
                log(scriptName, "Function 'getRevenues' | " + JSON.stringify(req.query) + " | dates are not in correct format | startDate: " + JSON.stringify(startDate) + " | endDate: " + JSON.stringify(endDate));
                return res.status(400).json({ error: "Invalid analysis interval!" });
            }

            const revenues = await RevenueService.getRevenues(idEnterpriseXuser, startDate, endDate);
            if (!revenues || revenues.error || !revenues.data) {
                log(scriptName, "Function 'getRevenues' | query: " + JSON.stringify(req.query) + " | revenues is not defined or responded with error");
                return res.status(400).json({ error: revenues.error ? revenues.error : "Server could not be reached in order to display revenues. Try again later!" });
            }

            log(scriptName, "Function 'getRevenues' | Ended successfully with query: " + JSON.stringify(req.query));
            res.status(200).json(revenues.data);

        } catch (error) {
            log(scriptName, "Function 'getRevenues' | " + JSON.stringify(req.query) + " | ended in error: " + JSON.stringify(error.message));
            return res.status(500).json({ error: "Server could not be reached in order to display revenues. Try again later!" });
        }
    };

    async insertRevenue(req, res) {
        try {
            log(scriptName, "Function 'insertRevenue' | Started with body: " + JSON.stringify(req.body));

            let { startDate, endDate, idEnterpriseXuser } = req.body;

            if (!startDate) {
                return res.status(400).json({ error: "Invalid startDate!" });
            }

            if (!endDate) {
                return res.status(400).json({ error: "Invalid endDate!" });
            }

            if (!idEnterpriseXuser) {
                return res.status(400).json({ error: "Invalid session! Please log in again!" });
            }

            try {
                startDate = decodeURIComponent(startDate);
                endDate = decodeURIComponent(endDate);

            } catch (error) {
                log(scriptName, "Function 'insertRevenue' | " + JSON.stringify(req.query) + " | dates are already decoded by the framework | error: " + JSON.stringify(error.message));
            }

            startDate = new Date(startDate).toISOString();
            endDate = new Date(endDate).toISOString();

            if (!startDate || !endDate || (new Date(startDate) > new Date(endDate))) {
                log(scriptName, "Function 'insertRevenue' | " + JSON.stringify(req.query) + " | dates are not in correct format | startDate: " + JSON.stringify(startDate) + " | endDate: " + JSON.stringify(endDate));
                return res.status(400).json({ error: "Invalid interval!" });
            }

            // save in req.body the decoded ISO Strings:
            req.body.startDate = startDate;
            req.body.endDate = endDate;

            log(scriptName, "Function 'insertRevenue' | all validations passed - begin inserting revenue | " + JSON.stringify(req.body));
            const insertedRevenueInfo = await RevenueService.insertRevenue(req.body);

            if (!insertedRevenueInfo || insertedRevenueInfo.error || !insertedRevenueInfo.data) {
                log(scriptName, "Function 'insertRevenue' | revenue could not be inserted | " + JSON.stringify(req.body) + " | insertedRevenueInfo: " + JSON.stringify(insertedRevenueInfo));
                return res.status(500).json({ error: insertedRevenueInfo.error ? insertedRevenueInfo.error : 'Revenue could not be inserted! Try again later!' });
            }

            log(scriptName, "Function 'insertRevenue' | Ended successfully with body: " + JSON.stringify(req.body));
            return res.status(200).json({ "idRevenue": insertedRevenueInfo.data[0].insertId });

        } catch (error) {
            log(scriptName, "Function 'insertRevenue' | " + JSON.stringify(req.body) + " | ended in error: " + JSON.stringify(error.message));
            return res.status(500).json({ error: "The service could not be reached at this moment. Please try again later!" });
        }
    }

    async updateRevenue(req, res) {
        try {
            log(scriptName, "Function 'updateRevenue' | Started with body: " + JSON.stringify(req.body));

            let { idRevenue, revenue } = req.body;

            if (!idRevenue) {
                return res.status(400).json({ error: "Invalid revenue identifier!" });
            }

            if (!revenue || Object.keys(revenue).length < 1) {
                return res.status(400).json({ error: "Invalid revenue values!" });
            }

            log(scriptName, "Function 'updateRevenue' | all validations passed - begin updating revenue | " + JSON.stringify(req.body));
            const updatedRevenueInfo = await RevenueService.updateRevenue(revenue, idRevenue);

            if (!updatedRevenueInfo || updatedRevenueInfo.error || !updatedRevenueInfo.data) {
                log(scriptName, "Function 'updateRevenue' | revenue could not be updated | " + JSON.stringify(req.body) + " | updatedRevenueInfo: " + JSON.stringify(updatedRevenueInfo));
                return res.status(500).json({ error: updatedRevenueInfo.error ? updatedRevenueInfo.error : 'Revenue could not be updated! Try again later!' });
            }

            log(scriptName, "Function 'updateRevenue' | Ended successfully with body: " + JSON.stringify(req.body));
            return res.status(200).json(updatedRevenueInfo.data);

        } catch (error) {
            log(scriptName, "Function 'updateRevenue' | " + JSON.stringify(req.body) + " | ended in error: " + JSON.stringify(error.message));
            return res.status(500).json({ error: "The service could not be reached at this moment. Please try again later!" });
        }
    }
}

module.exports = new RevenueController();
