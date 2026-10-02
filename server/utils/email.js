const nodemailer = require('nodemailer');

const sendEmailNotification = async (orderInfo) => {
    try {
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;
        const adminEmail = process.env.ADMIN_EMAIL;

        if (!emailUser || !emailPass || !adminEmail) {
            console.log('--- Email Notification (Simulated) ---');
            console.log(`To: ${adminEmail || 'Admin'}`);
            console.log(`Subject: New Order Received - Rs.${orderInfo.amount}`);
            console.log('Note: Please configure EMAIL_USER, EMAIL_PASS, and ADMIN_EMAIL in .env to send real emails.');
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass
            }
        });

        const mailOptions = {
            from: `"Hungry Hut System" <${emailUser}>`,
            to: adminEmail,
            subject: `🚨 New Order Alert! - Rs.${orderInfo.amount}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: auto;">
                    <h2 style="color: #F59E0B;">Hungry Hut - New Order Received!</h2>
                    <p><strong>Customer Name:</strong> ${orderInfo.customerName}</p>
                    <p><strong>Amount:</strong> Rs.${orderInfo.amount}</p>
                    <p><strong>Total Items:</strong> ${orderInfo.itemsCount}</p>
                    <p><strong>Payment Status:</strong> ${orderInfo.paymentStatus}</p>
                    <p><strong>Order Type:</strong> ${orderInfo.orderType}</p>
                    <hr style="border: 1px solid #eee; my-4;" />
                    <p style="color: #555;">Please check your Admin Dashboard for full details.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Email notification sent to admin successfully.');
    } catch (error) {
        console.error('Failed to send Email notification:', error);
    }
};

module.exports = {
    sendEmailNotification
};
