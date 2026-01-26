// База данных с UUID и уровнями
const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: 4, token: "KID", uuid: "1100110010" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: 4, token: "DYK", uuid: "1010101100" },
    "msk4ne_":  { name: "MSK4NE", pass: "3333", level: 4, token: "MSK", uuid: "0011001101" },
    "sumber":   { name: "Sumber", pass: "0000", level: 5, token: "SBR", uuid: "1111100000" },
    "morisreal": { name: "МОРИС", pass: "123", level: 6, token: "MRS", uuid: "1010101010" }
};

let tempUser = null;

// 1. АНИМАЦИЯ ИНТРО
window.onload = () => {
    const introAscii = document.getElementById('intro-ascii');
    introAscii.innerText = "G.L.O.M.G. SYSTEM BOOTING...";
    
    setTimeout(() => {
        document.getElementById('intro-logo').classList.remove('hidden');
        setTimeout(() => {
            startTransition('scr-login');
        }, 3000);
    }, 1500);
};

// 2. ЛОГИКА ВХОДА
function processLogin() {
    const id = document.getElementById('inp-id').value.trim().toLowerCase();
    const pass = document.getElementById('inp-pass').value.trim();
    const output = document.getElementById('login-output');

    if (PROFILES[id] && PROFILES[id].pass === pass) {
        tempUser = PROFILES[id];
        output.innerHTML = "<span style='color:var(--terminal-green)'>ACCESS GRANTED. SYNCING...</span>";
        
        // Заполняем профиль данными
        document.getElementById('p-name-val').innerText = tempUser.name;
        document.getElementById('p-token-val').innerText = tempUser.token;
        document.getElementById('p-lvl-text-val').innerText = "LEVEL " + tempUser.level;
        document.getElementById('p-uuid-val').innerText = tempUser.uuid;
        document.getElementById('u-lvl-display').innerText = tempUser.level;

        // Статус на основе уровня
        let status = "USER";
        if (tempUser.level === 4) status = "MODERATOR";
        if (tempUser.level >= 5) status = "ADMINISTRATOR";
        document.getElementById('p-status-val').innerText = status;

        setTimeout(() => startTransition('scr-dash'), 1000);
    } else {
        output.innerHTML = "<span style='color:var(--error)'>ERROR: INVALID CREDENTIALS</span>";
    }
}

// 3. ПЕРЕХОДЫ МЕЖДУ ЭКРАНАМИ
function transitionToScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    
    if (id === 'scr-guest') startGuestLogs();
}

function startTransition(targetId) {
    const fade = document.getElementById('fade');
    fade.classList.add('active');
    setTimeout(() => {
        transitionToScreen(targetId);
        fade.classList.remove('active');
    }, 800);
}

// 4. ЛИЧНОЕ ДЕЛО И МЕНЮ
function toggleSidebar(state) {
    const side = document.getElementById('sidebar');
    const over = document.getElementById('side-overlay');
    side.classList.toggle('open', state);
    over.style.display = state ? 'block' : 'none';
}

function openProfile() {
    document.getElementById('modal-profile').classList.remove('hidden');
    toggleSidebar(false);
}

function closeProfile() {
    document.getElementById('modal-profile').classList.add('hidden');
}

// 5. РАДАР (Восстановление работы)
function initializeTacticalRadar() {
    transitionToScreen('scr-map');
    const nodesContainer = document.getElementById('radar-nodes');
    nodesContainer.innerHTML = '';
    
    const nodes = [
        {id: "S-01", x: 30, y: 40, info: "Стабильный узел связи"},
        {id: "X-99", x: 70, y: 20, info: "Обнаружена аномалия"},
        {id: "CORE", x: 50, y: 50, info: "Центральный процессор"}
    ];

    nodes.forEach(n => {
        const div = document.createElement('div');
        div.className = 'node';
        div.style.left = n.x + '%';
        div.style.top = n.y + '%';
        div.onclick = () => {
            document.getElementById('p-title').innerText = "OBJECT: " + n.id;
            document.getElementById('p-text').innerText = n.info;
        };
        nodesContainer.appendChild(div);
    });
}

// 6. ГОСТЕВЫЕ ЛОГИ
function startGuestLogs() {
    const box = document.getElementById('guest-console');
    box.innerHTML = '';
    const lines = [
        "Initializing guest bridge...",
        "Connection: ESTABLISHED",
        "Permission: READ_ONLY",
        "Loading public database...",
        "Ready."
    ];
    let i = 0;
    const interval = setInterval(() => {
        if (i < lines.length) {
            box.innerHTML += `<div>> ${lines[i]}</div>`;
            i++;
        } else clearInterval(interval);
    }, 500);
}

// 7. КОНСОЛЬ ТЕРМИНАЛА
function handleTerminalCommand(e) {
    if (e.key === "Enter") {
        const input = document.getElementById('terminal-input');
        const out = document.getElementById('terminal-out');
        out.innerHTML += `<div><span style="color:var(--purple)">root@glomg:~#</span> ${input.value}</div>`;
        input.value = "";
        out.scrollTop = out.scrollHeight;
    }
}

// ЧАСЫ
setInterval(() => {
    const time = new Date().toLocaleTimeString();
    if(document.getElementById('clock')) document.getElementById('clock').innerText = time;
    if(document.getElementById('radar-clock')) document.getElementById('radar-clock').innerText = time;
}, 1000);
