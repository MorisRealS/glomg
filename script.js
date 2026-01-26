// --- DATABASE & CONFIG ---
const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: 4, uuid: "1101", rank: "Lead Operator", date: "12.05.2024" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: 4, uuid: "1011", rank: "Security Tech", date: "15.06.2024" },
    "sumber":   { name: "Sumber", pass: "0000", level: 5, uuid: "1110", rank: "Supply Manager", date: "01.01.2025" },
    "morisreal": { name: "МОРИС", pass: "123", level: 6, uuid: "1010", rank: "Director", date: "01.01.2020" }
};

const LOG_LINES = ["> SYNC_UUID...", "> ALERT: SCAN_DETECTED", "> REACTOR_STABLE", "> SUMBER_BUNKER: CONNECTED", "> DATA_CLEAN: 100%"];
const DATABASE_LOGS = [
    { title: "LOG_EVENT: 0x442", date: "24.01.2026", text: "Обнаружена попытка несанкционированного доступа к сектору Sumber. Протокол Zero Trust активирован. Все системы переведены в режим ожидания." },
    { title: "LOG_EVENT: 0x119", date: "25.01.2026", text: "Системное обновление V32.8 завершено успешно. Все UUID узлы синхронизированы. Ошибок в ядре не обнаружено." },
    { title: "LOG_EVENT: 0x901", date: "26.01.2026", text: "Аномальная активность в районе Призмы. Датчики зафиксировали всплеск темной энергии. Требуется дополнительное сканирование." }
];

let currentUser = null;
let currentUserID = "";
let guestConsoleInterval = null;
let sensorInterval = null;
const sound_type = new Audio('https://www.soundjay.com/communication/sounds/typewriter-key-1.mp3');
sound_type.volume = 0.05;

// --- ПЕРЕХОДЫ ---
function startTransition(targetId) {
    const fade = document.getElementById('fade');
    fade.classList.add('glitch-active');
    
    // Очистка
    if(guestConsoleInterval) clearInterval(guestConsoleInterval);
    if(sensorInterval) clearInterval(sensorInterval);

    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.add('hidden');
            s.scrollTop = 0;
        });
        
        const next = document.getElementById(targetId);
        if(next) next.classList.remove('hidden');

        if(targetId === 'scr-guest') startGuestConsole();
        if(targetId === 'scr-database') initDatabase();
        if(targetId === 'scr-sysdata') initSensors();
        if(targetId === 'scr-login') initMatrix();

        fade.classList.remove('glitch-active');
    }, 400);
}

// --- ЛОГИКА КОНСОЛИ (ФИКС: 5 СТРОК) ---
function startGuestConsole() {
    const box = document.getElementById('guest-console');
    if(!box) return;
    box.innerHTML = '';
    let i = 0;
    
    guestConsoleInterval = setInterval(() => {
        const p = document.createElement('p');
        p.innerText = LOG_LINES[i];
        box.insertBefore(p, box.firstChild);
        
        // Удаляем старые, если больше 5
        while(box.childNodes.length > 5) {
            box.removeChild(box.lastChild);
        }
        i = (i + 1) % LOG_LINES.length;
    }, 1500);
}

// --- БАЗА ДАННЫХ (ЛОГИ С КНОПКОЙ) ---
function initDatabase() {
    const list = document.getElementById('db-logs-list');
    if(!list) return;
    
    list.innerHTML = DATABASE_LOGS.map((log, index) => `
        <div class="db-log-item">
            <div class="db-log-header">
                <button class="btn-ui db-expand-btn" onclick="toggleLog(${index})">OPEN</button>
                <span style="font-weight:bold;">${log.title}</span>
                <small style="margin-left:auto; opacity:0.5;">${log.date}</small>
            </div>
            <div id="log-body-${index}" class="db-log-content">
                ${log.text}
            </div>
        </div>
    `).join('');
}

function toggleLog(index) {
    const body = document.getElementById(`log-body-${index}`);
    const btn = body.previousElementSibling.querySelector('.db-expand-btn');
    const isOpen = body.classList.toggle('open');
    btn.innerText = isOpen ? "CLOSE" : "OPEN";
}

// --- ЛОГИН, СИСТЕМА, ПРОФИЛЬ ---
function processLogin() {
    const id = document.getElementById('inp-id').value.toLowerCase().trim();
    const pass = document.getElementById('inp-pass').value.trim();
    if (PROFILES[id] && PROFILES[id].pass === pass) {
        currentUser = PROFILES[id];
        currentUserID = id;
        document.getElementById('p-name-val').innerText = currentUser.name;
        document.getElementById('p-uuid-val').innerText = currentUser.uuid;
        document.getElementById('welcome-user-name').innerText = currentUser.name;
        startTransition('scr-dash');
    } else {
        document.getElementById('login-output').innerText = "ACCESS_DENIED";
    }
}

function initSensors() {
    sensorInterval = setInterval(() => {
        let cpu = Math.floor(Math.random() * 20) + 10;
        let temp = Math.floor(Math.random() * 5) + 40;
        document.getElementById('bar-cpu').style.width = cpu + "%";
        document.getElementById('val-cpu').innerText = cpu + "%";
        document.getElementById('bar-temp').style.width = (temp * 1.5) + "%";
        document.getElementById('val-temp').innerText = temp + "°C";
    }, 2000);
}

function playTypingSound() { sound_type.currentTime = 0; sound_type.play().catch(()=>{}); }
function toggleSidebar(s) { document.getElementById('sidebar').classList.toggle('open', s); }
function openProfile() { document.getElementById('modal-profile').classList.remove('hidden'); toggleSidebar(false); }
function closeProfile() { document.getElementById('modal-profile').classList.add('hidden'); }

window.onload = () => {
    setTimeout(() => {
        document.getElementById('intro-logo').classList.remove('hidden');
        setTimeout(() => startTransition('scr-login'), 2500);
    }, 1000);
    setInterval(() => {
        const c = document.getElementById('clock');
        if(c) c.innerText = new Date().toLocaleTimeString();
    }, 1000);
};
