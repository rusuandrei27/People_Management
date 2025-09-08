const GetItemsService = require('../service/GetItemsService');

class GetItemsController {
    async getAllEnterprises(req, res) {
        try {
            const enterprises = await GetItemsService.getAllEnterprises();
            if (enterprises && enterprises.length > 0) {
                return res.status(200).json(enterprises);
            }

            return res.status(400).json({ error: "There are no available enterprises!" });;
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
}

module.exports = new GetItemsController();
