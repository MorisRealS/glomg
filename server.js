const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const TelegramBot = require('node-telegram-bot-api');

// --- 1. НАСТРОЙКИ СИСТЕМЫ ---
const SUPABASE_URL = 'https://svcafgfruyehllzzfmml.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Rj_xPyWk0cO_pwoT7IaMkA_CcwrhM7B';

// ВСТАВЬ СВОЙ СЕКРЕТНЫЙ КЛЮЧ НИЖЕ
const SUPABASE_SERVICE_KEY = 'sb_secret_chajhWezR0LZ_byvw5r5qw_mMlyumkr'; 

// ВСТАВЬ СВОЙ ID ИЗ @userinfobot НИЖЕ
const MY_TELEGRAM_ID = '1865307845'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const TOKEN = '8117485520:AAGmoirMAsrxWtgF2R72YyjkV4Z5MSfI-BQ'; 
const bot = new TelegramBot(TOKEN, {polling: true});

let archiveData = []; // Для временного хранения архива в сессии

app.use(express.static(__dirname));

// --- 2. МАРШРУТЫ (САЙТ) ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'autorize.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));

// Ссылка для Cron-job.org (проверка почты раз в минуту)
app.get('/check', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('is_read', false);

        if (data && data.length > 0) {
            for (let msg of data) {
                const report = `📩 **НОВОЕ ПИСЬМО С САЙТА**\n\n` +
                               `👤 **ОТ:** ${msg.sender}\n` +
                               `🎯 **КОМУ:** ${msg.recipient}\n` +
                               `📂 **ТЕМА:** ${msg.subject}\n` +
                               `📄 **ТЕКСТ:** ${msg.body}`;

                await bot.sendMessage(MY_TELEGRAM_ID, report, { parse_mode: 'Markdown' });
                await supabase.from('messages').update({ is_read: true }).eq('id', msg.id);
            }
        }
        res.status(200).send('OK');
    } catch (err) {
        res.status(500).send('Error');
    }
});

// --- 3. ЛОГИКА SOCKET.IO ---
io.on('connection', (socket) => {
    socket.on('auth', (username) => {
        socket.join(username.toLowerCase());
    });

    socket.on('send_mail_from_web', async (data) => {
        const { to, subj, body, from } = data;
        
        // 1. Сохраняем в Supabase
        await supabase.from('messages').insert([{ 
            sender: from, recipient: to, subject: subj, body: body, is_read: false 
        }]);

        // 2. Мгновенно шлем в Телеграм
        const fastReport = `⚡️ **ЭКСТРЕННОЕ СООБЩЕНИЕ**\n${from} -> ${to}\n\n${body}`;
        bot.sendMessage(MY_TELEGRAM_ID, fastReport);
        
        // 3. Дублируем на экран получателю (если он онлайн)
        io.to(to.toLowerCase()).emit('new_mail', { 
            from: from, 
            text: `[${subj}] ${body}`, 
            date: new Date().toLocaleTimeString() 
        });
    });
});

// --- 4. КОМАНДЫ БОТА ---
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "🛠 G.L.O.M.G. CORE ONLINE\nЯ буду присылать сообщения с сайта сюда.");
});

// Глобальная рассылка на все открытые вкладки сайта
bot.onText(/\/broadcast (.+)/, (msg, match) => {
    const text = match[1];
    io.emit('new_mail', { 
        from: "CORE_SYSTEM", 
        text: `⚠️ УВЕДОМЛЕНИЕ: ${text}`, 
        date: new Date().toLocaleTimeString() 
    });
    bot.sendMessage(msg.chat.id, "📢 Рассылка выполнена.");
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('--- SYSTEM READY ---'));
