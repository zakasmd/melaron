export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, phone, businessType } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ error: 'Ad və nömrə mütləqdir.' });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error('Missing Telegram Environment Variables');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const message = `
🔔 *Yeni Konsultasiya Müraciəti!* 🔔

👤 *Ad:* ${name}
📞 *Nömrə:* ${phone}
🏢 *Biznes Növü:* ${businessType}
    `;

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        if (!response.ok) {
            throw new Error('Telegram API responded with an error');
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Telegram error:', error);
        res.status(500).json({ error: 'Failed to send message to Telegram' });
    }
}
