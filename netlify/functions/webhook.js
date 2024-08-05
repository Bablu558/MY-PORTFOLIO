const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');

const secret = process.env.SECRET_KEY;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.handler = async (event) => {
    try {
        const webhookEvent = JSON.parse(event.body);

        if (webhookEvent.event_type === 'PAYMENT.SALE.COMPLETED') {
            const payment = webhookEvent.resource;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: payment.payer.email_address,
                subject: 'Your Purchased Zip File',
                text: 'Thank you for your purchase! Please find the attached zip file.',
                attachments: [
                    {
                        filename: 'project2 - Copy.zip',
                        path: path.join(__dirname, 'project2 - Copy.zip')
                    }
                ]
            };

            await transporter.sendMail(mailOptions);

            return {
                statusCode: 200,
                body: JSON.stringify({ success: 'Payment verified and email sent' })
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Unhandled event type' })
            };
        }
    } catch (error) {
        console.error('Error handling webhook:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
