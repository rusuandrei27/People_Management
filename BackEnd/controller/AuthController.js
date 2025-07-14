const AuthService = require('../service/AuthService');
console.log(AuthService)

class AuthController {
    async register(req, res) {
        try {
            const { firstName, lastName, email, phone, password } = req.body;
            await AuthService.register(firstName, lastName, email, phone, password);
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
}



// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const token = await authService.login(email, password);
//         res.json({ token });
//     } catch (error) {
//         res.status(401).json({ error: error.message });
//     }
// };

const authController = new AuthController();
module.exports = authController;
