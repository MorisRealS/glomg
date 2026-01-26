const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '8117485520:AAGjY1wJFjm9fW9FVxXZ06Ox9oUZHBYWfu4'; 
const bot = new TelegramBot(TOKEN, {polling: true});

let mailBox = {};
let archiveData = [];

app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

io.on('connection', (socket) => {
    socket.on('auth', (username) => {
        const user = username.toLowerCase();
        socket.join(user);
        if (mailBox[user]) socket.emit('load_mail', mailBox[user]);
        socket.emit('init_archive', archiveData);
    });
});

// Команда ПОЧТЫ: /send [ник] [текст]
bot.onText(/\/send (\w+) (.+)/, (msg, match) => {
    const target = match[1].toLowerCase();
    const text = match[2];
    const newMsg = { from: "SYSTEM", text: text, date: new Date().toLocaleTimeString() };
    if (!mailBox[target]) mailBox[target] = [];
    mailBox[target].push(newMsg);
    io.to(target).emit('new_mail', newMsg);
    bot.sendMessage(msg.chat.id, "✉️ Отправлено в почту.");
});

// Команда АРХИВА: /archive Тема сообщения | Само сообщение
bot.onText(/\/archive (.+)\|(.+)/, (msg, match) => {
    const title = match[1].trim();
    const content = match[2].trim();
    const entry = { title, content, timestamp: new Date().toLocaleString() };
    archiveData.push(entry);
    io.emit('new_archive_data', entry);
    bot.sendMessage(msg.chat.id, "📁 Добавлено в архив.");
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('CORE ONLINE'));
