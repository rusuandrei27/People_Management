const scriptName = "UserConfigurationController.js";
const EnterpriseXUserService = require('../service/EnterpriseXUserService');
const UserService = require('../service/UserService');


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

    async updateUserFull(req, res) {
        try {
            log(scriptName, "Function 'updateUserFull' | Started with body: " + JSON.stringify(req.body));

            let { idUser, idEnterpriseXuser } = req.body;

            if (!idUser) {
                return res.status(400).json({ error: "Invalid user identifier!" });
            }

            if (!idEnterpriseXuser) {
                return res.status(400).json({ error: "Invalid enterprise identifier!" });
            }

            log(scriptName, "Function 'updateUserFull' | all validations passed - begin updating user | " + JSON.stringify(req.body));
            const updatedUser = await UserService.updateUserFull(req.body);

            if (!updatedUser || updatedUser.error || !updatedUser.data) {
                log(scriptName, "Function 'updateUserFull' | user could not be updated | " + JSON.stringify(req.body) + " | updatedUser: " + JSON.stringify(updatedUser));
                return res.status(500).json({ error: updatedUser.error ? updatedUser.error : 'Revenue could not be updated! Try again later!' });
            }

            log(scriptName, "Function 'updateUserFull' | Ended successfully with body: " + JSON.stringify(req.body));
            return res.status(200).json(updatedUser.data);

        } catch (error) {
            log(scriptName, "Function 'updateUserFull' | " + JSON.stringify(req.body) + " | ended in error: " + JSON.stringify(error.message));
            return res.status(500).json({ error: "The service could not be reached at this moment. Please try again later!" });
        }
    }
}

module.exports = new UserConfigurationController();
