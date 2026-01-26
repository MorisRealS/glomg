// База данных пользователей
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
    if (!fade) return;
    
    fade.classList.add('active'); 
    
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        const target = document.getElementById(targetId);
        if (target) target.classList.remove('hidden');
        
        if(targetId === 'scr-guest') startGuestLogs();
        
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
        output.innerText = "AUTHENTICATION SUCCESSFUL...";
        
        // Подстановка имени в приветствие
        document.getElementById('welcome-user-name').innerText = currentUser.name;
        
        // Данные профиля
        document.getElementById('p-name-val').innerText = currentUser.name;
        document.getElementById('p-token-val').innerText = currentUser.token;
        document.getElementById('p-lvl-text-val').innerText = "LEVEL " + currentUser.level;
        document.getElementById('p-uuid-val').innerText = currentUser.uuid;
        document.getElementById('u-lvl-display').innerText = currentUser.level;
        
        let status = "USER";
        if(currentUser.level === 4) status = "MODERATOR";
        if(currentUser.level >= 5) status = "ADMINISTRATOR";
        document.getElementById('p-status-val').innerText = status;

        setTimeout(() => startTransition('scr-dash'), 1000);
    } else {
        output.style.color = "var(--error)";
        output.innerText = "ACCESS DENIED";
    }
}

// ЛОГИКА ДАТЧИКОВ (Состояние системы)
function initSensors() {
    // Начальные значения
    let data = {
        cpu: 15,
        temp: 40,
        mem: 450, // MB
        total: 0
    };

    const steps = [1, -2, 4, -1, 2, -5];

    setInterval(() => {
        if (document.getElementById('scr-sysdata').classList.contains('hidden')) return;

        // Прыгающие значения
        data.cpu = Math.max(10, Math.min(20, data.cpu + steps[Math.floor(Math.random() * steps.length)]));
        data.temp = Math.max(30, Math.min(60, data.temp + steps[Math.floor(Math.random() * steps.length)]));
        data.mem = Math.max(10, Math.min(1000, data.mem + (steps[Math.floor(Math.random() * steps.length)] * 10)));
        
        // Расчет общего процента (базируется на лимитах)
        data.total = Math.floor(((data.cpu - 10) / 10 * 30) + ((data.temp - 30) / 30 * 40) + ((data.mem / 1000) * 30));

        // Обновление текста
        document.getElementById('val-cpu').innerText = data.cpu + "%";
        document.getElementById('val-temp').innerText = data.temp + "°C";
        document.getElementById('val-mem').innerText = (data.mem / 1024).toFixed(2) + " GB";
        document.getElementById('val-total').innerText = data.total + "%";

        // Обновление полосок
        document.getElementById('bar-cpu').style.width = ((data.cpu / 20) * 100) + "%";
        document.getElementById('bar-temp').style.width = ((data.temp / 120) * 100) + "%"; // макс 120
        document.getElementById('bar-mem').style.width = ((data.mem / 10000) * 100) + "%"; // макс 10гб
        document.getElementById('bar-total').style.width = data.total + "%";
    }, 1000);
}

// АРХИВ: РАЗВОРАЧИВАНИЕ ТЕМ
function toggleArchive(btn) {
    const content = btn.nextElementSibling;
    const isHidden = content.classList.contains('hidden');
    
    // Закрыть другие (опционально, если хочешь аккордеон)
    // document.querySelectorAll('.archive-content').forEach(c => c.classList.add('hidden'));
    
    if (isHidden) {
        content.classList.remove('hidden');
        btn.innerText = btn.innerText.replace('[+]', '[-]');
    } else {
        content.classList.add('hidden');
        btn.innerText = btn.innerText.replace('[-]', '[+]');
    }
}

// ГОСТЕВОЙ РЕЖИМ (Логи с задержкой)
async function startGuestLogs() {
    const box = document.getElementById('guest-console');
    if (!box) return;
    box.innerHTML = '';
    const logs = [
        "> Establishing uplink...",
        "> Handshake: SUCCESS",
        "> Protocol: GUEST_MODE",
        "> Syncing logs...",
        "> [OK] Monitoring active."
    ];

    for (const line of logs) {
        await new Promise(r => setTimeout(r, 800));
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
    if (!nodesContainer) return;
    nodesContainer.innerHTML = '';
    
    const nodes = [
        {id: "S-07", x: 45, y: 30, info: "Объект ОНГ: СТАБИЛЕН"},
        {id: "P-01", x: 65, y: 55, info: "Лаборатория PRISM: АКТИВНА"},
        {id: "M-CORE", x: 50, y: 50, info: "Ядро системы G.L.O.M.G."}
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

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function toggleSidebar(state) {
    document.getElementById('sidebar').classList.toggle('open', state);
    document.getElementById('side-overlay').style.display = state ? 'block' : 'none';
}

function openProfile() {
    document.getElementById('modal-profile').classList.remove('hidden');
    toggleSidebar(false);
}

function closeProfile() {
    document.getElementById('modal-profile').classList.add('hidden');
}

// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
window.onload = () => {
    initSensors();
    const introTxt = document.getElementById('intro-ascii');
    if(introTxt) introTxt.innerText = "BOOTING G.L.O.M.G. OS...";
    
    setTimeout(() => {
        const logo = document.getElementById('intro-logo');
        if(logo) logo.classList.remove('hidden');
        setTimeout(() => startTransition('scr-login'), 2500);
    }, 1200);
};

// ЧАСЫ
setInterval(() => {
    const time = new Date().toLocaleTimeString();
    const clock = document.getElementById('clock');
    if(clock) clock.innerText = time;
}, 1000);
