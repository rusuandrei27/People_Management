const scriptName = "GetItemsController.js";
const GetItemsService = require('../service/GetItemsService');

class GetItemsController {
    async getAllEnterprises(req, res) {
        try {
            const enterprises = await GetItemsService.getAllEnterprises();

            if (!enterprises) {
                log(scriptName, "'enterprises' object is not defined");
                return res.status(400).json({ error: "There are no available enterprises!" });
            }

            if (enterprises.error) {
                log(scriptName, "Error was encountered during enterprises select: " + JSON.stringify(enterprises.error));
                return res.status(400).json({ error: enterprises.error });
            }

            if (!enterprises.data || enterprises.data.length < 1) {
                log(scriptName, "There are no available enterprises!");
                return res.status(400).json({ error: "There are no available enterprises!" });
            }

            log(scriptName, "Enterprises successfully found: " + JSON.stringify(enterprises.data));
            return res.status(200).json(enterprises.data);

        } catch (error) {
            log(scriptName, "Script finished in error:  " + JSON.stringify(error.message));
            res.status(400).json({ error: error.message });
        }
    };

    async getAllRoles(req, res) {
        try {
            const roles = await GetItemsService.getAllRoles();

            if (!roles) {
                log(scriptName, "'roles' object is not defined");
                return res.status(400).json({ error: "There are no available roles!" });
            }

            if (roles.error) {
                log(scriptName, "Error was encountered during roles select: " + JSON.stringify(roles.error));
                return res.status(400).json({ error: roles.error });
            }

            if (!roles.data || roles.data.length < 1) {
                log(scriptName, "There are no available roles!");
                return res.status(400).json({ error: "There are no available roles!" });
            }

            log(scriptName, "Roles successfully found: " + JSON.stringify(roles.data));
            return res.status(200).json(roles.data);

        } catch (error) {
            log(scriptName, "Script finished in error:  " + JSON.stringify(error.message));
            res.status(400).json({ error: error.message });
        }
    };
}

module.exports = new GetItemsController();
