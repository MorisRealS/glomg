const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const TelegramBot = require('node-telegram-bot-api');

// Твой актуальный токен
const TOKEN = '8117485520:AAF4oGiiFI18knK_VPGu5M0bVBC465lsSzs'; 
const bot = new TelegramBot(TOKEN, {polling: true});

let mailBox = {};
let archiveData = [];

app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

io.on('connection', (socket) => {
    console.log('[SOCKET] Новый пользователь подключился');

    socket.on('auth', (username) => {
        const user = username.toLowerCase();
        socket.join(user);
        console.log(`[AUTH] Оператор ${user} вошел в систему`);
        
        // Сразу отправляем накопленные данные
        if (mailBox[user]) socket.emit('load_mail', mailBox[user]);
        socket.emit('init_archive', archiveData);
    });
});

// Команда АРХИВА: /archive Тема | Текст
bot.onText(/\/archive (.+)/, (msg, match) => {
    const rawText = match[1];
    let title, content;

    if (rawText.includes('|')) {
        const parts = rawText.split('|');
        title = parts[0].trim();
        content = parts[1].trim();
    } else {
        title = "LOG_" + Math.floor(Math.random() * 999);
        content = rawText.trim();
    }

    const entry = { title, content, timestamp: new Date().toLocaleString() };
    archiveData.push(entry);
    
    // Рассылаем всем подключенным клиентам
    io.emit('new_archive_data', entry);
    bot.sendMessage(msg.chat.id, `📁 ПРИНЯТО В АРХИВ: ${title}`);
});

// Команда ПОЧТЫ: /send [ник] [текст]
bot.onText(/\/send (\w+) (.+)/, (msg, match) => {
    const target = match[1].toLowerCase();
    const text = match[2];
    const newMsg = { from: "SYSTEM", text: text, date: new Date().toLocaleTimeString() };
    
    if (!mailBox[target]) mailBox[target] = [];
    mailBox[target].push(newMsg);
    
    io.to(target).emit('new_mail', newMsg);
    bot.sendMessage(msg.chat.id, `✉️ Сообщение для ${target} отправлено.`);
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('--- CORE ONLINE ---'));
