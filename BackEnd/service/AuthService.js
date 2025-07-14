const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../model/UserModel');
const EmailService = require('./EmailService');

const jwtSecret = process.env.JWT_SECRET;

class AuthService {
    async register(firstName, lastName, email, phone, password) {
        if (!firstName) { throw new Error('Invalid first name!'); }
        if (!lastName) { throw new Error('Invalid last name!'); }
        if (!email) { throw new Error('Invalid email!'); }
        if (!phone) { throw new Error('Invalid phone!'); }
        if (!password) { throw new Error('Invalid password!'); }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userModel = new UserModel(firstName, lastName, email, phone, hashedPassword);

        let existingUser = await userModel.findUserByEmail();
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        existingUser = await userModel.findUserByPhone();
        if (existingUser) {
            throw new Error('User with this phone already exists');
        }

        const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

        EmailService.sendMail(email, otp);



        // const userId = await userModel.createUser();
        return userId;
    };

    // async login(email, password) {
    //     const user = await userModel.findUserByEmail(email);
    //     if (!user) {
    //         throw new Error('User not found');
    //     }

    //     const passwordMatch = await bcrypt.compare(password, user.password);
    //     if (!passwordMatch) {
    //         throw new Error('Invalid credentials');
    //     }

    //     const token = jwt.sign(
    //         { id: user.id, email: user.email, name: user.name },
    //         jwtSecret,
    //         { expiresIn: '1h' }
    //     );

    //     return token;
    // };

    verifyToken(token) {
        return jwt.verify(token, jwtSecret);
    };

}

module.exports = new AuthService();
