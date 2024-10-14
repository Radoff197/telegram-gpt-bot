const axios = require('axios');

// Токен Telegram-бота
const TELEGRAM_TOKEN = '7572364421:AAETj2zFYyGDQZEYwj2-pzjzMig02khs6Pc';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

// Токен GPT (новый API ключ)
const GPT_API_KEY = 'sk-meTem4sxNQBk0tI2klHL6loDvx5KvQ3IOD_IVubY50T3BlbkFJcAHGdAw9s_FmwmLVuVBfeqVIwLkim6RvEyGTuVh4YA';
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

// Функция для отправки сообщения в GPT-4
async function sendMessageToGPT(userMessage) {
    console.log('Отправляем запрос в GPT-4:', userMessage);  // Логируем отправку сообщения в GPT
    try {
        const response = await axios.post(
            GPT_API_URL,
            {
                model: 'gpt-4',  // Используем модель GPT-4
                prompt: userMessage,
                max_tokens: 100,  // Определи лимит на количество токенов
            },
            {
                headers: {
                    'Authorization': `Bearer ${GPT_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Ответ от GPT-4:', response.data.choices[0].text);  // Логируем ответ от GPT
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Ошибка при отправке сообщения в GPT-4:', error.response ? error.response.data : error.message);
        return 'Произошла ошибка при обработке запроса в GPT.';
    }
}

// Основная функция-обработчик вебхука Telegram
export default async function handler(req, res) {
    console.log('Получен запрос от Telegram:', req.body);

    if (req.method === 'POST') {
        const { message } = req.body;

        if (!message || !message.text) {
            return res.status(400).json({ error: 'Некорректное сообщение' });
        }

        const chatId = message.chat.id;
        const userMessage = message.text;

        console.log(`Получено сообщение от Chat ID ${chatId}: ${userMessage}`);

        // Отправляем сообщение в GPT-4
        const gptResponse = await sendMessageToGPT(userMessage);

        // Логируем, что отправляем обратно в Telegram
        console.log(`Отправляем ответ обратно в Telegram для Chat ID ${chatId}: ${gptResponse}`);

        // Отправляем ответ обратно в Telegram
        await sendMessageToTelegram(chatId, gptResponse);

        // Ответ от сервера
        return res.status(200).json({ status: 'Сообщение обработано' });
    }

    console.log('Неправильный метод запроса:', req.method);
    return res.status(405).json({ error: 'Метод не поддерживается' });
}
