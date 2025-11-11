const scriptName = "AuthController.js";
const FEPages = require('../config/FEPages');
const Roles = require('../config/Roles');
const UserService = require('../service/UserService');
const EnterpriseXUserService = require('../service/EnterpriseXUserService');
const EmailService = require('../service/EmailService');
const DateService = require('../service/DateService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const sentOTPMails = new Map();

class AuthController {
    async sendRegisterEmail(req, res) {
        try {
            log(scriptName, "Function 'sendRegisterEmail' | Started with body: " + JSON.stringify(req.body));

            const { email, phone } = req.body;

            if (!email) {
                return res.status(400).json({ error: "Invalid email!" });
            }

            if (!phone) {
                return res.status(400).json({ error: "Invalid phone!" });
            }

            const userByEmail = await UserService.getUserByEmail(email);
            if (!userByEmail || userByEmail.error) {
                log(scriptName, "Function 'sendRegisterEmail' | body: " + JSON.stringify(req.body) + " | userByEmail is not defined or responded with error");
                return res.status(400).json({ error: userByEmail.error ? userByEmail.error : "This action is not allowed at this moment. Try again later!" });
            }

            if (userByEmail.data.length > 0) {
                log(scriptName, "Function 'sendRegisterEmail' | Another user was found for this email: " + JSON.stringify(email) + " | You can not register same email twice!");
                return res.status(400).json({ error: "There is already an account with this email" });
            }

            const userByPhone = await UserService.getUserByPhone(phone);
            if (!userByPhone || userByPhone.error) {
                log(scriptName, "Function 'sendRegisterEmail' | body: " + JSON.stringify(req.body) + " | userByPhone is not defined or responded with error");
                return res.status(400).json({ error: userByPhone.error ? userByPhone.error : "This action is not allowed at this moment. Try again later!" });
            }

            if (userByPhone.data.length > 0) {
                log(scriptName, "Function 'sendRegisterEmail' | Another user was found for this phone: " + JSON.stringify(phone) + " | You can not register same phone twice!");
                return res.status(400).json({ error: "There is already an account with this phone" });
            }

            log(scriptName, "Function 'sendRegisterEmail' | body: " + JSON.stringify(req.body) + " | start sending email");
            const emailSent = await EmailService.sendRegisterEmail(email);
            if (!emailSent || emailSent.error || !emailSent.data) {
                log(scriptName, "Function 'sendRegisterEmail' | Email was not successfully sent to " + JSON.stringify(email) + " | error: " + emailSent ? emailSent.error : "");
                return res.status(500).json({ error: emailSent.error ? emailSent.error : "Email could not be sent! Try again later or try another email!" });
            }

            const [otp, expiresAt] = emailSent.data;
            log(scriptName, "Function 'sendRegisterEmail' | email was successfully sent to " + JSON.stringify(email) + " and has the following values: otp: '" + JSON.stringify(otp) + "' and expiresAt: '" + JSON.stringify(expiresAt));

            sentOTPMails.set(email, { otp, expiresAt });

            log(scriptName, "Function 'sendRegisterEmail' | Ended successfully with body: " + JSON.stringify(req.body));
            return res.status(200).json({ message: 'Register Mail Sent Successfully' });

        } catch (error) {
            log(scriptName, "Function 'sendRegisterEmail' | " + JSON.stringify(req.body) + " | ended in error: " + JSON.stringify(error.message));
            return res.status(500).json({ error: "The service could not be reached at this moment. Please try again later!" });
        }
    };

    async insertUser(req, res) {
        try {
            log(scriptName, "Function 'insertUser' | Started with body: " + JSON.stringify(req.body));

            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(400).json({ error: "OTP is not valid. Please try again later!" });
            }

            if (!sentOTPMails.size || sentOTPMails.size < 1) {
                log(scriptName, "Function 'insertUser' | sentOTPMails is empty | " + JSON.stringify(req.body) + " | could not validate otp in order to insert user");
                return res.status(400).json({ error: "The otp code was send to another email! Please use correct email!" });
            }

            const emailOTPInfo = sentOTPMails.get(email);

            if (!emailOTPInfo) {
                log(scriptName, "Function 'insertUser' | emailOTPInfo is not defined | " + JSON.stringify(req.body) + " | the otp was not sent to this email! ");
                return res.status(400).json({ error: "The otp code was send to another email! Please use correct email!" });
            }

            log(scriptName, "Function 'insertUser' | emailOTPInfo for request with body: " + JSON.stringify(req.body) + " | has the following values: " + JSON.stringify(emailOTPInfo));

            const expiresAt = DateService.convertDateStringToDate(emailOTPInfo.expiresAt);

            if (!expiresAt) {
                log(scriptName, "Function 'insertUser' | expiresAt is not defined | " + JSON.stringify(req.body));
                return res.status(400).json({ error: "OTP Code is expired! Try register again!" });
            }

            const currentDate = new Date();

            if (currentDate > expiresAt) {
                log(scriptName, "Function 'insertUser' | expiresAt is lower than currentDate | " + JSON.stringify(req.body) + " | currentDate: " + JSON.stringify(currentDate) + " | expiresAt: " + JSON.stringify(expiresAt));
                return res.status(400).json({ error: "OTP Code is expired! Try register again!" });
            }

            if (otp != emailOTPInfo.otp) {
                log(scriptName, "Function 'insertUser' | otp is invalid | " + JSON.stringify(req.body) + " | otp entered by the user: " + JSON.stringify(otp) + " | otp assigned for this email: " + JSON.stringify(emailOTPInfo.otp));
                return res.status(400).json({ error: "OTP Code is invalid! Try register again!" });
            }

            log(scriptName, "Function 'insertUser' | all validations passed - begin inserting user | " + JSON.stringify(req.body));
            const insertedUserInfo = await UserService.insertUser(req.body);

            if (!insertedUserInfo || insertedUserInfo.error || !insertedUserInfo.data) {
                log(scriptName, "Function 'insertUser' | user could not be inserted | " + JSON.stringify(req.body) + " | insertedUserInfo: " + JSON.stringify(insertedUserInfo));
                return res.status(500).json({ error: insertedUserInfo.error ? insertedUserInfo.error : 'User could not be inserted!' });
            }

            sentOTPMails.delete(email);

            log(scriptName, "Function 'insertUser' | Ended successfully with body: " + JSON.stringify(req.body));
            return res.status(200).json({ "idUser": insertedUserInfo.data[0].insertId });

        } catch (error) {
            log(scriptName, "Function 'insertUser' | " + JSON.stringify(req.body) + " | ended in error: " + JSON.stringify(error.message));
            return res.status(400).json({ error: "The service could not be reached at this moment. Please try again later!" });
        }
    }

    async assignUserToEnterprise(req, res) {
        try {
            log(scriptName, "Function 'assignUserToEnterprise' | Started with body: " + JSON.stringify(req.body));

            const { idUser, idEnterprise } = req.body;

            if (!idUser) {
                return res.status(400).json({ error: "Invalid user!" });
            }

            if (!idEnterprise) {
                return res.status(400).json({ error: "Invalid enterprise!" });
            }

            const userAndEnterprise = await EnterpriseXUserService.getUserAndEnterprise(idUser, idEnterprise);
            if (!userAndEnterprise || userAndEnterprise.error || !userAndEnterprise.data) {
                log(scriptName, "Function 'assignUserToEnterprise' | body: " + JSON.stringify(req.body) + " | getUserAndEnterprise retured undefined or error");
                return res.status(400).json({ error: "User can not be assigned to this enterprise!" });
            }

            if (userAndEnterprise.data.length > 0) {
                log(scriptName, "Function 'assignUserToEnterprise' | body: " + JSON.stringify(req.body) + " | user is already assigned to this enterprise!");
                return res.status(400).json({ error: "User is already assigned to this enterprise. Contact your manager to activate your account!" });
            }

            const insertUserXEnterprise = await EnterpriseXUserService.insertUserXEnterprise(req.body);
            if (!insertUserXEnterprise || insertUserXEnterprise.error || !insertUserXEnterprise.data) {
                log(scriptName, "Function 'assignUserToEnterprise' | user could not be assigned to this enterprise | " + JSON.stringify(req.body) + " | insertUserXEnterprise: " + JSON.stringify(insertUserXEnterprise));
                return res.status(500).json({ error: insertUserXEnterprise.error ? insertUserXEnterprise.error : 'User could not be assigned to this entity!' });
            }

            log(scriptName, "Function 'assignUserToEnterprise' | Ended successfully with body: " + JSON.stringify(req.body));
            return res.status(200).json({ "enterpriseXuserId": insertUserXEnterprise.data[0].insertId });

        } catch (error) {
            log(scriptName, "Function 'assignUserToEnterprise' | " + JSON.stringify(req.body) + " | ended in error: " + JSON.stringify(error.message));
            return res.status(400).json({ error: "The service could not be reached at this moment. Please try again later!" });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            log(scriptName, "Function 'login' | Started with email: " + JSON.stringify(email));

            if (!email || !password) {
                return res.status(400).json({ error: "You must complete email and password!" });
            }

            const userByEmail = await UserService.getUserByEmail(email);
            if (!userByEmail || userByEmail.error || !userByEmail.data || userByEmail.data.length < 1) {
                log(scriptName, "Function 'login' | email: " + JSON.stringify(email) + " | userByEmail is not defined or responded with error");
                return res.status(400).json({ error: "The email or password is not valid!" });
            }

            const isCorrectPassword = await bcrypt.compare(password, userByEmail.data[0].password);

            if (!isCorrectPassword) {
                log(scriptName, "Function 'login' | email: " + JSON.stringify(email) + " | password is not correct");
                return res.status(400).json({ error: "The email or password is not valid!" });
            }

            const userAndEnterpriseByEmail = await EnterpriseXUserService.getUserAndEnterpriseByEmail(email);
            if (!userAndEnterpriseByEmail || userAndEnterpriseByEmail.error || !userAndEnterpriseByEmail.data) {
                log(scriptName, "Function 'login' | email: " + JSON.stringify(email) + " | userAndEnterpriseByEmail is invalid!");
                return res.status(400).json({ error: "You can not login at this time. Try again later!" });
            }

            if (userAndEnterpriseByEmail.data.length < 1) {
                log(scriptName, "Function 'login' | email: " + JSON.stringify(email) + " | Ended redirecting to " + JSON.stringify(FEPages.chooseEnterprise));
                return res.status(200).json({ "idUser": userByEmail.data[0].idUser, "nextPage": FEPages.chooseEnterprise });
            }

            const filteredUserAndEnterpriseByEmail = userAndEnterpriseByEmail.data.filter(item => item.isActive == true);
            if (!filteredUserAndEnterpriseByEmail || filteredUserAndEnterpriseByEmail.length < 1) {
                log(scriptName, "Function 'login' | email: " + JSON.stringify(email) + " | Ended redirecting to " + JSON.stringify(FEPages.waitingActivation));
                return res.status(200).json({ "idUser": userByEmail.data[0].idUser, "nextPage": FEPages.waitingActivation });
            }

            const roleName = filteredUserAndEnterpriseByEmail[0].roleName;
            let nextPage = "";

            switch (roleName) {
                case Roles.employee:
                    nextPage = FEPages.employeeMain;
                    break;
                case Roles.manager:
                    nextPage = FEPages.managerMain;
                    break;
                case Roles.admin:
                    nextPage = FEPages.adminMain;
                    break;
                case Roles.supervisor:
                    nextPage = FEPages.supervisorMain;
                    break;
                default:
                    log(scriptName, "Function 'login' | email: " + JSON.stringify(email) + " | roleName is not treated | roleName: " + JSON.stringify(roleName));
                    return res.status(400).json({ error: "You can not login at this time. Try again later!" });
            }

            log(scriptName, "Function 'login' | email: " + JSON.stringify(email) + " | passed all validations, generating jwt");

            const jwtSecret = process.env.JWT_SECRET;
            const token = jwt.sign({ id: filteredUserAndEnterpriseByEmail[0].idUser, email: email, role: roleName }, jwtSecret);

            log(scriptName, "Function 'login' | email: " + JSON.stringify(email) + " | passed all validations, jwt successfully generated | Ended successfully.");
            return res.status(200).json({
                "idUser": filteredUserAndEnterpriseByEmail[0].idUser,
                "idEnterpriseXuser": filteredUserAndEnterpriseByEmail[0].idEnterpriseXuser,
                "firstName": filteredUserAndEnterpriseByEmail[0].firstName,
                "cityName": filteredUserAndEnterpriseByEmail[0].cityName,
                "street": filteredUserAndEnterpriseByEmail[0].street,
                "streetNo": filteredUserAndEnterpriseByEmail[0].streetNo,
                "token": token,
                "nextPage": nextPage
            });

        } catch (error) {
            log(scriptName, "Function 'login' | email: " + JSON.stringify(req.body.email) + " | ended in error: " + JSON.stringify(error.message));
            return res.status(400).json({ error: "The service could not be reached at this moment. Please try again later!" });
        }
    }
}

module.exports = new AuthController();
