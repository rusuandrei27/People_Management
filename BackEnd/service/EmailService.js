const nodemailer = require('nodemailer');
const DateService = require("./DateService");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD
    }
});

class EmailService {

    async sendRegisterEmail(email) {
        const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const expiresAt = DateService.convertMilisecondToDateString(Date.now() + 10 * 60 * 1000);

        const isEmailSuccessfullySent = await EmailService.sendMail(email, otp, expiresAt);

        if (isEmailSuccessfullySent instanceof Error) {
            return isEmailSuccessfullySent;
        }

        return [otp, expiresAt];
    };

    static async sendMail(userEmail, otpCode, expiresAt) {
        if (!userEmail || !otpCode || !expiresAt) {
            return new Error("Verification email coud not be send. Please try again!");
        }

        await transporter.sendMail({
            from: "Men Code Stefan cel Mare",
            to: userEmail,
            subject: 'Men Code Email Confirmation',
            text: 'Hi! This is your confirmation code: ' + otpCode + ". Thank you for registering in Men Code Employee Management Application. Be aware: your validation code expires at: " + expiresAt,
        });
    }
}

module.exports = new EmailService();
