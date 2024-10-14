const axios = require('axios');

// Токен твоего Телеграм-бота
const TELEGRAM_TOKEN = '7572364421:AAETj2zFYyGDQZEYwj2-pzjzMig02khs6Pc';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// Функция для отправки сообщения обратно в Телеграм
async function sendMessageToTelegram(chatId, message) {
    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
        chat_id: chatId,
        text: message
    });
}

// Экспорт функции, которая будет обрабатывать запросы
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message } = req.body;

        // Получаем ID чата и текст сообщения
        const chatId = message.chat.id;
        const userMessage = message.text;

        // Пример обработки сообщения: эхо-ответ
        const reply = `Вы сказали: ${userMessage}`;

        // Отправляем эхо-сообщение пользователю
        await sendMessageToTelegram(chatId, reply);

        // Ответ на запрос Телеграма
        return res.status(200).json({ status: 'ok' });
    }

    // Если запрос не POST — вернем 404
    return res.status(404).send('Not found');
}
