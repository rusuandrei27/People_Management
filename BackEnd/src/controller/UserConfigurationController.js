const scriptName = "UserConfigurationController.js";
const EnterpriseXUserService = require('../service/EnterpriseXUserService');


class UserConfigurationController {

    async getUsersFromEnterprise(req, res) {
        try {
            log(scriptName, "Function 'getUsersFromEnterprise' | Started with query: " + JSON.stringify(req.query));

            let { idEnterprise } = req.query;

            if (!idEnterprise) {
                return res.status(400).json({ error: "Invalid enterprise!" });
            }

            const usersFromEnterprise = await EnterpriseXUserService.getUsersFromEnterprise(idEnterprise);
            if (!usersFromEnterprise || usersFromEnterprise.error || !usersFromEnterprise.data) {
                log(scriptName, "Function 'getUsersFromEnterprise' | query: " + JSON.stringify(req.query) + " | usersFromEnterprise is not defined or responded with error");
                return res.status(400).json({ error: usersFromEnterprise.error ? usersFromEnterprise.error : "Server could not be reached in order to display users. Try again later!" });
            }

            log(scriptName, "Function 'usersFromEnterprise' | Ended successfully with query: " + JSON.stringify(req.query));
            res.status(200).json(usersFromEnterprise.data);

        } catch (error) {
            log(scriptName, "Function 'usersFromEnterprise' | " + JSON.stringify(req.query) + " | ended in error: " + JSON.stringify(error.message));
            return res.status(500).json({ error: "Server could not be reached in order to display revenues. Try again later!" });
        }
    }

}

module.exports = new UserConfigurationController();
