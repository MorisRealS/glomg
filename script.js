const PROFILES = {
    "kiddy": { name: "Kiddy", pass: "1111", uuid: "1101", lvl: "A1", rank: "Lead" },
    "dykzxz": { name: "Dykzxz", pass: "2222", uuid: "1011", lvl: "B3", rank: "Tech" },
    "morisreal": { name: "МОРИС", pass: "123", uuid: "1010", lvl: "S1", rank: "Director" }
};
const LOGS = ["> SYNC...", "> UUID_CHECK...", "> CORE_STABLE", "> MEM_CLEAN", "> ACCESS_LOGGED"];
const ARCHIVE_DATA = [
    { t: "LOG_0x442", d: "24.01.2026", txt: "Зафиксирована попытка взлома порта 8080 в секторе Sumber. Протокол защиты 'Zero' активирован." },
    { t: "LOG_0x901", d: "26.01.2026", txt: "Аномальный всплеск энергии в зоне Призмы. Рекомендуется ручная калибровка датчиков." }
];

let gInt = null, sInt = null;
const snd = new Audio('https://www.soundjay.com/communication/sounds/typewriter-key-1.mp3');
snd.volume = 0.1;

function startTransition(id) {
    const fade = document.getElementById('fade');
    fade.classList.add('glitch-active');
    clearInterval(gInt); clearInterval(sInt);
    
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        const next = document.getElementById(id);
        if(next) { next.classList.remove('hidden'); next.scrollTop = 0; }
        
        if(id === 'scr-guest') startGuestConsole();
        if(id === 'scr-sysdata') startSensors();
        if(id === 'scr-database') startDatabase();
        
        fade.classList.remove('glitch-active');
    }, 400);
}

// РАДАР (ВОССТАНОВЛЕН)
function initRadar() {
    startTransition('scr-map');
    const nodes = [
        { x: 40, y: 50, name: "CENTRAL_HQ" },
        { x: 75, y: 30, name: "PRISM_SECTOR" },
        { x: 20, y: 70, name: "BUNKER_01" }
    ];
    const container = document.getElementById('radar-nodes');
    container.innerHTML = '';
    nodes.forEach(n => {
        const div = document.createElement('div');
        div.className = 'node ong';
        div.style.left = n.x + '%';
        div.style.top = n.y + '%';
        div.onclick = () => {
            document.getElementById('p-title').innerText = "OBJECT: " + n.name;
            document.getElementById('p-text').innerText = `Координаты: ${n.x}, ${n.y}. Статус: Активен.`;
        };
        container.appendChild(div);
    });
}

// КОНСОЛЬ (5 СТРОК)
function startGuestConsole() {
    const box = document.getElementById('guest-console');
    box.innerHTML = ''; let i = 0;
    gInt = setInterval(() => {
        const p = document.createElement('p');
        p.innerText = LOGS[i];
        box.insertBefore(p, box.firstChild);
        if(box.childNodes.length > 5) box.removeChild(box.lastChild);
        i = (i + 1) % LOGS.length;
    }, 1500);
}

// ДАТЧИКИ
function startSensors() {
    sInt = setInterval(() => {
        let cpu = Math.floor(Math.random()*20)+15;
        let temp = Math.floor(Math.random()*10)+45;
        document.getElementById('bar-cpu').style.width = cpu + "%";
        document.getElementById('val-cpu').innerText = cpu + "%";
        document.getElementById('bar-temp').style.width = (temp*1.2) + "%";
        document.getElementById('val-temp').innerText = temp + "°C";
    }, 1500);
}

// БАЗА ДАННЫХ
function startDatabase() {
    document.getElementById('db-logs-list').innerHTML = ARCHIVE_DATA.map((l, i) => `
        <div class="db-log-item">
            <div class="db-log-header">
                <button class="db-expand-btn" onclick="this.parentElement.nextElementSibling.classList.toggle('open')">OPEN</button>
                <span>${l.t}</span><small style="margin-left:auto">${l.d}</small>
            </div>
            <div class="db-log-content">${l.txt}</div>
        </div>
    `).join('');
}

function processLogin() {
    const id = document.getElementById('inp-id').value.toLowerCase().trim();
    const ps = document.getElementById('inp-pass').value.trim();
    if(PROFILES[id] && PROFILES[id].pass === ps) {
        const u = PROFILES[id];
        document.getElementById('welcome-user-name').innerText = u.name;
        document.getElementById('p-name-val').innerText = u.name;
        document.getElementById('p-uuid-val').innerText = u.uuid;
        document.getElementById('p-lvl-text-val').innerText = u.lvl;
        document.getElementById('p-rank-val').innerText = u.rank;
        startTransition('scr-dash');
    } else {
        document.getElementById('login-output').innerText = "ACCESS_DENIED";
    }
}

function playTypingSound() { snd.currentTime = 0; snd.play().catch(()=>{}); }
function toggleSidebar(s) { 
    document.getElementById('sidebar').classList.toggle('open', s); 
    document.getElementById('side-overlay').style.display = s ? 'block' : 'none';
}
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
