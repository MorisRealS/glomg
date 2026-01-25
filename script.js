const USERS = {
    "morisreal": { pass: "morisreal_profile_console", rank: "CHIEF", avatar: "M", x: 50, y: 50 },
    "sumber": { pass: "SumberTheAdminPRISMS", rank: "ADMIN", avatar: "S", x: 35, y: 40 },
    "msk4ne_": { pass: "ModerConsoleCodeProfile", rank: "MODER", avatar: "M", x: 65, y: 35 },
    "dykxzx": { pass: "DykProfileConsoleONG", rank: "COMMANDER", avatar: "D", x: 45, y: 70 }
};

let currentUser = null;

// ЧАСЫ
setInterval(() => {
    const t = new Date().toLocaleTimeString();
    if(document.getElementById('guest-clock')) document.getElementById('guest-clock').textContent = t;
    if(document.getElementById('op-clock')) document.getElementById('op-clock').textContent = t;
}, 1000);

// ПЕРЕХОДЫ
function transitionTo(id) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        if(id === 'lobby-screen') runLabLogs();
        if(id === 'main-dashboard') closeSidebar();
        fade.classList.remove('active');
    }, 500);
}

// КОНСОЛЬ ЛАБОРАТОРИИ
function runLabLogs() {
    const logs = [
        "> Запуск систем охлаждения Кристалла...",
        "> Синхронизация серверных модулей: 100%",
        "> Частота резонанса: 842.1 THz. Стабильно.",
        "> ВНИМАНИЕ: Попытка несанкционированного доступа пресечена.",
        "> Энергопотребление серверов: 1.42 TW.",
        "> Статус системы: ПОЛНАЯ ГОТОВНОСТЬ."
    ];
    const box = document.getElementById('guest-logs');
    box.innerHTML = "";
    logs.forEach((l, i) => {
        setTimeout(() => {
            const d = document.createElement('div');
            d.textContent = `[${new Date().toLocaleTimeString()}] ${l}`;
            box.prepend(d);
        }, i * 1400);
    });
}

// АВТОРИЗАЦИЯ
function handleAuth() {
    const u = document.getElementById('auth-id').value.toLowerCase();
    const p = document.getElementById('auth-pass').value;
    if(USERS[u] && USERS[u].pass === p) {
        currentUser = { id: u, ...USERS[u] };
        document.getElementById('side-name').textContent = u.toUpperCase();
        document.getElementById('side-rank').textContent = USERS[u].rank;
        document.getElementById('side-avatar').textContent = USERS[u].avatar;
        transitionTo('main-dashboard');
    } else { alert("ACCESS DENIED"); }
}

function enterGuest() { transitionTo('lobby-screen'); }

// СЛАЙДЕР (САЙДБАР)
function toggleSidebar() {
    const s = document.getElementById('side-slider');
    const o = document.getElementById('side-overlay');
    s.classList.toggle('open');
    o.style.display = s.classList.contains('open') ? 'block' : 'none';
}
function closeSidebar() {
    document.getElementById('side-slider').classList.remove('open');
    document.getElementById('side-overlay').style.display = 'none';
}

// РАДАР
function openMap() {
    transitionTo('map-screen');
    const container = document.getElementById('node-map');
    container.innerHTML = "";
    Object.keys(USERS).forEach(key => {
        const u = USERS[key];
        const node = document.createElement('div');
        const isOnline = Math.random() > 0.4 || key === currentUser?.id;
        node.className = `node ${isOnline ? 'online' : ''}`;
        node.style.left = u.x + "%";
        node.style.top = u.y + "%";
        node.onclick = () => {
            const card = document.getElementById('node-info');
            card.classList.remove('hidden');
            document.getElementById('node-name').textContent = key.toUpperCase();
            document.getElementById('node-status').textContent = isOnline ? "ONLINE" : "OFFLINE";
            document.getElementById('node-rank').textContent = u.rank;
        };
        container.appendChild(node);
    });
}
