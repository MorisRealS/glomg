const PROFILES = {
    "kiddy": { name: "Kiddy", pass: "1111", uuid: "1101", lvl: 4, rank: "Lead", date: "12.05.2024" },
    "dykzxz": { name: "Dykzxz", pass: "2222", uuid: "1011", lvl: 3, rank: "Tech", date: "15.06.2024" },
    "morisreal": { name: "МОРИС", pass: "123", uuid: "1010", lvl: 6, rank: "Director", date: "01.01.2020" }
};
const LOG_LINES = ["> SYNCING...", "> UUID_CHECK...", "> CORE_STABLE", "> MEMORY_CLEAN", "> ACCESS_LOGGED"];
const ARCHIVE = [{t:"EVENT_0x442", d:"24.01.26", txt:"Попытка доступа к сектору Sumber. Zero Trust активен."}];

let gInt = null, sInt = null;
const snd = new Audio('https://www.soundjay.com/communication/sounds/typewriter-key-1.mp3');
snd.volume = 0.1;

function startTransition(id) {
    document.getElementById('fade').classList.add('glitch-active');
    clearInterval(gInt); clearInterval(sInt);
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        const n = document.getElementById(id);
        if(n) { n.classList.remove('hidden'); n.scrollTop = 0; }
        if(id === 'scr-guest') startGuest();
        if(id === 'scr-sysdata') initSensors();
        if(id === 'scr-database') initDB();
        document.getElementById('fade').classList.remove('glitch-active');
    }, 400);
}

function startGuest() {
    const b = document.getElementById('guest-console'); b.innerHTML = ''; let i = 0;
    gInt = setInterval(() => {
        const p = document.createElement('p'); p.innerText = LOG_LINES[i];
        b.insertBefore(p, b.firstChild);
        if(b.childNodes.length > 5) b.removeChild(box.lastChild); // Удаляем 6-ю строку
        i = (i + 1) % LOG_LINES.length;
    }, 1200);
}

function initSensors() {
    sInt = setInterval(() => {
        let c = Math.floor(Math.random()*20)+10, t = Math.floor(Math.random()*10)+40;
        document.getElementById('bar-cpu').style.width = c + "%";
        document.getElementById('val-cpu').innerText = c + "%";
        document.getElementById('bar-temp').style.width = (t*1.5) + "%";
        document.getElementById('val-temp').innerText = t + "°C";
    }, 1500);
}

function initializeTacticalRadar() {
    startTransition('scr-map');
    document.getElementById('radar-nodes').innerHTML = '<div class="node ong" style="left:50%;top:45%" onclick="document.getElementById(\'p-title\').innerText=\'HQ DETECTED\'"></div>';
}

function processLogin() {
    const id = document.getElementById('inp-id').value.toLowerCase().trim();
    const ps = document.getElementById('inp-pass').value.trim();
    if(PROFILES[id] && PROFILES[id].pass === ps) {
        const u = PROFILES[id];
        document.getElementById('welcome-user-name').innerText = u.name;
        document.getElementById('p-name-val').innerText = u.name;
        document.getElementById('p-uuid-val').innerText = u.uuid;
        document.getElementById('p-lvl-val').innerText = u.lvl;
        document.getElementById('p-rank-val').innerText = u.rank;
        document.getElementById('p-date-val').innerText = u.date;
        startTransition('scr-dash');
    } else document.getElementById('login-output').innerText = "DENIED";
}

function initDB() {
    document.getElementById('db-logs-list').innerHTML = ARCHIVE.map((l, i) => `
        <div class="db-log-item">
            <div class="db-log-header">
                <button class="db-expand-btn" onclick="this.parentElement.nextElementSibling.classList.toggle('open')">OPEN</button>
                <span>${l.t}</span><small style="margin-left:auto">${l.d}</small>
            </div>
            <div class="db-log-content">${l.txt}</div>
        </div>
    `).join('');
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
    setInterval(() => { if(document.getElementById('clock')) document.getElementById('clock').innerText = new Date().toLocaleTimeString(); }, 1000);
};
