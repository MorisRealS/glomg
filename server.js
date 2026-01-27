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
const userState = {}; // Состояния для пошагового ввода

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

// --- НОВАЯ ЛОГИКА: КНОПКИ И СОСТОЯНИЯ ---

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text) return;

    // Команда вызова меню (Пункт 1)
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

    // Пошаговый ввод для Архива (Пункт 2)
    if (userState[chatId]) {
        const state = userState[chatId];

        if (state.step === 'WAIT_TITLE') {
            state.title = text;
            state.step = 'WAIT_CONTENT';
            return bot.sendMessage(chatId, `✅ Тема: "${text}"\n\nТеперь введите текст для архива:`);
        }

        if (state.step === 'WAIT_CONTENT') {
            const entry = { title: state.title, content: text, timestamp: new Date().toLocaleString() };
            archiveData.push(entry);
            io.emit('new_archive_data', entry);
            delete userState[chatId];
            return bot.sendMessage(chatId, `🚀 ЗАПИСЬ ОПУБЛИКОВАНА: ${entry.title}`);
        }
    }
});

// Обработка кликов по кнопкам
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;

    if (query.data === 'btn_add_archive') {
        userState[chatId] = { step: 'WAIT_TITLE' };
        bot.sendMessage(chatId, "📝 Введите ТЕМУ новой записи:");
    }

    if (query.data === 'btn_info_mail') {
        bot.sendMessage(chatId, "📨 Для отправки почты используй:\n`/send [ник] [текст]`");
    }

    bot.answerCallbackQuery(query.id);
});

// --- НОВАЯ ЛОГИКА: СИСТЕМНЫЙ ВЕЩАТЕЛЬ (Колокольчик) ---

bot.onText(/\/broadcast (.+)/, (msg, match) => {
    const text = match[1];
    const systemMsg = { 
        from: "CORE_SYSTEM", 
        text: `⚠️ ГЛОБАЛЬНОЕ УВЕДОМЛЕНИЕ: ${text}`, 
        date: new Date().toLocaleTimeString() 
    };
    
    // Рассылаем всем пользователям (у них на сайте мигнет колокольчик)
    io.emit('new_mail', systemMsg); 
    bot.sendMessage(msg.chat.id, "📢 Системное сообщение отправлено на все терминалы.");
});

// --- ТВОЙ ИСХОДНЫЙ КОД (БЕЗ ИЗМЕНЕНИЙ) ---

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
    bot.sendMessage(msg.chat.id, `📁 ПРИНЯТО В АРХИВ: ${title}`);
});

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
