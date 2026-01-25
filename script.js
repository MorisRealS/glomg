const USERS = {
    "morisreal": { pass: "morisreal_profile_console", rank: "CHIEF_OPERATOR", avatar: "M", x: 50, y: 50, type: "owner", label: "МОЯ ЛАБОРАТОРИЯ" },
    "sumber": { pass: "SumberTheAdminPRISMS", rank: "PRISMA_CHIEF", avatar: "P", x: 35, y: 35, type: "online", label: "ЛАБА ПРИЗМЫ" },
    "dykxzx": { pass: "DykProfileConsoleONG", rank: "FAILED_CORE", avatar: "D", x: 65, y: 45, type: "broken", label: "РЕАКТОР ДУКА" }
};

let currentUser = null;

// ИНТРО
function runIntro() {
    const el = document.getElementById('intro-logo');
    const txt = "G.L.O.M.G. v26.5\nSYSTEM_BOOT...";
    let i = 0;
    const t = setInterval(() => {
        el.textContent += txt[i];
        i++;
        if(i >= txt.length) { clearInterval(t); setTimeout(() => transitionTo('login-screen'), 1000); }
    }, 50);
}

// ПЕРЕХОДЫ (ВАЖНО: Худ скрывается тут)
function transitionTo(id) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    
    // Прячем Худ везде, кроме Дашборда и Карты
    const hud = document.getElementById('main-header');
    if (id === 'main-dashboard' || id === 'map-screen') {
        hud.classList.remove('hidden');
    } else {
        hud.classList.add('hidden');
    }

    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        if(id === 'lobby-screen') startLogs();
        fade.classList.remove('active');
    }, 400);
}

// ЛОГИН
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
        document.getElementById('p-id').textContent = "GL-" + Math.floor(Math.random()*9999);
        transitionTo('main-dashboard');
    } else { alert("ACCESS DENIED"); }
}

function enterGuest() { transitionTo('lobby-screen'); }

// РАДАР
function openMap() {
    transitionTo('map-screen');
    const container = document.getElementById('node-map');
    container.innerHTML = "";
    Object.keys(USERS).forEach(key => {
        const u = USERS[key];
        const node = document.createElement('div');
        node.className = `node ${u.type}`;
        node.style.left = u.x + "%";
        node.style.top = u.y + "%";
        node.onclick = () => {
            document.getElementById('node-info').classList.remove('hidden');
            document.getElementById('n-name').textContent = u.label;
            document.getElementById('n-status').textContent = u.type.toUpperCase();
            document.getElementById('n-rank').textContent = u.rank;
        };
        container.appendChild(node);
    });
}

// САЙДБАР И МОДАЛКИ
function toggleSidebar() {
    const s = document.getElementById('side-menu');
    const o = document.getElementById('side-overlay');
    const act = s.classList.toggle('active');
    o.style.display = act ? 'block' : 'none';
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

// ЛОГИ ГОСТЯ
function startLogs() {
    const box = document.getElementById('guest-logs');
    setInterval(() => {
        if(document.getElementById('lobby-screen').classList.contains('hidden')) return;
        const d = document.createElement('div');
        d.textContent = `[${new Date().toLocaleTimeString()}] Monitoring sector ${Math.floor(Math.random()*99)}... OK`;
        box.prepend(d);
        if(box.childNodes.length > 20) box.lastChild.remove();
    }, 2000);
}

// ЧАСЫ
setInterval(() => {
    document.getElementById('op-clock').textContent = new Date().toLocaleTimeString();
}, 1000);

window.onload = runIntro;
