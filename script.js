// БАЗА ДАННЫХ СОТРУДНИКОВ
const USERS = {
    "morisreal": { pass: "morisreal_profile_console", rank: "CHIEF", avatar: "M", x: 50, y: 50, level: 4 },
    "sumber": { pass: "SumberTheAdminPRISMS", rank: "ADMIN", avatar: "S", x: 35, y: 40, level: 5 },
    "msk4ne_": { pass: "ModerConsoleCodeProfile", rank: "MODER", avatar: "M", x: 65, y: 35, level: 3 },
    "dykxzx": { pass: "DykProfileConsoleONG", rank: "COMMANDER", avatar: "D", x: 45, y: 75, level: 3 }
};

let currentUser = null;

// ЧАСЫ
function startClocks() {
    setInterval(() => {
        const time = new Date().toLocaleTimeString();
        if(document.getElementById('guest-clock')) document.getElementById('guest-clock').textContent = time;
        if(document.getElementById('op-clock')) document.getElementById('op-clock').textContent = time;
    }, 1000);
}

// ПЕРЕХОДЫ С ЗАТЕМНЕНИЕМ
function transitionTo(id) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        if (id === 'main-dashboard') buildMenu();
        fade.classList.remove('active');
    }, 500);
}

// АВТОРИЗАЦИЯ
function handleAuth() {
    const uInput = document.getElementById('auth-id').value.trim().toLowerCase();
    const pInput = document.getElementById('auth-pass').value.trim();
    
    if (USERS[uInput] && USERS[uInput].pass === pInput) {
        currentUser = { id: uInput, ...USERS[uInput] };
        saveLoginHistory(uInput);
        document.getElementById('side-user').textContent = uInput.toUpperCase();
        document.getElementById('side-avatar').textContent = USERS[uInput].avatar;
        transitionTo('main-dashboard');
    } else {
        alert("ОШИБКА: ДОСТУП ЗАПРЕЩЕН");
    }
}

function enterGuest() {
    currentUser = null;
    transitionTo('lobby-screen');
}

// ДИНАМИЧЕСКОЕ МЕНЮ (ИДЕЯ 1)
function buildMenu() {
    const menu = document.getElementById('main-menu-btns');
    menu.innerHTML = "";
    
    const btns = [
        { name: "ТАКТИЧЕСКИЙ РАДАР", action: "openMap()", minLevel: 1 },
        { name: "АРХИВ ДОКУМЕНТОВ", action: "transitionTo('archive-screen')", minLevel: 4 },
        { name: "МОЙ ПРОФИЛЬ", action: "openProfile()", minLevel: 1 },
        { name: "ТЕЛЕМЕТРИЯ ЯДРА", action: "transitionTo('status-screen')", minLevel: 2 },
        { name: "ЗАВЕРШИТЬ СМЕНУ", action: "location.reload()", minLevel: 1, class: "exit-red" }
    ];

    btns.forEach(b => {
        if (currentUser.level >= b.minLevel) {
            const btn = document.createElement('button');
            btn.className = `mega-cyber-btn ${b.class || ''}`;
            btn.onclick = () => eval(b.action);
            btn.textContent = b.name;
            menu.appendChild(btn);
        }
    });
}

// РАДАР
function openMap() {
    transitionTo('map-screen');
    const container = document.getElementById('node-map');
    container.innerHTML = "";

    Object.keys(USERS).forEach(key => {
        const u = USERS[key];
        const node = document.createElement('div');
        node.className = `node ${key === currentUser?.id ? 'online' : ''}`;
        node.style.left = u.x + "%";
        node.style.top = u.y + "%";
        
        node.onclick = (e) => {
            e.stopPropagation();
            const panel = document.getElementById('node-info-panel');
            panel.classList.remove('hidden');
            document.getElementById('node-user-name').textContent = key.toUpperCase();
            document.getElementById('node-user-status').textContent = (key === currentUser?.id) ? "В СЕТИ" : "ОЖИДАНИЕ";
            document.getElementById('node-user-rank').textContent = u.rank;
            document.getElementById('node-user-loc').textContent = `СЕКТОР-${Math.floor(u.x/10)}`;
        };
        container.appendChild(node);
    });
}
function closeMap() { 
    document.getElementById('node-info-panel').classList.add('hidden');
    transitionTo('main-dashboard'); 
}

// ПРОФИЛЬ И ЛОГИ (ИДЕЯ 2)
function openProfile() {
    document.getElementById('prof-name').textContent = currentUser.id.toUpperCase();
    document.getElementById('prof-rank').textContent = currentUser.rank;
    document.getElementById('prof-clearance').textContent = currentUser.level;
    document.getElementById('prof-avatar').textContent = currentUser.avatar;
    
    const historyBox = document.getElementById('login-history-list');
    const history = JSON.parse(localStorage.getItem('glomg_logs') || "[]");
    historyBox.innerHTML = history.reverse().map(log => `<div class="log-entry">${log}</div>`).join('');
    
    transitionTo('profile-screen');
}

function saveLoginHistory(user) {
    let logs = JSON.parse(localStorage.getItem('glomg_logs') || "[]");
    logs.push(`${new Date().toLocaleString()} - ${user.toUpperCase()} ACCESS`);
    if(logs.length > 20) logs.shift();
    localStorage.setItem('glomg_logs', JSON.stringify(logs));
}

// САЙДБАР
function toggleSidebar() { document.getElementById('side-panel').classList.toggle('open'); document.getElementById('blur-shield').style.display = "block"; }
function closeSidebar() { document.getElementById('side-panel').classList.remove('open'); document.getElementById('blur-shield').style.display = "none"; }

// СТАРТ
window.onload = () => {
    startClocks();
    const newsBox = document.getElementById('news-box');
    ["Протокол V26 активен", "Сектор 4: Стабильно", "ОНГ заступили на пост"].forEach(n => {
        newsBox.innerHTML += `<div class="news-item"><span class="date">[SYS]</span><p>${n}</p></div>`;
    });

    const l = document.getElementById('big-logo');
    const art = "G.L.O.M.G. OS\nBOOTING...\nCORE READY_";
    let i = 0;
    function type() {
        if(i < art.length) { l.textContent += art[i++]; setTimeout(type, 40); }
        else { setTimeout(() => transitionTo('login-screen'), 1000); }
    }
    type();
};
