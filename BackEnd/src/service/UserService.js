const serviceName = "UserService.js";
const bcrypt = require('bcrypt');
const UserModel = require('../model/UserModel');
const ServiceResponse = require('./ServiceResponse');

class UserService {
    constructor() {
        this.UserModel = new UserModel();
    }

    async getUserByEmail(email) {
        if (!email) {
            return ServiceResponse.fail("Invalid email!");
        }

        try {
            const userByEmail = await this.UserModel.getUserByEmail(email);

            if (userByEmail && userByEmail.length > 0 && userByEmail[0] && userByEmail[0].length > 0) {
                return ServiceResponse.success(userByEmail[0]);
            }

            return ServiceResponse.success([]);

        } catch (error) {
            log(serviceName, "Error occured extracting user by email: " + JSON.stringify(error.message));
            return ServiceResponse.fail("Invalid email!");
        }
    }

    async getUserByPhone(phone) {
        if (!phone) {
            return ServiceResponse.fail("Invalid phone!");
        }

        try {
            const userByPhone = await this.UserModel.getUserByPhone(phone);

            if (userByPhone && userByPhone.length > 0 && userByPhone[0] && userByPhone[0].length > 0) {
                return ServiceResponse.success(userByPhone[0]);
            }

            return ServiceResponse.success([]);

        } catch (error) {
            log(serviceName, "Error occured extracting user by phone: " + JSON.stringify(error.message));
            return ServiceResponse.fail("Invalid phone!");
        }
    }

    async insertUser(userData) {
        if (!userData) {
            return ServiceResponse.fail("Invalid userData!");
        }

        const { firstName, lastName, email, phone, password } = userData;
        if (!firstName) { return ServiceResponse.fail("Invalid firstName!"); }
        if (!lastName) { return ServiceResponse.fail("Invalid lastName!"); }
        if (!email) { return ServiceResponse.fail("Invalid email!"); }
        if (!phone) { return ServiceResponse.fail("Invalid phone!"); }
        if (!password) { return ServiceResponse.fail("Invalid password!"); }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            userData.password = hashedPassword;

            const insertedUser = await this.UserModel.insertUser(userData);
            if (!insertedUser || insertedUser.length < 1 || !insertedUser[0] || !insertedUser[0].insertId) {
                return ServiceResponse.fail("User could not be inserted. PLease try again!");
            }

            return ServiceResponse.success(insertedUser);

        } catch (error) {
            log(serviceName, "Error occured inserting user with userData: " + JSON.stringify(userData) + " | error: " + JSON.stringify(error.message));
            return ServiceResponse.fail("Invalid phone!");
        }
    }
}

module.exports = new UserService();
