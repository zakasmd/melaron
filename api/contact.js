export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, phone, businessType } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ error: 'Ad və nömrə mütləqdir.' });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN ? process.env.TELEGRAM_BOT_TOKEN.replace(/["']/g, '').trim() : '';
    const chatId = process.env.TELEGRAM_CHAT_ID ? process.env.TELEGRAM_CHAT_ID.replace(/["']/g, '').trim() : '';

    if (!botToken || !chatId) {
        console.error('Missing Telegram Environment Variables');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const escapeHTML = (str) => {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };

    const safeName = escapeHTML(name);
    const safePhone = escapeHTML(phone);
    const safeBusiness = escapeHTML(businessType);

    const message = `
🔔 <b>Yeni Konsultasiya Müraciəti!</b> 🔔

👤 <b>Ad:</b> ${safeName}
📞 <b>Nömrə:</b> ${safePhone}
🏢 <b>Biznes Növü:</b> ${safeBusiness}
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
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Telegram xətası: ${response.status} - ${errText}`);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Telegram error:', error.message);
        res.status(500).json({ error: error.message });
    }
}
