// --- КОНФИГУРАЦИЯ СИСТЕМЫ ---
const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: 4, uuid: "1101", rank: "Lead Operator", date: "12.05.2024" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: 4, uuid: "1011", rank: "Security Tech", date: "15.06.2024" },
    "sumber":   { name: "Sumber", pass: "0000", level: 5, uuid: "1110", rank: "Supply Manager", date: "01.01.2025" },
    "morisreal": { name: "МОРИС", pass: "123", level: 6, uuid: "1010", rank: "Director", date: "01.01.2020" }
};

const STAFF_QUOTES = [
    "Чистота кода — залог стабильности ядра.",
    "Сектор 'Призма' проявляет активность. Будьте бдительны.",
    "Обновление V32.8 стабильно. Проверьте свои UUID."
];

const LOG_LINES = ["> SYNC_UUID...", "> ALERT: SCAN_DETECTED", "> REACTOR_STABLE", "> SUMBER_BUNKER: CONNECTED", "> DATA_CLEAN: 100%"];

let currentUser = null;
let currentUserID = "";
let matrixInterval = null;
const sound_type = new Audio('https://www.soundjay.com/communication/sounds/typewriter-key-1.mp3');
sound_type.volume = 0.05;

// --- ФУНКЦИЯ ПЕРЕХОДА (ИСПРАВЛЕНА) ---
function startTransition(targetId) {
    console.log("Switching to: " + targetId); // Лог для отладки
    const fade = document.getElementById('fade');
    
    // Эффект помех при переходе
    fade.classList.add('glitch-active');
    
    setTimeout(() => {
        // Скрываем ВСЕ экраны
        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => s.classList.add('hidden'));
        
        // Показываем нужный
        const next = document.getElementById(targetId);
        if(next) {
            next.classList.remove('hidden');
        } else {
            console.error("Screen not found: " + targetId);
        }
        
        // Запуск специфических функций экрана
        if(targetId === 'scr-dash' || targetId === 'scr-messages') checkMessages();
        if(targetId === 'scr-guest') startGuestConsole();
        if(targetId === 'scr-sysdata') initSensors();
        if(targetId === 'scr-login') initMatrix(currentUser?.name === 'МОРИС' ? "#FFD700" : "#A855F7");
        
        fade.classList.remove('glitch-active');
    }, 400);
}

// --- ЛОГИКА ЗАГРУЗКИ (BOOT SEQUENCE) ---
window.onload = () => {
    console.log("OS G.L.O.M.G. Booting...");
    
    const introText = document.getElementById('intro-ascii');
    const introLogo = document.getElementById('intro-logo');

    // 1. Показываем текст загрузки
    setTimeout(() => {
        if(introText) introText.innerText = "SYSTEM_V32.8_STARTING...";
        
        // 2. Через 1 сек показываем Лого №1
        setTimeout(() => {
            if(introLogo) introLogo.classList.remove('hidden');
            
            // 3. Через 2.5 сек ПРИНУДИТЕЛЬНО переходим к логину
            setTimeout(() => {
                startTransition('scr-login');
            }, 2500);
            
        }, 1000);
    }, 500);

    // Инициализация часов
    setInterval(() => {
        const c = document.getElementById('clock');
        if(c) c.innerText = new Date().toLocaleTimeString();
    }, 1000);
};

// --- АВТОРИЗАЦИЯ ---
function processLogin() {
    const id = document.getElementById('inp-id').value.toLowerCase().trim();
    const pass = document.getElementById('inp-pass').value.trim();
    const output = document.getElementById('login-output');

    // Визуальный сканер
    const sc = document.createElement('div'); 
    sc.className = 'login-scanner';
    document.querySelector('.login-frame').appendChild(sc);

    setTimeout(() => {
        sc.remove();
        if (PROFILES[id] && PROFILES[id].pass === pass) {
            currentUser = PROFILES[id];
            currentUserID = id;
            
            // Настройка интерфейса под юзера
            document.getElementById('p-name-val').innerText = currentUser.name;
            document.getElementById('p-uuid-val').innerText = currentUser.uuid;
            document.getElementById('p-lvl-text-val').innerText = currentUser.level;
            document.getElementById('p-rank-val').innerText = currentUser.rank;
            document.getElementById('p-date-val').innerText = currentUser.date;
            document.getElementById('welcome-user-name').innerText = currentUser.name;
            document.getElementById('staff-message-gen').innerText = STAFF_QUOTES[Math.floor(Math.random()*STAFF_QUOTES.length)];

            startTransition('scr-dash');
        } else {
            output.innerText = "ACCESS_DENIED";
            output.style.color = "red";
            playTypingSound();
        }
    }, 1200);
}

