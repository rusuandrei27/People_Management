const AuthService = require('../service/AuthService');
const EmailService = require('../service/EmailService');
const DateService = require('../service/DateService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const sentOTPMails = new Map();

class AuthController {
    async sendRegisterEmail(req, res) {
        try {
            const { email, phone } = req.body;

            if (!email) {
                return res.status(400).json({ error: "Invalid email!" });
            }

            if (!phone) {
                return res.status(400).json({ error: "Invalid phone!" });
            }

            const userByEmail = await AuthService.getUserByEmail(email);
            if ((userByEmail && userByEmail.length > 0) || userByEmail instanceof Error) {
                return res.status(400).json({ error: "There is already an account with this email" });
            }

            const userByPhone = await AuthService.getUserByPhone(phone);
            if ((userByPhone && userByPhone.length > 0) || userByPhone instanceof Error) {
                return res.status(400).json({ error: "There is already an account with this phone" });
            }

            const emailSent = await EmailService.sendRegisterEmail(email);
            if (emailSent instanceof Error) {
                return res.status(400).json({ error: emailSent.message });
            }

            const [otp, expiresAt] = emailSent;

            sentOTPMails.set(email, { otp, expiresAt });

            res.status(200).json({ message: 'Register Mail Sent Successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    async insertUser(req, res) {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(400).json({ error: "Unexpected error occured. Please try again!" });
            }

            if (!sentOTPMails.size || sentOTPMails.size < 1) {
                return res.status(400).json({ error: "The otp code was send to another email! Please use correct email!" });
            }

            const emailOTPInfo = sentOTPMails.get(email);

            if (!emailOTPInfo) {
                return res.status(400).json({ error: "The otp code was send to another email! Please use correct email!" });
            }

            const expiresAt = DateService.convertDateStringToDate(emailOTPInfo.expiresAt);

            if (!expiresAt) {
                return res.status(400).json({ error: "OTP Code is expired! Try register again!" });
            }

            const currentDate = new Date();

            if (currentDate > expiresAt) {
                return res.status(400).json({ error: "OTP Code is expired! Try register again!" });
            }

            if (otp != emailOTPInfo.otp) {
                return res.status(400).json({ error: "OTP Code is invalid! Try register again!" });
            }

            const insertedUserInfo = await AuthService.insertUser(req.body);
            sentOTPMails.delete(email);

            if (insertedUserInfo && insertedUserInfo[0] && insertedUserInfo[0].insertId) {
                return res.status(200).json({ "idUser": insertedUserInfo[0].insertId });
            }

            res.status(400).json({ error: 'User could not be inserted!' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async assignUserToEnterprise(req, res) {
        try {
            const { idUser, idEnterprise } = req.body;

            if (!idUser) {
                return res.status(400).json({ error: "Invalid user!" });
            }

            if (!idEnterprise) {
                return res.status(400).json({ error: "Invalid enterprise!" });
            }

            const userAndEnterprise = await AuthService.getUserAndEnterprise(idUser, idEnterprise);
            if ((userAndEnterprise && userAndEnterprise.length > 0) || userAndEnterprise instanceof Error) {
                return res.status(400).json({ error: "User is already assigned to this enterprise!" });
            }

            const insertedLinkUserEnterprise = await AuthService.assignUserToEnterprise(req.body);
            if (insertedLinkUserEnterprise && insertedLinkUserEnterprise[0] && insertedLinkUserEnterprise[0].insertId) {
                return res.status(200).json({ "enterpriseXuserId": insertedLinkUserEnterprise[0].insertId });
            }

            res.status(400).json({ error: 'User could not associated to this enterprise' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "You must complete email and password!" });
            }

            const userByEmail = await AuthService.getUserByEmail(email);
            if (!userByEmail || userByEmail.length != 1) {
                return res.status(400).json({ error: "The email or password is not valid!" });
            }

            const isCorrectPassword = await bcrypt.compare(password, userByEmail[0].password);

            if (!isCorrectPassword) {
                return res.status(400).json({ error: "The email or password is not valid!" });
            }

            const userAndEnterpriseByEmail = await AuthService.getUserAndEnterpriseByEmail(email);
            if (!userAndEnterpriseByEmail || userAndEnterpriseByEmail.length < 1) {
                return res.status(200).json({ "idUser": userByEmail[0].idUser, "nextPage": "chooseEnterprise" });
            }

            const filteredUserAndEnterpriseByEmail = userAndEnterpriseByEmail.filter(item => item.isActive == true);
            if (!filteredUserAndEnterpriseByEmail || filteredUserAndEnterpriseByEmail.length < 1) {
                return res.status(200).json({ "idUser": userByEmail[0].idUser, "nextPage": "waitingActivation" });
            }

            const jwtSecret = process.env.JWT_SECRET;
            const token = jwt.sign({ id: filteredUserAndEnterpriseByIdUser[0].idUser, email: email }, jwtSecret, {
                expiresIn: '24h'
            });

            return res.status(200).json({
                "idUser": filteredUserAndEnterpriseByIdUser[0].idUser,
                "token": token,
                "nextPage": "enterprise"
            });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();
