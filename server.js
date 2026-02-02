const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const TelegramBot = require('node-telegram-bot-api');

// ==========================================================
// --- НАСТРОЙКИ (ЗАПОЛНИ ЭТИ ПОЛЯ) ---
// ==========================================================

const SUPABASE_URL = 'https://svcafgfruyehllzzfmml.supabase.co';

// 1. Вставь сюда длинный SECRET ключ (service_role) из Supabase
const SUPABASE_SERVICE_KEY = 'sb_secret_chajhWezR0LZ_byvw5r5qw_mMlyumkr'; 

// 2. Вставь сюда свой цифровой ID из Telegram (от @userinfobot)
const MY_TELEGRAM_ID = '1865307845'; 

// 3. Твой токен бота и Anon ключ (уже вставлены)
const SUPABASE_ANON_KEY = 'sb_publishable_Rj_xPyWk0cO_pwoT7IaMkA_CcwrhM7B';
const TOKEN = '8117485520:AAFU7M0LfFbvMDD_x5CGD_QGiRVrYtJWQpE'; 

// ==========================================================

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const bot = new TelegramBot(TOKEN, {polling: true});

app.use(express.static(__dirname));

// --- МАРШРУТЫ (ROUTING) ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'autorize.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/mail', (req, res) => {
    res.sendFile(path.join(__dirname, 'mail.html'));
});

app.get('/guest', (req, res) => {
    res.sendFile(path.join(__dirname, 'guest.html'));
});

// Ссылка для Cron-job.org
app.get('/check', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('is_read', false);

        if (data && data.length > 0) {
            for (let msg of data) {
                const report = `📩 **НОВОЕ ПИСЬМО С ТЕРМИНАЛА**\n\n` +
                               `👤 **ОТ:** ${msg.sender}\n` +
                               `🎯 **КОМУ:** ${msg.recipient}\n` +
                               `📂 **ТЕМА:** ${msg.subject}\n\n` +
                               `📄 **ТЕКСТ:**\n${msg.body}`;

                await bot.sendMessage(MY_TELEGRAM_ID, report, { parse_mode: 'Markdown' });
                await supabase.from('messages').update({ is_read: true }).eq('id', msg.id);
            }
        }
        res.status(200).send('OK');
    } catch (err) {
        res.status(500).send('Database Error');
    }
});

// --- ЛОГИКА SOCKET.IO ---
io.on('connection', (socket) => {
    console.log('[SYSTEM] Соединение установлено');

    socket.on('auth', (username) => {
        const userClean = username ? username.toLowerCase() : 'anonymous';
        socket.join(userClean);
        console.log(`[AUTH] Пользователь ${userClean} в сети`);
    });

    socket.on('send_mail_from_web', async (data) => {
        const { to, subj, body, from } = data;
        
        const { error } = await supabase.from('messages').insert([{ 
            sender: from || 'Unknown', 
            recipient: to, 
            subject: subj || 'No Subject', 
            body: body, 
            is_read: false 
        }]);

        if (error) console.error('[DB ERROR]', error);

        bot.sendMessage(MY_TELEGRAM_ID, `📩 **СООБЩЕНИЕ:**\n${from} -> ${to}\n${body}`);
        
        io.to(to.toLowerCase()).emit('new_mail', { 
            from, 
            text: `[${subj}] ${body}`, 
            date: new Date().toLocaleTimeString() 
        });
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`--- SERVER STARTED ON PORT ${PORT} ---`));
