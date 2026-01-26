const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: 4, token: "KID", uuid: "1101010010" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: 4, token: "DYK", uuid: "1011100001" },
    "msk4ne_":  { name: "MSK4NE", pass: "3333", level: 4, token: "MSK", uuid: "0001110100" },
    "sumber":   { name: "Sumber", pass: "0000", level: 5, token: "SBR", uuid: "1110001110" },
    "morisreal": { name: "МОРИС", pass: "123", level: 6, token: "MRS", uuid: "1010101010" }
};

const LOG_DB = ["> SYNC_UUID_7...", "> ALERT: SCAN_PORT_443", "> REACTOR_DYK: IDLE", "> ACCESS: MORISREAL", "> MEMORY_CLEAN: OK"];

let currentUser = null;

// МАТРИЦА НА ФОНЕ
function initMatrix() {
    const canvas = document.getElementById('matrix-bg');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const chars = "0123456789ABCDEF";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#A855F7"; 
        ctx.font = fontSize + "px monospace";
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(draw, 33);
}

function startTransition(targetId) {
    const fade = document.getElementById('fade');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(targetId).classList.remove('hidden');
        if (targetId === 'scr-guest') startGuestConsole();
        if (targetId === 'scr-login') initMatrix();
        fade.classList.remove('active');
    }, 600);
}

function processLogin() {
    const id = document.getElementById('inp-id').value.toLowerCase().trim();
    const pass = document.getElementById('inp-pass').value.trim();
    const out = document.getElementById('login-output');

    if (PROFILES[id] && PROFILES[id].pass === pass) {
        currentUser = PROFILES[id];
        document.getElementById('welcome-user-name').innerText = currentUser.name;
        document.getElementById('p-name-val').innerText = currentUser.name;
        document.getElementById('p-token-val').innerText = currentUser.token;
        document.getElementById('p-lvl-text-val').innerText = "LEVEL " + currentUser.level;
        document.getElementById('u-lvl-display').innerText = currentUser.level;
        out.style.color = "lime"; out.innerText = "ACCESS GRANTED";
        setTimeout(() => startTransition('scr-dash'), 1000);
    } else {
        out.style.color = "red"; out.innerText = "DENIED";
    }
}

function startGuestConsole() {
    const box = document.getElementById('guest-console');
    box.innerHTML = '';
    let i = 0;
    function add() {
        if (document.getElementById('scr-guest').classList.contains('hidden')) return;
        const p = document.createElement('p');
        p.innerText = LOG_DB[i];
        p.style.paddingBottom = "5px"; // Текст не обрезается снизу
        box.insertBefore(p, box.firstChild);
        if (box.children.length > 5) box.removeChild(box.lastChild);
        i = (i + 1) % LOG_DB.length;
        setTimeout(add, 1500);
    }
    add();
}

function initializeTacticalRadar() {
    startTransition('scr-map');
    const container = document.getElementById('radar-nodes');
    container.innerHTML = '';
    const nodes = [
        {id: "ONG_HQ", x: 48, y: 35, type: "ong", info: "ГЛАВНЫЙ ШТАБ ОНГ. Слой: Физический. Защита: Максимальная. Хранилище всех UUID-ключей."},
        {id: "PRISM_EYE", x: 65, y: 55, type: "prism", info: "УЗЕЛ ПРИЗМЫ. Слой: Эфирный. Тип: Шпионское оборудование. Рекомендуется протокол скрытности."},
        {id: "DYK_REACTOR", x: 30, y: 70, type: "dyk", info: "РЕАКТОР DYKZXZ. Слой: Энергетический. Статус: КРИТИЧЕСКИЙ СБОЙ. Требуется ручная стабилизация ядра."}
    ];
    nodes.forEach(n => {
        const d = document.createElement('div');
        d.className = `node ${n.type}`;
        d.style.left = n.x + '%'; d.style.top = n.y + '%';
        d.onclick = () => {
            document.getElementById('p-title').innerText = n.id;
            document.getElementById('p-text').innerText = n.info;
            document.getElementById('radar-scroll').scrollTo({top: 450, behavior: 'smooth'});
        };
        container.appendChild(d);
    });
}

function initSensors() {
    setInterval(() => {
        if (document.getElementById('scr-sysdata').classList.contains('hidden')) return;
        let cpu = Math.floor(Math.random() * 10) + 15;
        let temp = Math.floor(Math.random() * 5) + 42;
        let mem = (Math.random() * 0.2 + 4.1).toFixed(1);
        document.getElementById('val-cpu').innerText = cpu + "%";
        document.getElementById('bar-cpu').style.width = cpu*3 + "%";
        document.getElementById('val-temp').innerText = temp + "°C";
        document.getElementById('bar-temp').style.width = temp + "%";
        document.getElementById('val-mem').innerText = mem + " GB";
        document.getElementById('bar-mem').style.width = mem*15 + "%";
    }, 1500);
}

function toggleSidebar(s) {
    document.getElementById('sidebar').classList.toggle('open', s);
    document.getElementById('side-overlay').style.display = s ? 'block' : 'none';
}
function openProfile() { document.getElementById('modal-profile').classList.remove('hidden'); toggleSidebar(false); }
function closeProfile() { document.getElementById('modal-profile').classList.add('hidden'); }

window.onload = () => {
    initSensors();
    initMatrix();
    setTimeout(() => {
        document.getElementById('intro-logo').classList.remove('hidden');
        setTimeout(() => startTransition('scr-login'), 2000);
    }, 1000);
};

setInterval(() => {
    const c = document.getElementById('clock');
    if(c) c.innerText = new Date().toLocaleTimeString();
}, 1000);
