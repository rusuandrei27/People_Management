const scriptName = "EmailService.js";
const nodemailer = require('nodemailer');
const ServiceResponse = require('./ServiceResponse');
const DateService = require("./DateService");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD
    }
});

class EmailService {

    static async sendMail(mailInfo) {
        const { from, to, subject, text } = mailInfo;
        if (!from || !to || !subject || !text) {
            return false;
        }

        try {
            await transporter.sendMail({
                from: from,
                to: to,
                subject: subject,
                text: text
            });

            return true;

        } catch (error) {
            log(scriptName, "Error sending registration mail to " + JSON.stringify(userEmail) + " | error: " + JSON.stringify(error.message));
            return false;
        }
    }

    async sendRegisterEmail(email) {
        if (!email) {
            return ServiceResponse.fail("Invalid email!");
        }

        const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const expiresAt = DateService.convertMilisecondToDateString(Date.now() + 10 * 60 * 1000);

        if (!otp || !expiresAt) {
            return ServiceResponse.fail("Invalid data for register email sending!");
        }

        const from = "Men Code Stefan cel Mare";
        const to = email;
        const subject = 'Men Code Email Confirmation';
        const text = 'Hi! This is your confirmation code: ' + JSON.stringify(otp) + ". Thank you for registering in Men Code Employee Management Application. Be aware: your confirmation code expires at: " + JSON.stringify(expiresAt);

        const isEmailSuccessfullySent = await EmailService.sendMail({ from, to, subject, text });

        if (!isEmailSuccessfullySent) {
            return ServiceResponse.fail("Email could not be sent!");
        }

        return ServiceResponse.success([otp, expiresAt]);
    };
}

module.exports = new EmailService();
