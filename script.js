// База данных пользователей и объектов
const USERS = {
    "morisreal": { 
        pass: "morisreal_profile_console", 
        rank: "CHIEF_OPERATOR", 
        avatar: "M", 
        x: 50, y: 50, 
        special: "owner", 
        label: "МОЯ ЛАБОРАТОРИЯ" 
    },
    "sumber": { 
        pass: "SumberTheAdminPRISMS", 
        rank: "PRISMA_LAB_CHIEF", 
        avatar: "P", 
        x: 35, y: 35, 
        special: "prisma", 
        label: "ЛАБА ПРИЗМЫ" 
    },
    "dykxzx": { 
        pass: "DykProfileConsoleONG", 
        rank: "FAILED_REACTOR", 
        avatar: "D", 
        x: 65, y: 45, 
        special: "broken", 
        label: "РЕАКТОР ДУКА" 
    },
    "msk4ne_": { 
        pass: "ModerConsoleCodeProfile", 
        rank: "MODERATOR", 
        avatar: "X", 
        x: 42, y: 68, 
        special: "offline", 
        label: "MSK4NE_" 
    }
};

let currentUser = null;

// АНИМАЦИЯ ИНТРО
function runIntro() {
    const logo = `
   ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
  ██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
  ██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
  ██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
  ╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
    CRYSTAL CORE OS v26.5 | INITIALIZING...
    `;
    const el = document.getElementById('intro-logo');
    let i = 0;
    const timer = setInterval(() => {
        el.textContent += logo[i];
        i++;
        if (i >= logo.length) {
            clearInterval(timer);
            setTimeout(() => transitionTo('login-screen'), 1200);
        }
    }, 3);
}

// ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ
function transitionTo(id) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    
    const header = document.getElementById('main-header');
    // Показываем хотбар только в системе или на радаре
    if (id === 'main-dashboard' || id === 'map-screen') {
        header.classList.remove('hidden');
    } else {
        header.classList.add('hidden');
    }

    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        if(id === 'lobby-screen') startInfiniteLogs();
        if(id === 'main-dashboard') closeSidebar();
        fade.classList.remove('active');
    }, 400);
}

// УПРАВЛЕНИЕ МОДАЛКАМИ
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

// ЛОГИ ДЛЯ ГОСТЯ
function startInfiniteLogs() {
    const box = document.getElementById('guest-logs');
    const phrases = [
        "Считывание частоты Кристалла...", "Ядро: СТАБИЛЬНО", "Температура: -184.2°C",
        "Обнаружена активность в Секторе Дука", "Внимание: Реактор Дука не отвечает",
        "Синхронизация данных ОНГ...", "Магнитное поле: 1.42 Тесла", "Система охлаждения: ОК",
        "Входящий пакет от PRISMA_LAB...", "Зашифрованный сигнал принят", "Проверка биометрии...",
        "Поток данных стабилен", "Локатор: Активен", "Ожидание авторизации оператора..."
    ];
    
    // Очистка старых интервалов если есть
    if(window.logInterval) clearInterval(window.logInterval);

    window.logInterval = setInterval(() => {
        if(document.getElementById('lobby-screen').classList.contains('hidden')) return;
        const line = document.createElement('div');
        line.innerHTML = `<span style="color:#a855f7">[${new Date().toLocaleTimeString()}]</span> ${phrases[Math.floor(Math.random()*phrases.length)]}`;
        box.prepend(line);
        if(box.childNodes.length > 40) box.lastChild.remove();
    }, 1400);
}

// АВТОРИЗАЦИЯ
function handleAuth() {
    const u = document.getElementById('auth-id').value.toLowerCase();
    const p = document.getElementById('auth-pass').value;
    
    if(USERS[u] && USERS[u].pass === p) {
        currentUser = { id: u, ...USERS[u] };
        
        // Заполнение данных профиля
        document.getElementById('side-username').textContent = u.toUpperCase();
        document.getElementById('side-avatar').textContent = USERS[u].avatar;
        document.getElementById('p-name').textContent = u.toUpperCase();
        document.getElementById('p-rank').textContent = USERS[u].rank;
        document.getElementById('p-avatar').textContent = USERS[u].avatar;
        document.getElementById('p-id').textContent = `GL-${Math.floor(Math.random()*9000 + 1000)}`;
        
        transitionTo('main-dashboard');
    } else {
        alert("ОШИБКА ДОСТУПА: НЕВЕРНЫЙ ID ИЛИ КЛЮЧ");
    }
}

function enterGuest() { transitionTo('lobby-screen'); }

// САЙДБАР
function toggleSidebar() {
    const s = document.getElementById('side-menu');
    const o = document.getElementById('side-overlay');
    const isOpen = s.classList.toggle('active');
    o.style.display = isOpen ? 'block' : 'none';
}

function closeSidebar() {
    document.getElementById('side-menu').classList.remove('active');
    document.getElementById('side-overlay').style.display = 'none';
}

// РАДАР И ТОЧКИ
function openMap() {
    transitionTo('map-screen');
    const container = document.getElementById('node-map');
    container.innerHTML = ""; // Полная очистка перед рендером
    
    Object.keys(USERS).forEach(key => {
        const u = USERS[key];
        const node = document.createElement('div');
        node.className = 'node';
        
        // Применяем стили в зависимости от типа точки
        if (u.special === "owner") node.classList.add('owner');
        if (u.special === "broken") node.classList.add('broken');
        if (u.special === "prisma") node.classList.add('online');
        
        // Если это текущий юзер — выделяем его как владельца
        if (currentUser && key === currentUser.id) node.classList.add('owner');

        node.style.left = u.x + "%";
        node.style.top = u.y + "%";
        
        node.onclick = () => {
            const panel = document.getElementById('node-info');
            panel.classList.remove('hidden');
            document.getElementById('n-name').textContent = u.label;
            document.getElementById('n-rank').textContent = u.rank;
            
            let status = "OFFLINE";
            let sColor = "#777";

            if(u.special === "owner") { status = "ACTIVE / OWNER"; sColor = "#f0f"; }
            else if(u.special === "broken") { status = "CRITICAL FAILURE (BROKEN)"; sColor = "#ff3344"; }
            else if(u.special === "prisma") { status = "OPERATIONAL (STANDBY)"; sColor = "#00ff88"; }
            
            const sEl = document.getElementById('n-status');
            sEl.textContent = status;
            sEl.style.color = sColor;
        };
        
        container.appendChild(node);
    });
}

// ОБНОВЛЕНИЕ ЧАСОВ
setInterval(() => {
    const t = new Date().toLocaleTimeString();
    if(document.getElementById('guest-clock')) document.getElementById('guest-clock').textContent = t;
    if(document.getElementById('op-clock')) document.getElementById('op-clock').textContent = t;
}, 1000);

window.onload = runIntro;
