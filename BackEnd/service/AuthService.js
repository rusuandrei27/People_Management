const bcrypt = require('bcrypt');
const UserModel = require('../model/UserModel');
const EnterpriseXUserModel = require('../model/EnterpriseXUserModel');

class AuthService {
    constructor() {
        this.enterpriseXUserModel = new EnterpriseXUserModel();
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

    async getUserAndEnterprise(idUser, idEnterprise) {
        if (!idUser || !idEnterprise) {
            return new Error("User or email invalid!");
        }
        const userAndEnterprise = await this.enterpriseXUserModel.findUserAndEnterprise(idUser, idEnterprise);

        if (userAndEnterprise && userAndEnterprise.length > 0 && userAndEnterprise[0] && userAndEnterprise[0].length > 0) {
            return userAndEnterprise[0];
        }
    }

    async getUserAndEnterpriseByEmail(email) {
        if (!email) {
            return new Error("User invalid!");
        }
        const userAndEnterpriseByIdUser = await this.enterpriseXUserModel.findUserAndEnterpriseByEmail(email);

        if (userAndEnterpriseByIdUser && userAndEnterpriseByIdUser.length > 0 && userAndEnterpriseByIdUser[0] && userAndEnterpriseByIdUser[0].length > 0) {
            return userAndEnterpriseByIdUser[0];
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

    async assignUserToEnterprise(userData) {
        const { idUser, idEnterprise } = userData;
        if (!idUser) { throw new Error('Invalid user!'); }
        if (!idEnterprise) { throw new Error('Invalid enterprise!'); }

        const insertedUserEnterpriseLink = await this.enterpriseXUserModel.insertUserToEnterprise(idUser, idEnterprise);
        if (!insertedUserEnterpriseLink || insertedUserEnterpriseLink.length < 1 || !insertedUserEnterpriseLink[0] || !insertedUserEnterpriseLink[0].insertId) {
            return new Error("User can not be associated to the enterprise. PLease try again!");
        }

        return insertedUserEnterpriseLink;
    }
}

module.exports = new AuthService();
