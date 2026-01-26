// БАЗА ДАННЫХ ПОЛЬЗОВАТЕЛЕЙ И УРОВНЕЙ
const DB = {
    "morisreal": { pass: "morisreal_profile_console", lvl: 6, rank: "CHIEF", title: "МОЯ ЛАБОРАТОРИЯ" },
    "sumber": { pass: "SumberTheAdminPRISMS", lvl: 5, rank: "PRISMA_OWNER", title: "БУНКЕР ПРИЗМЫ" },
    "dykzxz": { pass: "DykProfileConsoleONG", lvl: 4, rank: "ENG", title: "МОЙ РЕАКТОР" },
    "msk4ne_": { pass: "password123", lvl: 4, rank: "OPERATOR", title: "СТАНЦИЯ MSK" }
};

// ОБЪЕКТЫ НА КАРТЕ
const RADAR_DATA = [
    { x: 50, y: 50, owner: "morisreal", type: "owner" },
    { x: 30, y: 40, owner: "sumber", type: "online" },
    { x: 70, y: 65, owner: "dykzxz", type: "broken" },
    { x: 80, y: 25, owner: "msk4ne_", type: "online" }
];

let activeUser = null;

// ИНТРО С ЛОГОТИПОМ
window.onload = () => {
    const pre = document.getElementById('intro-ascii');
    const txt = "G.L.O.M.G. v27.2\nLOADING_CORE_RESOURCES...\nESTABLISHING_ENCRYPTION...\nSYSTEM_READY.";
    let i = 0;
    let t = setInterval(() => {
        pre.textContent += txt[i]; i++;
        if(i >= txt.length) { 
            clearInterval(t); 
            document.getElementById('intro-logo').classList.remove('hidden');
            setTimeout(() => transition('scr-login'), 2800);
        }
    }, 45);
};

// ФУНКЦИЯ ПЕРЕХОДА
function transition(id) {
    document.getElementById('fade').classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        document.getElementById('fade').classList.remove('active');
    }, 400);
}

// АВТОРИЗАЦИЯ
function auth() {
    const id = document.getElementById('inp-id').value.toLowerCase();
    const ps = document.getElementById('inp-pass').value;
    if(DB[id] && DB[id].pass === ps) {
        activeUser = { id, ...DB[id] };
        document.getElementById('welcome-msg').textContent = `ДОБРО ПОЖАЛОВАТЬ, ${id.toUpperCase()}`;
        document.getElementById('u-lvl-display').textContent = activeUser.lvl;
        transition('scr-dash');
    } else {
        alert("ACCESS DENIED: ИНВАЛИДНЫЙ ID ИЛИ КЛЮЧ");
    }
}

// РЕЖИМ ГОСТЯ
function goGuest() {
    activeUser = null;
    transition('scr-guest');
    startGuestConsole();
}

function startGuestConsole() {
    const con = document.getElementById('guest-console');
    const msgs = [
        "> SCANNING FREQUENCIES...", "> PING_OK: 24ms", "> NODE_04_ACTIVE", 
        "> TEMP_STABLE: 24C", "> CRYSTAL_SYNC_IN_PROGRESS", "> ENCRYPTION_ACTIVE", 
        "> NO_THREATS_DETECTED", "> SYSTEM_IDLE", "> MONITORING_SECTOR_7"
    ];
    setInterval(() => {
        const d = document.createElement('div');
        d.textContent = `[${new Date().toLocaleTimeString()}] ${msgs[Math.floor(Math.random()*msgs.length)]}`;
        con.prepend(d);
        if(con.childNodes.length > 15) con.lastChild.remove();
    }, 1800);
}

// ТАКТИЧЕСКИЙ РАДАР
function goMap() {
    transition('scr-map');
    const box = document.getElementById('radar-nodes');
    box.innerHTML = "";
    RADAR_DATA.forEach(node => {
        const dot = document.createElement('div');
        dot.className = `node ${node.type}`;
        dot.style.left = node.x + "%"; dot.style.top = node.y + "%";
        
        dot.onclick = () => {
            const pop = document.getElementById('radar-popup');
            pop.classList.remove('hidden');
            const info = DB[node.owner];
            document.getElementById('p-title').textContent = node.owner.toUpperCase();
            // Персонализация: если мой объект - "Моя лаба", иначе - ранг владельца
            document.getElementById('p-text').textContent = (node.owner === activeUser.id) ? info.title : `СТАТУС: АКТИВЕН | ДОЛЖНОСТЬ: ${info.rank}`;
        };
        box.appendChild(dot);
    });
}

// УПРАВЛЕНИЕ КОНСОЛЬЮ
function handleCmd(e) {
    if(e.key === 'Enter') {
        const val = e.target.value;
        const out = document.getElementById('terminal-out');
        const d = document.createElement('div');
        d.style.color = "#888";
        d.textContent = `admin@glomg:~# ${val}`;
        out.appendChild(d);
        
        const response = document.createElement('div');
        if(val.toLowerCase() === 'help') {
            response.textContent = "Available commands: help, status, clear, exit, whoami";
        } else if(val.toLowerCase() === 'whoami') {
            response.textContent = `USER: ${activeUser.id} | LVL: ${activeUser.lvl} | RANK: ${activeUser.rank}`;
        } else {
            response.textContent = "COMMAND_EXECUTION_ERROR: ACCESS_DENIED_BY_CORE";
        }
        out.appendChild(response);
        out.scrollTop = out.scrollHeight;
        e.target.value = "";
    }
}

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function side(st) { document.getElementById('sidebar').classList.toggle('open', st); }
function modal(id, st) { document.getElementById(id).classList.toggle('hidden', !st); }

// ЧАСЫ
setInterval(() => {
    const c = document.getElementById('clock');
    if(c) c.textContent = new Date().toLocaleTimeString();
}, 1000);