// --- МАТРИЦА (ФОН) ---
function initMatrix(color = "#A855F7") {
    const canvas = document.getElementById('matrix-bg');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
    
    const drops = Array(Math.floor(canvas.width / 15)).fill(1);
    if(matrixInterval) clearInterval(matrixInterval);
    
    matrixInterval = setInterval(() => {
        ctx.fillStyle = "rgba(0,0,0,0.05)"; 
        ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.fillStyle = color; 
        ctx.font = "15px monospace";
        
        drops.forEach((y, i) => {
            const text = Math.floor(Math.random()*2);
            ctx.fillText(text, i*15, y*15);
            if(y*15 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }, 35);
}

// --- СИСТЕМА СООБЩЕНИЙ ---
function sendMessage() {
    const to = document.getElementById('msg-recipient').value;
    const text = document.getElementById('msg-text').value;
    if(!text) return;

    let msgs = JSON.parse(localStorage.getItem('ong_msgs') || "[]");
    msgs.push({
        from: currentUser.name,
        to: to,
        text: text,
        time: new Date().toLocaleTimeString(),
        read: false
    });
    localStorage.setItem('ong_msgs', JSON.stringify(msgs));
    document.getElementById('msg-text').value = "";
    alert("UUID ПАКЕТ ПЕРЕДАН В СЕТЬ");
}

function checkMessages() {
    let msgs = JSON.parse(localStorage.getItem('ong_msgs') || "[]");
    let mine = msgs.filter(m => m.to === currentUserID);
    
    const alertBox = document.getElementById('msg-alert');
    if(alertBox) {
        if(mine.some(m => !m.read)) alertBox.classList.remove('hidden');
        else alertBox.classList.add('hidden');
    }

    const list = document.getElementById('messages-list');
    if(list) {
        list.innerHTML = mine.length ? mine.map(m => `
            <div class="msg-item ${m.read ? '' : 'unread'}">
                <small>[${m.time}] FROM_ID: ${m.from}</small>
                <p>${m.text}</p>
            </div>
        `).reverse().join('') : "НЕТ НОВЫХ СООБЩЕНИЙ.";
        
        // Помечаем как прочитанные
        msgs.forEach(m => { if(m.to === currentUserID) m.read = true; });
        localStorage.setItem('ong_msgs', JSON.stringify(msgs));
    }
}

// --- ТАКТИЧЕСКИЙ РАДАР ---
function initializeTacticalRadar() {
    startTransition('scr-map');
    const nodes = [
        {id: "ONG_HQ", x: 48, y: 35, info: "ЦЕНТРАЛЬНЫЙ ХАБ. Статус: Online."},
        {id: "SUMBER_BUNKER", x: 25, y: 25, info: "ХРАНИЛИЩЕ. Обнаружена попытка взлома."},
        {id: "PRISM_EYE", x: 75, y: 65, info: "ЗОНА ПРИЗМЫ. Обнаружен дрон-шпион."},
        {id: "DYK_REACTOR", x: 40, y: 80, info: "ЭНЕРГОБЛОК. Мощность 100%."}
    ];
    const cont = document.getElementById('radar-nodes');
    if(!cont) return;
    cont.innerHTML = '';
    nodes.forEach(n => {
        const d = document.createElement('div');
        d.className = 'node ong';
        d.style.left = n.x + '%'; d.style.top = n.y + '%';
        d.onclick = () => {
            document.getElementById('p-title').innerText = n.id;
            document.getElementById('p-text').innerText = n.info;
            document.getElementById('radar-scroll').scrollTo({ top: 500, behavior: 'smooth' });
        };
        cont.appendChild(d);
    });
}

// --- ДОПОЛНИТЕЛЬНЫЕ МОДУЛИ ---
function startGuestConsole() {
    const box = document.getElementById('guest-console');
    if(!box) return;
    box.innerHTML = '';
    let i = 0;
    const inter = setInterval(() => {
        if(document.getElementById('scr-guest').classList.contains('hidden')) { clearInterval(inter); return; }
        const p = document.createElement('p');
        p.innerText = LOG_LINES[i];
        box.insertBefore(p, box.firstChild);
        i = (i + 1) % LOG_LINES.length;
    }, 1500);
}

function initSensors() {
    setInterval(() => {
        if (document.getElementById('scr-sysdata').classList.contains('hidden')) return;
        let cpu = Math.floor(Math.random()*20)+10;
        let temp = Math.floor(Math.random()*5)+42;
        document.getElementById('val-cpu').innerText = cpu + "%";
        document.getElementById('bar-cpu').style.width = cpu + "%";
        document.getElementById('val-temp').innerText = temp + "°C";
        document.getElementById('bar-temp').style.width = (temp/100)*100 + "%";
    }, 2000);
}

// Вспомогательные функции
function playTypingSound() { sound_type.currentTime = 0; sound_type.play().catch(()=>{}); }
function toggleSidebar(s) { 
    document.getElementById('sidebar').classList.toggle('open', s); 
    document.getElementById('side-overlay').style.display = s ? 'block' : 'none'; 
}
function openProfile() { document.getElementById('modal-profile').classList.remove('hidden'); toggleSidebar(false); }
function closeProfile() { document.getElementById('modal-profile').classList.add('hidden'); }
