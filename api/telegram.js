const https = require('https');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { name, email, message } = req.body;
    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.ID;

    if (!botToken || !chatId) {
        console.error('Bot Token or Chat ID is not configured.');
        return res.status(500).json({ message: 'Server configuration error.' });
    }
    
    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    let text;
    // Agar "name" va "message" bo'lsa, bu asosiy formadan kelgan xabar
    if (name && message) {
        text = `📬 *New Message from Portfolio*\n\n` +
               `*Name:* ${name}\n` +
               `*Email:* ${email}\n\n` +
               `*Message:*\n${message}`;
    // Aks holda, bu faqat email kiritilgan forma
    } else {
        text = `🔔 *New Email Subscription*\n\n` +
               `*Email:* ${email}`;
    }

    const encodedText = encodeURIComponent(text);
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodedText}&parse_mode=Markdown`;

    try {
        const apiResponse = await fetch(url);
        const apiResult = await apiResponse.json();

        if (!apiResult.ok) {
            console.error('Telegram API Error:', apiResult.description);
            throw new Error(apiResult.description);
        }
        
        res.status(200).json({ message: 'Message sent successfully' });

    } catch (error) {
        console.error('Error sending message to Telegram:', error.message);
        res.status(500).json({ message: `Failed to send message. ${error.message}` });
    }
};
