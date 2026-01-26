const PROFILES = {
    "kiddy": { name: "Kiddy", pass: "1111", uuid: "1101", lvl: "A1", rank: "Lead", date: "12.05.2024" },
    "dykzxz": { name: "Dykzxz", pass: "2222", uuid: "1011", lvl: "B3", rank: "Tech", date: "15.06.2024" },
    "morisreal": { name: "МОРИС", pass: "123", uuid: "1010", lvl: "S1", rank: "Director", date: "01.01.2020" }
};

const LOG_LINES = [
    "> SYNCING_UUID...", 
    "> ENCRYPTING_CHANNEL...", 
    "> CORE_STABLE", 
    "> MEMORY_CLEAN_OK", 
    "> ACCESS_LOGGED", 
    "> RADAR_SYNCED"
];

const ARCHIVE = [
    { t: "LOG_0x442", d: "24.01.2026", txt: "Зафиксирована попытка несанкционированного доступа к порту 8080. Протокол Zero-Trust активирован." },
    { t: "LOG_0x901", d: "26.01.2026", txt: "Аномалия в секторе Призма. Датчики зафиксировали всплеск темной материи. Требуется калибровка." }
];

let guestInt = null;
let sensorInt = null;
const typingSnd = new Audio('https://www.soundjay.com/communication/sounds/typewriter-key-1.mp3');
typingSnd.volume = 0.1;

// --- ПЕРЕХОДЫ ---
function startTransition(id) {
    const fade = document.getElementById('fade');
    fade.classList.add('glitch-active');
    
    // Очистка интервалов при уходе с экрана
    if(guestInt) clearInterval(guestInt);
    if(sensorInt) clearInterval(sensorInt);

    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        const target = document.getElementById(id);
        if(target) {
            target.classList.remove('hidden');
            target.scrollTop = 0;
        }

        // Запуск логики конкретных экранов
        if(id === 'scr-guest') initGuestConsole();
        if(id === 'scr-sysdata') initSensors();
        if(id === 'scr-database') initDatabase();
        
        fade.classList.remove('glitch-active');
    }, 400);
}

// --- ГОСТЬ: КОНСОЛЬ (СТРОГО 5 СТРОК) ---
function initGuestConsole() {
    const box = document.getElementById('guest-console');
    box.innerHTML = '';
    guestInt = setInterval(() => {
        const p = document.createElement('p');
        p.innerText = LOG_LINES[Math.floor(Math.random() * LOG_LINES.length)];
        box.insertBefore(p, box.firstChild);
        
        if(box.childNodes.length > 5) {
            box.removeChild(box.lastChild);
        }
    }, 1500);
}

// --- РАДАР: УМЕНЬШЕННЫЙ + СКРОЛЛ ---
function initRadar() {
    startTransition('scr-map');
    const nodes = [
        { x: 45, y: 50, n: "CENTRAL_HQ" },
        { x: 70, y: 30, n: "PRISM_GATE" },
        { x: 25, y: 75, n: "BUNKER_01" }
    ];
    const container = document.getElementById('radar-nodes');
    container.innerHTML = '';
    
    nodes.forEach(node => {
        const d = document.createElement('div');
        d.className = 'node ong';
        d.style.left = node.x + '%';
        d.style.top = node.y + '%';
        d.onclick = () => {
            document.getElementById('p-title').innerText = "OBJECT: " + node.n;
            document.getElementById('p-text').innerText = `Координаты: ${node.x}, ${node.y}. Статус: Стабилен. UUID объекта подтвержден.`;
            // Плавный скролл вниз к информации
            document.getElementById('scr-map').scrollTo({ top: 350, behavior: 'smooth' });
        };
        container.appendChild(d);
    });
}

// --- ДАТЧИКИ ---
function initSensors() {
    sensorInt = setInterval(() => {
        let cpu = Math.floor(Math.random() * 20) + 15;
        let temp = Math.floor(Math.random() * 8) + 42;
        document.getElementById('bar-cpu').style.width = cpu + "%";
        document.getElementById('val-cpu').innerText = cpu + "%";
        document.getElementById('bar-temp').style.width = (temp * 1.5) + "%";
        document.getElementById('val-temp').innerText = temp + "°C";
    }, 2000);
}

// --- БАЗА ДАННЫХ ---
function initDatabase() {
    const list = document.getElementById('db-logs-list');
    list.innerHTML = ARCHIVE.map((log, i) => `
        <div class="db-log-item">
            <div class="db-log-header">
                <button class="db-expand-btn" onclick="this.parentElement.nextElementSibling.classList.toggle('open')">OPEN</button>
                <span>${log.t}</span>
                <small style="margin-left:auto; opacity:0.5;">${log.d}</small>
            </div>
            <div class="db-log-content">${log.txt}</div>
        </div>
    `).join('');
}

// --- ЛОГИН ---
function processLogin() {
    const id = document.getElementById('inp-id').value.toLowerCase().trim();
    const ps = document.getElementById('inp-pass').value.trim();
    
    if (PROFILES[id] && PROFILES[id].pass === ps) {
        const user = PROFILES[id];
        document.getElementById('welcome-user-name').innerText = user.name;
        // Данные в профиль
        document.getElementById('p-name-val').innerText = user.name;
        document.getElementById('p-uuid-val').innerText = user.uuid;
        document.getElementById('p-lvl-text-val').innerText = user.lvl;
        document.getElementById('p-rank-val').innerText = user.rank;
        document.getElementById('p-date-val').innerText = user.date;
        startTransition('scr-dash');
    } else {
        document.getElementById('login-output').innerText = "ACCESS_DENIED";
        document.getElementById('login-output').style.color = "red";
    }
}

// --- ВСПОМОГАТЕЛЬНОЕ ---
function playTypingSound() { typingSnd.currentTime = 0; typingSnd.play().catch(()=>{}); }

function toggleSidebar(s) { 
    document.getElementById('sidebar').classList.toggle('open', s); 
    document.getElementById('side-overlay').style.display = s ? 'block' : 'none';
}

function openProfile() { 
    document.getElementById('modal-profile').classList.remove('hidden'); 
    toggleSidebar(false); 
}

function closeProfile() { 
    document.getElementById('modal-profile').classList.add('hidden'); 
}

// --- ЗАПУСК ---
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
