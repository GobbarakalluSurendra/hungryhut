const twilio = require('twilio');

const sendWhatsAppNotification = async (orderInfo) => {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; 
        const adminWhatsAppNumber = process.env.ADMIN_WHATSAPP_NUMBER; 

        if (!accountSid || !authToken || !twilioWhatsAppNumber || !adminWhatsAppNumber) {
            console.log('--- WhatsApp Notification (Simulated) ---');
            console.log(`To: Admin`);
            console.log(`Message: New Order Received!\nAmount: Rs.${orderInfo.amount}\nItems: ${orderInfo.itemsCount}`);
            console.log('-----------------------------------------');
            console.log('Note: Please configure Twilio in .env to send real WhatsApp messages.');
            return;
        }

        const client = twilio(accountSid, authToken);

        const message = `*New Order Alert!*\n\nA new order has been placed on HungryHut.\n\n*Amount:* Rs.${orderInfo.amount}\n*Items:* ${orderInfo.itemsCount}\n*Payment Status:* ${orderInfo.paymentStatus}\n\nPlease check the admin dashboard for details.`;

        await client.messages.create({
            from: twilioWhatsAppNumber,
            body: message,
            to: adminWhatsAppNumber
        });

        console.log('WhatsApp notification sent to admin successfully.');
    } catch (error) {
        console.error('Failed to send WhatsApp notification:', error);
    }
};

module.exports = {
    sendWhatsAppNotification
};
