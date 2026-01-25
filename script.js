const USERS = {
    "morisreal": { pass: "morisreal_profile_console", rank: "CHIEF", avatar: "M", x: 50, y: 50 },
    "sumber": { pass: "SumberTheAdminPRISMS", rank: "ADMIN", avatar: "S", x: 35, y: 40 },
    "msk4ne_": { pass: "ModerConsoleCodeProfile", rank: "MODER", avatar: "M", x: 65, y: 35 },
    "dykxzx": { pass: "DykProfileConsoleONG", rank: "COMMANDER", avatar: "D", x: 45, y: 70 }
};

let currentUser = null;

// ИНТРО
function runIntro() {
    const logo = `
   ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
  ██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
  ██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
  ██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
  ╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
    CORE_SYSTEM_INITIALIZING... READY
    `;
    const el = document.getElementById('intro-logo');
    let i = 0;
    const timer = setInterval(() => {
        el.textContent += logo[i];
        i++;
        if (i >= logo.length) {
            clearInterval(timer);
            setTimeout(() => transitionTo('login-screen'), 1000);
        }
    }, 4);
}

// ПЕРЕХОДЫ
function transitionTo(id) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        if(id === 'lobby-screen') startInfiniteLogs();
        if(id === 'main-dashboard') closeSidebar();
        fade.classList.remove('active');
    }, 400);
}

// ОКНА
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

// ЛОГИ
function startInfiniteLogs() {
    const box = document.getElementById('guest-logs');
    const phrases = [
        "Считывание частоты Кристалла...", "Температура ядра: -184.2°C", "Синхронизация серверов ОНГ...", 
        "Поток данных: СТАБИЛЬНО", "Обнаружен шум в Секторе 4", "Охлаждение: АКТИВНО", 
        "Частота резонанса: 842.1 THz", "Энергозатраты: 1.42 TW", "Проверка биометрии...", 
        "Отчет ОНГ: Аномалий не обнаружено", "Бэкап данных выполнен", "Система G.L.O.M.G. активна"
    ];
    setInterval(() => {
        if(document.getElementById('lobby-screen').classList.contains('hidden')) return;
        const line = document.createElement('div');
        line.textContent = `[${new Date().toLocaleTimeString()}] ${phrases[Math.floor(Math.random()*phrases.length)]}`;
        box.prepend(line);
        if(box.childNodes.length > 30) box.lastChild.remove();
    }, 1500);
}

// АВТОРИЗАЦИЯ
function handleAuth() {
    const u = document.getElementById('auth-id').value.toLowerCase();
    const p = document.getElementById('auth-pass').value;
    if(USERS[u] && USERS[u].pass === p) {
        currentUser = { id: u, ...USERS[u] };
        document.getElementById('side-username').textContent = u.toUpperCase();
        document.getElementById('side-avatar').textContent = USERS[u].avatar;
        document.getElementById('p-name').textContent = u.toUpperCase();
        document.getElementById('p-rank').textContent = USERS[u].rank;
        document.getElementById('p-avatar').textContent = USERS[u].avatar;
        document.getElementById('p-id').textContent = `ID_${Math.floor(Math.random()*9000 + 1000)}`;
        transitionTo('main-dashboard');
    } else { alert("ACCESS DENIED"); }
}

function enterGuest() { transitionTo('lobby-screen'); }

// САЙДБАР
function toggleSidebar() {
    const s = document.getElementById('side-menu');
    const o = document.getElementById('side-overlay');
    s.classList.toggle('active');
    o.style.display = s.classList.contains('active') ? 'block' : 'none';
}
function closeSidebar() {
    document.getElementById('side-menu').classList.remove('active');
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
        const isOnline = (currentUser && key === currentUser.id);
        node.className = `node ${isOnline ? 'online' : ''}`;
        node.style.left = u.x + "%";
        node.style.top = u.y + "%";
        node.onclick = () => {
            const panel = document.getElementById('node-info');
            panel.classList.remove('hidden');
            document.getElementById('n-name').textContent = key.toUpperCase();
            document.getElementById('n-rank').textContent = u.rank;
            document.getElementById('n-status').textContent = isOnline ? "ONLINE" : "OFFLINE";
        };
        container.appendChild(node);
    });
}

// ЧАСЫ
setInterval(() => {
    const t = new Date().toLocaleTimeString();
    ['guest-clock', 'op-clock'].forEach(id => {
        if(document.getElementById(id)) document.getElementById(id).textContent = t;
    });
}, 1000);

window.onload = runIntro;
