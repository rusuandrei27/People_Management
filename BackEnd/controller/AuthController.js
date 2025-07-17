const AuthService = require('../service/AuthService');
const EmailService = require('../service/EmailService');
const DateService = require('../service/DateService');

const sentOTPMails = new Map();

class AuthController {
    async sendRegisterEmail(req, res) {
        try {
            const { email, phone } = req.body;

            if (!email) {
                return res.status(400).json({ error: "Invalid email!" });
            }

            const userByEmail = await AuthService.getUserByEmail(email);
            if (userByEmail && userByEmail.length > 0) {
                return res.status(400).json({ error: "There is already an account with this email" });;
            }

            const userByPhone = await AuthService.getUserByPhone(phone);
            if (userByPhone && userByPhone.length > 0) {
                return res.status(400).json({ error: "There is already an account with this phone" });;
            }

            const emailSent = await EmailService.sendRegisterEmail(email);
            if (emailSent instanceof Error) {
                return res.status(400).json({ error: emailSent.message });;
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
            if (insertedUserInfo && insertedUserInfo[0] && insertedUserInfo[0].insertId) {
                sentOTPMails.delete(email);
                return res.status(200).json({ message: 'User successfully inserted!' });
            }

            res.status(400).json({ message: 'User could not be inserted!' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();
