const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const TelegramBot = require('node-telegram-bot-api');

// Твой токен
const TOKEN = '8117485520:AAGjY1wJFjm9fW9FVxXZ06Ox9oUZHBYWfu4'; 
const bot = new TelegramBot(TOKEN, {polling: true});

// Раздаем статические файлы из корня
app.use(express.static(__dirname));

// Принудительно отдаем index.html при заходе на сайт
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Сокеты для связи сайта и сервера
io.on('connection', (socket) => {
    socket.on('auth', (username) => {
        socket.join(username.toLowerCase());
        console.log(`[CORE] Оператор ${username} вошел в сеть.`);
    });
});

// Команда в ТГ: /send [ник] [текст]
bot.onText(/\/send (\w+) (.+)/, (msg, match) => {
    const target = match[1].toLowerCase();
    const text = match[2];
    io.to(target).emit('tg_msg', { text: text });
    bot.sendMessage(msg.chat.id, `✅ ДОСТАВЛЕНО: ${target}`);
});

// Команда в ТГ: /alarm
bot.onText(/\/alarm/, (msg) => {
    io.emit('alarm');
    bot.sendMessage(msg.chat.id, "⚠️ ПРОТОКОЛ ТРЕВОГИ ЗАПУЩЕН!");
});

// Запуск
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('--- G.L.O.M.G. SERVER ONLINE ---');
});
