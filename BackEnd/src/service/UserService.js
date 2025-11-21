const serviceName = "UserService.js";
const bcrypt = require('bcrypt');
const UserModel = require('../model/UserModel');
const EnterpriseXUserModel = require('../model/EnterpriseXUserModel');
const UserConfigurationModel = require('../model/UserConfigurationModel');
const ServiceResponse = require('./ServiceResponse');
const db = require('../config/db');

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

            return ServiceResponse.success();

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

            return ServiceResponse.success();

        } catch (error) {
            log(serviceName, "Error occured extracting user by phone: " + JSON.stringify(error.message));
            return ServiceResponse.fail("Invalid phone!");
        }
    }

    async insertUser(userData) {
        if (!userData) {
            return ServiceResponse.fail("Invalid user informations!");
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
            if (insertedUser && insertedUser.length > 0 && insertedUser[0] && insertedUser[0].insertId) {
                return ServiceResponse.success(insertedUser);
            }

            return ServiceResponse.fail("User could not be inserted. PLease try again!");

        } catch (error) {
            log(serviceName, "Error occured inserting user with userData: " + JSON.stringify(userData) + " | error: " + JSON.stringify(error.message));
            return ServiceResponse.fail("Invalid user informations!");
        }
    }

    async updateUserFull(userData) {
        if (!userData) {
            return ServiceResponse.fail("Invalid user update data!");
        }

        let idUserConfiguration = "";
        const idUser = userData.idUser;
        const idEnterpriseXuser = userData.idEnterpriseXuser;

        if (!idEnterpriseXuser || !idUser) {
            return ServiceResponse.fail("Invalid user update data!");
        }

        const connection = await db.getConnection();

        try {
            const EnterpriseXUserModelInstance = new EnterpriseXUserModel(connection);
            const UserConfigurationModelInstance = new UserConfigurationModel(connection);

            let userConfigurationInfo = await EnterpriseXUserModelInstance.getUserConfigurationFromEnterpriseXUser(idEnterpriseXuser);
            if (userConfigurationInfo && userConfigurationInfo.length > 0 && userConfigurationInfo[0] && userConfigurationInfo[0].length == 1) {
                idUserConfiguration = userConfigurationInfo[0][0].idUserConfiguration;
            }

            log(serviceName, "Function 'updateUserFull' | idUser: " + JSON.stringify(idUser) + " | idEnterpriseXuser: " + JSON.stringify(idEnterpriseXuser) + " | idUserConfiguration: " + JSON.stringify(idUserConfiguration));

            const userConfigurationData = {};
            if (userData.revenuePercentage || userData.revenuePercentage == 0) { userConfigurationData.revenuePercentage = userData.revenuePercentage; }
            if (userData.clientDeduction || userData.clientDeduction == 0) { userConfigurationData.clientDeduction = userData.clientDeduction; }
            if (userData.employmentContractDeduction || userData.employmentContractDeduction == 0) { userConfigurationData.employmentContractDeduction = userData.employmentContractDeduction; }

            await connection.beginTransaction();

            // update user configuration data:
            if (Object.keys(userConfigurationData).length > 0) {
                if (idUserConfiguration) {
                    userConfigurationInfo = await UserConfigurationModelInstance.updateUserConfiguration(userConfigurationData, idUserConfiguration);

                    if (!userConfigurationInfo || !userConfigurationInfo[0] || userConfigurationInfo[0].affectedRows != 1) {
                        log(serviceName, "Function 'updateUserFull' | idUser: " + JSON.stringify(idUser) + " | idEnterpriseXuser: " + JSON.stringify(idEnterpriseXuser) + " | idUserConfiguration: " + JSON.stringify(idUserConfiguration) + " | userConfigurationInfo does not have correct affected rows: " + JSON.stringify(userConfigurationInfo));
                        await connection.rollback();
                        await connection.release();
                        return ServiceResponse.fail("User configuration could not be updated. Please try again!");
                    }

                } else {
                    userConfigurationInfo = await UserConfigurationModelInstance.insertUserConfiguration(userConfigurationData);
                    if (!userConfigurationInfo || userConfigurationInfo.length < 1 || !userConfigurationInfo[0] || !userConfigurationInfo[0].insertId) {
                        log(serviceName, "Function 'updateUserFull' | idUser: " + JSON.stringify(idUser) + " | idEnterpriseXuser: " + JSON.stringify(idEnterpriseXuser) + " | idUserConfiguration: " + JSON.stringify(idUserConfiguration) + " | userConfigurationInfo does not have inserted id: " + JSON.stringify(userConfigurationInfo));
                        await connection.rollback();
                        await connection.release();
                        return ServiceResponse.fail("User configuration could not be inserted. Please try again!");
                    }

                    idUserConfiguration = userConfigurationInfo[0].insertId;
                }
            }

            // update enterpriseXuser data:
            const enterpriseXuserData = {};
            if (idUserConfiguration) { enterpriseXuserData.idUserConfiguration = idUserConfiguration; }
            if (userData.idRole) { enterpriseXuserData.idRole = userData.idRole; }
            if (userData.isActive || userData.isActive == "0" || userData.isActive == false) { enterpriseXuserData.isActive = userData.isActive == "1" || userData.isActive == true ? "1" : "0"; }

            if (Object.keys(enterpriseXuserData).length > 0) {
                const updatedEnterpriseXuser = await EnterpriseXUserModelInstance.updateUserXEnterprise(enterpriseXuserData, idEnterpriseXuser);

                if (!updatedEnterpriseXuser || !updatedEnterpriseXuser[0] || updatedEnterpriseXuser[0].affectedRows != 1) {
                    log(serviceName, "Function 'updateUserFull' | idUser: " + JSON.stringify(idUser) + " | idEnterpriseXuser: " + JSON.stringify(idEnterpriseXuser) + " | idUserConfiguration: " + JSON.stringify(idUserConfiguration) + " | updatedEnterpriseXuser does not have correct affected rows: " + JSON.stringify(updatedEnterpriseXuser));
                    await connection.rollback();
                    await connection.release();
                    return ServiceResponse.fail("User configuration could not be updated. Please try again!");
                }
            }

            // update user data:
            const updateUserData = {};
            if (userData.firstName) { updateUserData.firstName = userData.firstName; }
            if (userData.lastName) { updateUserData.lastName = userData.lastName; }

            if (Object.keys(updateUserData).length > 0) {
                this.UserModel.setConnection(connection);
                const updatedUser = await this.UserModel.updateUser(updateUserData, idUser);
                this.UserModel.setConnection(null);

                if (!updatedUser || !updatedUser[0] || updatedUser[0].affectedRows != 1) {
                    log(serviceName, "Function 'updateUserFull' | idUser: " + JSON.stringify(idUser) + " | idEnterpriseXuser: " + JSON.stringify(idEnterpriseXuser) + " | idUserConfiguration: " + JSON.stringify(idUserConfiguration) + " | updatedUser does not have correct affected rows: " + JSON.stringify(updatedUser));
                    await connection.rollback();
                    await connection.release();
                    return ServiceResponse.fail("User configuration could not be updated. Please try again!");
                }
            }

            await connection.commit();
            await connection.release();

            return ServiceResponse.success();

        } catch (error) {
            log(serviceName, "Error occured updating user with userData: " + JSON.stringify(userData) + " | error: " + JSON.stringify(error.message));

            if (connection) {
                await connection.rollback();
                await connection.release();
            }

            return ServiceResponse.fail("Invalid user informations!");
        }
    }
}

module.exports = new UserService();
