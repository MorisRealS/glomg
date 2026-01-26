const PROFILES = {
    "kiddy": { name: "Kiddy", pass: "1111", uuid: "1101" },
    "dykzxz": { name: "Dykzxz", pass: "2222", uuid: "1011" },
    "sumber": { name: "Sumber", pass: "0000", uuid: "1110" },
    "morisreal": { name: "МОРИС", pass: "123", uuid: "1010" }
};

const LOG_LINES = ["> SYNCING...", "> UUID_CHECK...", "> CORE_STABLE", "> MEMORY_CLEAN", "> ACCESS_LOGGED"];
const DATABASE_LOGS = [
    { title: "LOG_EVENT: 0x442", date: "24.01.2026", text: "Обнаружена попытка доступа к сектору Sumber. Протокол Zero Trust активен." },
    { title: "LOG_EVENT: 0x119", date: "25.01.2026", text: "Обновление ядра V32.8 завершено. Все узлы синхронизированы." },
    { title: "LOG_EVENT: 0x901", date: "26.01.2026", text: "Аномалия в районе Призмы. Датчики зафиксировали всплеск энергии." }
];

let guestInterval = null;
let sensorInterval = null;

function startTransition(targetId) {
    const fade = document.getElementById('fade');
    fade.classList.add('glitch-active');
    
    if(guestInterval) clearInterval(guestInterval);
    if(sensorInterval) clearInterval(sensorInterval);

    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        const next = document.getElementById(targetId);
        if(next) {
            next.classList.remove('hidden');
            next.scrollTop = 0;
        }

        if(targetId === 'scr-guest') startGuestConsole();
        if(targetId === 'scr-database') initDatabase();
        if(targetId === 'scr-sysdata') initSensors();

        fade.classList.remove('glitch-active');
    }, 400);
}

// КОНСОЛЬ: СТРОГО 5 СТРОК
function startGuestConsole() {
    const box = document.getElementById('guest-console');
    if(!box) return;
    box.innerHTML = '';
    let i = 0;
    guestInterval = setInterval(() => {
        const p = document.createElement('p');
        p.innerText = LOG_LINES[i];
        box.insertBefore(p, box.firstChild);
        if(box.childNodes.length > 5) box.removeChild(box.lastChild);
        i = (i + 1) % LOG_LINES.length;
    }, 1500);
}

// БАЗА ДАННЫХ
function initDatabase() {
    const list = document.getElementById('db-logs-list');
    if(!list) return;
    list.innerHTML = DATABASE_LOGS.map((log, index) => `
        <div class="db-log-item">
            <div class="db-log-header">
                <button class="db-expand-btn" onclick="toggleLog(${index})">OPEN</button>
                <span>${log.title}</span>
                <small style="margin-left:auto; opacity:0.5;">${log.date}</small>
            </div>
            <div id="log-body-${index}" class="db-log-content">${log.text}</div>
        </div>
    `).join('');
}

function toggleLog(idx) {
    const body = document.getElementById(`log-body-${idx}`);
    const btn = body.previousElementSibling.querySelector('.db-expand-btn');
    const open = body.classList.toggle('open');
    btn.innerText = open ? "CLOSE" : "OPEN";
}

// ЛОГИН
function processLogin() {
    const id = document.getElementById('inp-id').value.toLowerCase().trim();
    const pass = document.getElementById('inp-pass').value.trim();
    if(PROFILES[id] && PROFILES[id].pass === pass) {
        document.getElementById('welcome-user-name').innerText = PROFILES[id].name;
        startTransition('scr-dash');
    } else {
        document.getElementById('login-output').innerText = "ACCESS_DENIED";
    }
}

// СИСТЕМА
function initSensors() {
    sensorInterval = setInterval(() => {
        let cpu = Math.floor(Math.random()*20)+10;
        let temp = Math.floor(Math.random()*5)+40;
        document.getElementById('bar-cpu').style.width = cpu + "%";
        document.getElementById('val-cpu').innerText = cpu + "%";
        document.getElementById('bar-temp').style.width = (temp*1.5) + "%";
        document.getElementById('val-temp').innerText = temp + "°C";
    }, 2000);
}

function toggleSidebar(s) { document.getElementById('sidebar').classList.toggle('open', s); }

// ЗАГРУЗКА
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
