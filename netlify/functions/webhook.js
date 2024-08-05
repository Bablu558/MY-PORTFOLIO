const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');

const secret = 'mySecretKeyKushwaha1233';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kushwahabablu40@gmail.com',
        pass: 'kushwaha'
    }
});

exports.handler = async (event) => {
    try {
        const webhookEvent = JSON.parse(event.body);

        if (webhookEvent.event_type === 'PAYMENT.SALE.COMPLETED') {
            const payment = webhookEvent.resource;

            const mailOptions = {
                from: 'kushwahabablu40@gmail.com',
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
