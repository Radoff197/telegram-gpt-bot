const axios = require('axios');

// Токен Telegram-бота (твой предоставленный токен)
const TELEGRAM_TOKEN = '7572364421:AAETj2zFYyGDQZEYwj2-pzjzMig02khs6Pc';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

// Токен GPT (твой предоставленный ключ)
const GPT_API_KEY = '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';
const GPT_API_URL = 'https://api.openai.com/v1/completions';

// Функция для отправки сообщения обратно в Телеграм
async function sendMessageToTelegram(chatId, message) {
    try {
        const response = await axios.post(TELEGRAM_API_URL, {
            chat_id: chatId,
            text: message
        });
        console.log('Сообщение отправлено в Telegram:', response.data);
    } catch (error) {
        console.error('Ошибка при отправке сообщения в Telegram:', error.response ? error.response.data : error.message);
    }
}

// Функция для отправки сообщения в GPT
async function sendMessageToGPT(userMessage) {
    try {
        const response = await axios.post(
            GPT_API_URL,
            {
                model: 'gpt-3.5-turbo',  // Используй нужную модель GPT
                prompt: userMessage,
                max_tokens: 100,
            },
            {
                headers: {
                    'Authorization': `Bearer ${GPT_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Ошибка при отправке сообщения в GPT:', error.response ? error.response.data : error.message);
        return 'Произошла ошибка при обработке запроса.';
    }
}

// Основная функция-обработчик вебхука Telegram
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message } = req.body;

        if (!message || !message.text) {
            return res.status(400).json({ error: 'Некорректное сообщение' });
        }

        const chatId = message.chat.id;
        const userMessage = message.text;

        console.log(`Получено сообщение от Chat ID ${chatId}: ${userMessage}`);

        // Отправляем сообщение в GPT
        const gptResponse = await sendMessageToGPT(userMessage);

        // Отправляем ответ обратно в Telegram
        await sendMessageToTelegram(chatId, gptResponse);

        // Ответ от сервера
        return res.status(200).json({ status: 'Сообщение обработано' });
    }

    // Неверный метод
    return res.status(405).json({ error: 'Метод не поддерживается' });
}
