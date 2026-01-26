const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: "A1", uuid: "1101-K" },
    "morisreal": { name: "МОРИС", pass: "123", level: "S1", uuid: "0001-M" }
};

const LOG_LINES = ["> SYNCING...", "> UUID_FOUND", "> ACCESS_DENIED", "> PORT_OPEN", "> CORE_STABLE"];
const ARCHIVE_DATA = [
    { id: "LOG_01", date: "26.01.26", info: "Синхронизация UUID успешно завершена." },
    { id: "LOG_02", date: "25.01.26", info: "Зафиксирована попытка взлома в секторе 7." }
];

let step = "ID";
let activeUser = null;
let guestInterval = null;

// --- 1. MATRIX ANIMATION ---
function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const columns = canvas.width / 14;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
        ctx.fillStyle = "rgba(5, 2, 8, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#a855f7";
        ctx.font = "14px monospace";
        for (let i = 0; i < drops.length; i++) {
            const text = Math.floor(Math.random() * 10);
            ctx.fillText(text, i * 14, drops[i] * 14);
            if (drops[i] * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(draw, 35);
}

// --- 2. TERMINAL LOGIN ---
const output = document.getElementById('output');
const cmdInput = document.getElementById('cmd');
const promptText = document.querySelector('.prompt');

function print(msg) {
    const p = document.createElement('div');
    p.innerText = "> " + msg;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight;
}

cmdInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const val = cmdInput.value.trim().toLowerCase();
        cmdInput.value = "";
        if (step === "ID") {
            if (PROFILES[val]) {
                activeUser = PROFILES[val];
                print(`USER_ID: ${val.toUpperCase()} ПОДТВЕРЖДЕН.`);
                promptText.textContent = "KEY:> ";
                cmdInput.type = "password";
                step = "PASS";
            } else { print("ID НЕ НАЙДЕН."); }
        } else if (step === "PASS") {
            if (val === activeUser.pass) {
                print("ДОСТУП РАЗРЕШЕН. ЗАГРУЗКА...");
                setTimeout(() => startTransition('main-dashboard'), 1000);
            } else { print("ОШИБКА КЛЮЧА."); setTimeout(() => location.reload(), 1000); }
        }
    }
});

// --- 3. GUEST CONSOLE ---
function startGuestConsole() {
    const box = document.getElementById('guest-console');
    box.innerHTML = '';
    guestInterval = setInterval(() => {
        const p = document.createElement('p');
        p.innerText = LOG_LINES[Math.floor(Math.random() * LOG_LINES.length)];
        box.insertBefore(p, box.firstChild);
        if (box.childNodes.length > 5) box.removeChild(box.lastChild);
    }, 1200);
}

// --- 4. RADAR ---
function initRadar() {
    startTransition('scr-radar');
    const nodes = [{x:50, y:45, n:"CORE_CENTRAL"}, {x:20, y:60, n:"OUTPOST_7"}];
    const container = document.getElementById('radar-nodes');
    container.innerHTML = '';
    nodes.forEach(node => {
        const d = document.createElement('div');
        d.className = 'node ong';
        d.style.left = node.x + '%'; d.style.top = node.y + '%';
        d.onclick = () => {
            document.getElementById('rad-title').innerText = node.n;
            document.getElementById('rad-text').innerText = "Статус: Стабилен. UUID синхронизирован.";
            document.getElementById('scr-radar').scrollTo({ top: 400, behavior: 'smooth' });
        };
        container.appendChild(d);
    });
}

// --- ПЕРЕХОДЫ ---
function startTransition(id) {
    document.getElementById('fade').classList.add('glitch-active');
    if(guestInterval) clearInterval(guestInterval);
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        if (id === 'main-dashboard') document.getElementById('user-name-display').innerText = activeUser.name;
        if (id === 'scr-guest') startGuestConsole();
        if (id === 'scr-archive') {
            document.getElementById('db-logs-list').innerHTML = ARCHIVE_DATA.map(l => `
                <div class="db-log-item">
                    <div class="db-log-header"><button class="db-expand-btn" onclick="this.parentElement.nextElementSibling.classList.toggle('open')">OPEN</button>
                    <span>${l.id}</span><small>${l.date}</small></div>
                    <div class="db-log-content">${l.info}</div>
                </div>`).join('');
        }
        document.getElementById('fade').classList.remove('glitch-active');
    }, 400);
}

function toggleSidebar(s) {
    document.getElementById('sidebar').classList.toggle('open', s);
    document.getElementById('side-overlay').style.display = s ? 'block' : 'none';
}
function openProfile() {
    document.getElementById('p-name-val').innerText = activeUser.name;
    document.getElementById('p-uuid-val').innerText = activeUser.uuid;
    document.getElementById('modal-profile').classList.remove('hidden');
    toggleSidebar(false);
}
function closeProfile() { document.getElementById('modal-profile').classList.add('hidden'); }

window.onload = () => {
    initMatrix();
    setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString(); }, 1000);
};
