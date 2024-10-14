const axios = require('axios');

// Токен бота Telegram
const TELEGRAM_TOKEN = '7572364421:AAETj2zFYyGDQZEYwj2-pzjzMig02khs6Pc';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

// Функция для отправки сообщения обратно в Телеграм
async function sendMessageToTelegram(chatId, message) {
    try {
        const response = await axios.post(TELEGRAM_API_URL, {
            chat_id: chatId,
            text: message
        });
        console.log('Сообщение отправлено:', response.data);
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error.response ? error.response.data : error.message);
    }
}

// Экспортируем функцию-обработчик для работы с вебхуком Telegram
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message } = req.body;

        // Проверяем, что сообщение содержит текст и ID чата
        if (message && message.chat && message.text) {
            const chatId = message.chat.id;
            const userMessage = message.text;

            console.log(`Получено сообщение от Chat ID ${chatId}: ${userMessage}`);

            // Формируем эхо-ответ
            const reply = `Вы сказали: ${userMessage}`;

            // Отправляем эхо-сообщение пользователю
            await sendMessageToTelegram(chatId, reply);

            // Ответ для Telegram, что запрос был успешно обработан
            return res.status(200).json({ status: 'ok' });
        } else {
            // Если сообщение не содержит нужных данных
            console.log('Некорректный запрос:', req.body);
            return res.status(400).json({ error: 'Bad Request: message or chat not found' });
        }
    } else {
        // Если запрос не является POST
        return res.status(404).send('Not found');
    }
}
