import nodemailer from 'nodemailer';

export default function getNodeMailer() {
    const email = process.env.SENDER_EMAIL_ADDRESS;
    const password = process.env.SENDER_EMAIL_PASSWORD;

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: email,
            pass: password
        }
    });

    return { transporter, senderEmail: email };
}