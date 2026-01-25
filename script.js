const USERS = {
    "morisreal": { pass: "morisreal_profile_console", rank: "CHIEF", avatar: "M", x: 52, y: 48 },
    "sumber": { pass: "SumberTheAdminPRISMS", rank: "ADMIN", avatar: "S", x: 30, y: 40 },
    "msk4ne_": { pass: "ModerConsoleCodeProfile", rank: "MODER", avatar: "M", x: 70, y: 35 },
    "dykxzx": { pass: "DykProfileConsoleONG", rank: "COMMANDER", avatar: "D", x: 45, y: 70 }
};

let currentUser = null;

// ЧАСЫ
function updateClocks() {
    const time = new Date().toLocaleTimeString();
    if(document.getElementById('guest-clock')) document.getElementById('guest-clock').textContent = time;
    if(document.getElementById('op-clock')) document.getElementById('op-clock').textContent = time;
}
setInterval(updateClocks, 1000);

// ПЕРЕХОДЫ
function transitionTo(id) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        if(id === 'lobby-screen') startGuestLogs();
        if(id === 'main-dashboard') closeSidebar();
        fade.classList.remove('active');
    }, 500);
}

// ЛОГИ ДЛЯ ГОСТЯ
function startGuestLogs() {
    const lines = [
        "> Считывание биометрических данных... Совпадение 100%.",
        "> Установка соединения с RENDER_API...",
        "> Синхронизация локальных баз данных завершена.",
        "> Сканирование подпространственных карманов...",
        "> ВНИМАНИЕ: Зафиксирован всплеск энтропии в секторе C-19."
    ];
    const box = document.getElementById('guest-logs');
    box.innerHTML = "";
    lines.forEach((line, i) => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.textContent = `[${new Date().toLocaleTimeString()}] ${line}`;
            div.style.marginBottom = "5px";
            box.prepend(div);
        }, i * 1200);
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
    } else {
        alert("ACCESS DENIED");
    }
}

function enterGuest() { transitionTo('lobby-screen'); }

// САЙДБАР
function toggleSidebar() {
    const menu = document.getElementById('side-menu');
    const blur = document.getElementById('menu-blur');
    menu.classList.toggle('active');
    blur.style.display = menu.classList.contains('active') ? 'block' : 'none';
}
function closeSidebar() {
    document.getElementById('side-menu').classList.remove('active');
    document.getElementById('menu-blur').style.display = 'none';
}

// РАДАР
function openMap() {
    transitionTo('map-screen');
    const container = document.getElementById('node-map');
    container.innerHTML = "";

    Object.keys(USERS).forEach(key => {
        const u = USERS[key];
        const node = document.createElement('div');
        // Случайный статус для имитации "живой" сети
        const isOnline = Math.random() > 0.4 || key === currentUser?.id;
        
        node.className = `node ${isOnline ? 'online' : ''}`;
        node.style.left = u.x + "%";
        node.style.top = u.y + "%";
        
        node.onclick = () => {
            const info = document.getElementById('node-info');
            info.classList.add('hidden'); // Скрываем для анимации перезапуска
            
            setTimeout(() => {
                info.classList.remove('hidden');
                document.getElementById('node-name').textContent = key.toUpperCase();
                document.getElementById('node-status').textContent = isOnline ? "ACTIVE" : "OFFLINE";
                document.getElementById('node-rank').textContent = u.rank;
            }, 50);
        };
        container.appendChild(node);
    });
}
