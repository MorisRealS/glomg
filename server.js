const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const TelegramBot = require('node-telegram-bot-api');

// --- НАСТРОЙКИ ---
const TOKEN = '8117485520:AAF4oGiiFI18knK_VPGu5M0bVBC465lsSzs'; 
const bot = new TelegramBot(TOKEN, {polling: true});
const MY_TELEGRAM_ID = 'ТВОЙ_ID_ЧАТА'; 

let mailBox = {};
let archiveData = [];
const userState = {}; 

app.use(express.static(__dirname));

// --- МАРШРУТИЗАЦИЯ (ROUTING) ---
// Главная точка входа теперь ведет на файл авторизации
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'autorize.html'));
});

// Маршрут для будущей панели управления
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Маршрут для гостевого доступа
app.get('/guest', (req, res) => {
    res.sendFile(path.join(__dirname, 'guest.html'));
});

// --- LOGIC SOCKET.IO ---
io.on('connection', (socket) => {
    console.log('[SOCKET] Оператор подключился к терминалу');

    socket.on('auth', (username) => {
        const user = username.toLowerCase();
        socket.join(user);
        console.log(`[AUTH] Оператор ${user} вошел в систему`);
        
        if (mailBox[user]) socket.emit('load_mail', mailBox[user]);
        socket.emit('init_archive', archiveData);
    });

    socket.on('send_mail_from_web', (data) => {
        const { to, subj, body, from } = data;
        const target = to.toLowerCase();
        const newMsg = { 
            from: from, 
            text: `[${subj}] ${body}`, 
            date: new Date().toLocaleTimeString() 
        };
        
        if (!mailBox[target]) mailBox[target] = [];
        mailBox[target].push(newMsg);
        
        io.to(target).emit('new_mail', newMsg);
        bot.sendMessage(MY_TELEGRAM_ID, `📩 С САЙТА: ${from} -> ${target}\nТема: ${subj}\n\n${body}`);
    });
});

// --- ИНТЕРФЕЙС БОТА И КОМАНДЫ ---
// (Оставляем без изменений, так как логика команд /broadcast, /archive и /send верна)
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text) return;

    if (text === '/glomg' || text === '/start') {
        delete userState[chatId]; 
        return bot.sendMessage(chatId, "🛠 ПАНЕЛЬ УПРАВЛЕНИЯ G.L.O.M.G.", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📁 Добавить в Архив", callback_data: "btn_add_archive" }],
                    [{ text: "✉️ Отправить Почту", callback_data: "btn_info_mail" }]
                ]
            }
        });
    }

    if (userState[chatId]) {
        const state = userState[chatId];
        if (state.step === 'WAIT_TITLE') {
            state.title = text;
            state.step = 'WAIT_CONTENT';
            return bot.sendMessage(chatId, `✅ Тема принята. Теперь введи содержимое:`);
        }
        if (state.step === 'WAIT_CONTENT') {
            const entry = { title: state.title, content: text, timestamp: new Date().toLocaleString() };
            archiveData.push(entry);
            io.emit('new_archive_data', entry);
            delete userState[chatId];
            return bot.sendMessage(chatId, `🚀 Опубликовано в архиве: ${entry.title}`);
        }
    }
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    if (query.data === 'btn_add_archive') {
        userState[chatId] = { step: 'WAIT_TITLE' };
        bot.sendMessage(chatId, "📝 Введите заголовок для архива:");
    }
    if (query.data === 'btn_info_mail') {
        bot.sendMessage(chatId, "📨 Используй команду:\n`/send [ник] [текст]`");
    }
    bot.answerCallbackQuery(query.id);
});

bot.onText(/\/broadcast (.+)/, (msg, match) => {
    const text = match[1];
    const systemMsg = { from: "CORE_SYSTEM", text: `⚠️ ГЛОБАЛЬНОЕ УВЕДОМЛЕНИЕ: ${text}`, date: new Date().toLocaleTimeString() };
    io.emit('new_mail', systemMsg); 
    bot.sendMessage(msg.chat.id, "📢 Системное сообщение разослано.");
});

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
    io.emit('new_archive_data', entry);
    bot.sendMessage(msg.chat.id, `📁 ПРИНЯТО: ${title}`);
});

bot.onText(/\/send (\w+) (.+)/, (msg, match) => {
    const target = match[1].toLowerCase();
    const text = match[2];
    const newMsg = { from: "SYSTEM", text: text, date: new Date().toLocaleTimeString() };
    if (!mailBox[target]) mailBox[target] = [];
    mailBox[target].push(newMsg);
    io.to(target).emit('new_mail', newMsg);
    bot.sendMessage(msg.chat.id, `✉️ Отправлено пользователю ${target}`);
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('--- CORE ONLINE (AUTORIZE_READY) ---'));
