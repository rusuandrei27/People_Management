const bcrypt = require('bcrypt');
const UserModel = require('../model/UserModel');

const jwtSecret = process.env.JWT_SECRET;

class AuthService {
    constructor() {
        this.userModel = new UserModel();
    }

    async getUserByEmail(email) {
        if (!email) {
            return new Error("User email is not valid!");
        }

        const userByEmail = await this.userModel.findUserByEmail(email);

        if (userByEmail && userByEmail.length > 0 && userByEmail[0] && userByEmail[0].length > 0) {
            return userByEmail[0];
        }
    }

    async getUserByPhone(phone) {
        if (!phone) {
            return new Error("User phone is not valid!");
        }

        const userByPhone = await this.userModel.findUserByPhone(phone);

        if (userByPhone && userByPhone.length > 0 && userByPhone[0] && userByPhone[0].length > 0) {
            return userByPhone[0];
        }
    }

    async insertUser(userData) {
        const { firstName, lastName, email, phone, password } = userData;
        if (!firstName) { throw new Error('Invalid first name!'); }
        if (!lastName) { throw new Error('Invalid last name!'); }
        if (!email) { throw new Error('Invalid email!'); }
        if (!phone) { throw new Error('Invalid phone!'); }
        if (!password) { throw new Error('Invalid password!'); }

        const hashedPassword = await bcrypt.hash(password, 10);
        userData.password = hashedPassword;

        return await this.userModel.insertUser(userData);
    }
}

module.exports = new AuthService();
