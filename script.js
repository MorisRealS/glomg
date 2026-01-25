const DB = {
    "morisreal": { pass: "morisreal_profile_console", rank: "CHIEF_OPERATOR", ava: "M", x: 50, y: 50, type: "owner", title: "МОЯ ЛАБОРАТОРИЯ" },
    "sumber": { pass: "SumberTheAdminPRISMS", rank: "PRISMA_LAB_CHIEF", ava: "P", x: 32, y: 38, type: "online", title: "ЛАБА ПРИЗМЫ" },
    "dykxzx": { pass: "DykProfileConsoleONG", rank: "FAILED_REACTOR", ava: "D", x: 68, y: 42, type: "broken", title: "РЕАКТОР ДУКА" }
};

let activeUser = null;

// ЗАГРУЗКА
window.onload = () => {
    const ascii = document.getElementById('intro-ascii');
    const text = "G.L.O.M.G. v26.5\nCRYSTAL_OS INITIALIZING...\nLOADING SECTORS...\nSYSTEM READY.";
    let charIdx = 0;
    const interval = setInterval(() => {
        ascii.textContent += text[charIdx];
        charIdx++;
        if (charIdx >= text.length) {
            clearInterval(interval);
            setTimeout(() => transition('scr-login'), 1200);
        }
    }, 30);
};

// ПЕРЕХОДЫ МЕЖДУ ЭКРАНАМИ
function transition(screenId) {
    const fade = document.getElementById('fade');
    fade.classList.add('active');
    
    setTimeout(() => {
        // Скрываем все секции
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        // Показываем нужную
        document.getElementById(screenId).classList.remove('hidden');
        
        if(screenId === 'scr-guest') startGuestLogs();
        
        fade.classList.remove('active');
    }, 400);
}

// АВТОРИЗАЦИЯ
function auth() {
    const idInput = document.getElementById('inp-id').value.toLowerCase();
    const passInput = document.getElementById('inp-pass').value;
    
    if (DB[idInput] && DB[idInput].pass === passInput) {
        activeUser = { id: idInput, ...DB[idInput] };
        
        // Заполняем интерфейс данными юзера
        document.getElementById('u-name').textContent = idInput.toUpperCase();
        document.getElementById('u-rank').textContent = activeUser.rank;
        document.getElementById('u-ava').textContent = activeUser.ava;
        
        transition('scr-dash');
    } else {
        alert("ACCESS DENIED: INVALID ID OR KEY");
    }
}

function goGuest() {
    transition('scr-guest');
}

// РАДАР И ТОЧКИ
function goMap() {
    transition('scr-map');
    const nodeContainer = document.getElementById('radar-nodes');
    nodeContainer.innerHTML = ""; // Чистим перед рендером
    
    Object.keys(DB).forEach(key => {
        const item = DB[key];
        const dot = document.createElement('div');
        dot.className = `node ${item.type}`;
        dot.style.left = item.x + "%";
        dot.style.top = item.y + "%";
        
        dot.onclick = () => {
            const popup = document.getElementById('node-info');
            popup.classList.remove('hidden');
            document.getElementById('n-name').textContent = item.title;
            document.getElementById('n-desc').textContent = `OFFICER: ${key.toUpperCase()} | STATUS: ${item.type.toUpperCase()}`;
        };
        
        nodeContainer.appendChild(dot);
    });
}

// СИСТЕМНЫЕ ФУНКЦИИ
function modal(id, state) {
    document.getElementById(id).classList.toggle('hidden', !state);
}

function side(state) {
    document.getElementById('sidebar').classList.toggle('open', state);
    document.getElementById('side-overlay').style.display = state ? 'block' : 'none';
}

function startGuestLogs() {
    const logBox = document.getElementById('guest-logs');
    if(window.logTimer) clearInterval(window.logTimer);
    
    const messages = [
        "Scanning sub-layers...", "Crystal frequency: 440Hz", "No anomalies detected.",
        "Buffer overflow in Sector 7", "Bypassing firewall...", "Data stream stable.",
        "External ping from [REDACTED]", "Oxygen levels: 98%", "Ambient temp: -184.2C"
    ];
    
    window.logTimer = setInterval(() => {
        const line = document.createElement('div');
        line.textContent = `[${new Date().toLocaleTimeString()}] ${messages[Math.floor(Math.random()*messages.length)]}`;
        logBox.prepend(line);
        if(logBox.childNodes.length > 20) logBox.lastChild.remove();
    }, 1800);
}

// ЧАСЫ
setInterval(() => {
    const clockEl = document.getElementById('clock');
    if(clockEl) clockEl.textContent = new Date().toLocaleTimeString();
}, 1000);
