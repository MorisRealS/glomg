// База данных пользователей с уникальными UUID (10 знаков 0 и 1)
const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: 4, token: "KID", uuid: "1101010010" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: 4, token: "DYK", uuid: "1011100001" },
    "msk4ne_":  { name: "MSK4NE", pass: "3333", level: 4, token: "MSK", uuid: "0001110100" },
    "sumber":   { name: "Sumber", pass: "0000", level: 5, token: "SBR", uuid: "1110001110" },
    "morisreal": { name: "МОРИС", pass: "123", level: 6, token: "MRS", uuid: "1010101010" }
};

let currentUser = null;

// ПЛАВНЫЙ ПЕРЕХОД ЧЕРЕЗ ЗАТЕМНЕНИЕ
function startTransition(targetId) {
    const fade = document.getElementById('fade');
    fade.classList.add('active'); // Включаем черный экран
    
    setTimeout(() => {
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        // Показываем нужный
        document.getElementById(targetId).classList.remove('hidden');
        
        // Если перешли в гостевой режим - запускаем логи
        if(targetId === 'scr-guest') startGuestLogs();
        
        // Убираем черный экран
        fade.classList.remove('active');
    }, 600);
}

// ЛОГИКА АВТОРИЗАЦИИ
function processLogin() {
    const idField = document.getElementById('inp-id');
    const passField = document.getElementById('inp-pass');
    const output = document.getElementById('login-output');

    const id = idField.value.toLowerCase().trim();
    const pass = passField.value.trim();

    if (PROFILES[id] && PROFILES[id].pass === pass) {
        currentUser = PROFILES[id];
        output.style.color = "var(--terminal-green)";
        output.innerText = "AUTHENTICATION SUCCESSFUL. LOADING...";
        
        // Заполняем данные профиля перед входом
        document.getElementById('p-name-val').innerText = currentUser.name;
        document.getElementById('p-token-val').innerText = currentUser.token;
        document.getElementById('p-lvl-text-val').innerText = "LEVEL " + currentUser.level;
        document.getElementById('p-uuid-val').innerText = currentUser.uuid;
        document.getElementById('u-lvl-display').innerText = currentUser.level;
        
        // Определяем статус (модератор/админ)
        let status = "USER";
        if(currentUser.level === 4) status = "MODERATOR";
        if(currentUser.level >= 5) status = "ADMINISTRATOR";
        document.getElementById('p-status-val').innerText = status;

        // Переходим на дашборд
        setTimeout(() => startTransition('scr-dash'), 1000);
    } else {
        output.style.color = "var(--error)";
        output.innerText = "ACCESS DENIED: INVALID KEY";
        idField.value = "";
        passField.value = "";
    }
}

// ГОСТЕВОЙ РЕЖИМ: ЛОГИ С ЗАДЕРЖКОЙ
async function startGuestLogs() {
    const box = document.getElementById('guest-console');
    box.innerHTML = '';
    const logs = [
        "> Establishing uplink to CORE...",
        "> Handshake: SUCCESS",
        "> Protocol: GUEST_LIVE_STREAM",
        "> Warning: Commands restricted for Level 0",
        "> Syncing system logs...",
        "> [OK] Monitoring active."
    ];

    for (const line of logs) {
        await new Promise(r => setTimeout(r, 700)); // Задержка 0.7 сек между строками
        const p = document.createElement('p');
        p.innerText = line;
        box.appendChild(p);
        box.scrollTop = box.scrollHeight;
    }
}

// РАДАР
function initializeTacticalRadar() {
    startTransition('scr-map');
    const nodesContainer = document.getElementById('radar-nodes');
    nodesContainer.innerHTML = ''; // Очистка
    
    // Создаем тестовую точку (можно добавить массив точек)
    const nodes = [
        {id: "S-07", x: 45, y: 30, info: "Объект под наблюдением. Статус: Стабилен"},
        {id: "X-01", x: 65, y: 55, info: "Аномальная активность. Проверка..."}
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

// ПРОФИЛЬ И САЙДБАР
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

// ЧАСЫ
setInterval(() => {
    const time = new Date().toLocaleTimeString();
    const clock = document.getElementById('clock');
    if(clock) clock.innerText = time;
}, 1000);

// ИНТРО-ЗАСТАВКА
window.onload = () => {
    const introTxt = document.getElementById('intro-ascii');
    introTxt.innerText = "INITIALIZING G.L.O.M.G. SYSTEM...";
    
    setTimeout(() => {
        document.getElementById('intro-logo').classList.remove('hidden');
        setTimeout(() => {
            startTransition('scr-login');
        }, 3000);
    }, 1500);
};
