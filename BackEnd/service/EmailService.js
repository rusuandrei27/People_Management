const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD
    }
});

class EmailService {

    async sendMail(userEmail, otpCode) {
        console.log("993")

        let info = await transporter.sendMail({
            from: '"Rusu Raiciu Andrei"' + process.env.MY_EMAIL,
            to: userEmail,
            subject: 'Men Code email confirmation',
            text: 'Hi! This is your confirmation code: ' + otpCode + '. It is valid 10 minutes.',
        });

        console.log("99")
        console.log(info);

        return true;
    }
}

module.exports = new EmailService();
