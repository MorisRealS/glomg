const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: 4, token: "KID", uuid: "1100110010" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: 4, token: "DYK", uuid: "1010101100" },
    "msk4ne_":  { name: "MSK4NE", pass: "3333", level: 4, token: "MSK", uuid: "0011001101" },
    "sumber":   { name: "Sumber", pass: "0000", level: 5, token: "SBR", uuid: "1111100000" },
    "morisreal": { name: "МОРИС", pass: "123", level: 6, token: "MRS", uuid: "1010101010" }
};

const RADAR_NODES = [
    { id: "S-01", x: 30, y: 40, type: "REACTIVE", status: "STABLE" },
    { id: "S-07", x: 70, y: 20, type: "ANOMALY", status: "ACTIVE" },
    { id: "X-99", x: 55, y: 75, type: "CORE", status: "CRITICAL" }
];

let tempUser = null;

// Инициализация радара
function initializeTacticalRadar() {
    transitionToScreen('scr-map');
    const container = document.getElementById('radar-nodes');
    container.innerHTML = '';
    RADAR_NODES.forEach(node => {
        const el = document.createElement('div');
        el.className = 'node';
        el.style.left = node.x + '%';
        el.style.top = node.y + '%';
        el.onclick = () => {
            document.getElementById('p-title').innerText = "OBJECT: " + node.id;
            document.getElementById('p-text').innerHTML = `TYPE: ${node.type}<br>STATUS: ${node.status}`;
        };
        container.appendChild(el);
    });
}

// ЛОГИКА ВХОДА И ПЕРЕХОДОВ
function processLogin() {
    const id = document.getElementById('inp-id').value.toLowerCase();
    const pass = document.getElementById('inp-pass').value;
    const out = document.getElementById('login-output');

    if (PROFILES[id] && PROFILES[id].pass === pass) {
        tempUser = PROFILES[id];
        out.innerHTML = "<span style='color:var(--terminal-green)'>ACCESS GRANTED. SYNCING...</span>";
        
        // Заполнение профиля
        document.getElementById('p-name-val').innerText = tempUser.name;
        document.getElementById('p-token-val').innerText = tempUser.token;
        document.getElementById('p-lvl-text-val').innerText = "LEVEL " + tempUser.level;
        document.getElementById('p-uuid-val').innerText = tempUser.uuid;
        document.getElementById('u-lvl-display').innerText = tempUser.level;

        // Статус модерации
        let status = "USER";
        if (tempUser.level === 4) status = "MODERATOR";
        if (tempUser.level >= 5) status = "ADMINISTRATOR";
        document.getElementById('p-status-val').innerText = status;

        startTransition('scr-dash');
    } else {
        out.innerHTML = "<span style='color:var(--error)'>AUTHENTICATION FAILED.</span>";
    }
}

function startTransition(targetId) {
    const fade = document.getElementById('fade');
    fade.classList.add('active');
    setTimeout(() => {
        transitionToScreen(targetId);
        fade.classList.remove('active');
    }, 800);
}

function transitionToScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'scr-guest') startGuestLogs();
}

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

// ГОСТЕВЫЕ ЛОГИ
function startGuestLogs() {
    const box = document.getElementById('guest-console');
    box.innerHTML = '';
    const lines = [
        "Initializing guest session...",
        "Connection: SECURE",
        "Loading system modules...",
        "Access Level: 0 (RESTRICTED)",
        "Warning: Command line disabled."
    ];
    let i = 0;
    const interval = setInterval(() => {
        if(i < lines.length) {
            const p = document.createElement('p');
            p.innerText = "> " + lines[i];
            box.appendChild(p);
            i++;
        } else clearInterval(interval);
    }, 400);
}

// ЧАСЫ
setInterval(() => {
    const time = new Date().toLocaleTimeString();
    if(document.getElementById('clock')) document.getElementById('clock').innerText = time;
    if(document.getElementById('radar-clock')) document.getElementById('radar-clock').innerText = time;
}, 1000);

// ИНТРО (ЛОГОТИП)
window.onload = () => {
    const intro = document.getElementById('intro-ascii');
    intro.innerText = "G.L.O.M.G. SYSTEM BOOTING...";
    setTimeout(() => {
        document.getElementById('intro-logo').classList.remove('hidden');
        setTimeout(() => startTransition('scr-login'), 3000);
    }, 1500);
};
