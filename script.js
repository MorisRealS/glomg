const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: 4, token: "KID", uuid: "1101010010" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: 4, token: "DYK", uuid: "1011100001" },
    "msk4ne_":  { name: "MSK4NE", pass: "3333", level: 4, token: "MSK", uuid: "0001110100" },
    "sumber":   { name: "Sumber", pass: "0000", level: 5, token: "SBR", uuid: "1110001110" },
    "morisreal": { name: "МОРИС", pass: "123", level: 6, token: "MRS", uuid: "1010101010" }
};

const CONSOLE_LOGS = [
    "> Запрос UUID от внешнего узла...", "> Поток данных: Стабилен.", 
    "> ВНИМАНИЕ: Попытка сканирования порта 8080.", "> Синхронизация с P.R.I.S.M...",
    "> Реактор Dykzxz: Фоновый шум в норме.", "> Очистка временных файлов...",
    "> Калибровка сенсоров радара...", "> Авторизация: MorisReal.",
    "> Состояние ядра: 98.4% КПД.", "> Ошибка доступа в сектор 4."
];

let currentUser = null;

// ПЕРЕХОДЫ
function startTransition(targetId) {
    const fade = document.getElementById('fade');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(targetId).classList.remove('hidden');
        if (targetId === 'scr-guest') startInfiniteLogs();
        fade.classList.remove('active');
    }, 600);
}

// ЛОГИН
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
        document.getElementById('p-uuid-val').innerText = currentUser.uuid;
        document.getElementById('u-lvl-display').innerText = currentUser.level;
        document.getElementById('p-status-val').innerText = currentUser.level >= 5 ? "ADMINISTRATOR" : "OPERATIVE";
        out.style.color = "lime";
        out.innerText = "ACCESS GRANTED";
        setTimeout(() => startTransition('scr-dash'), 1000);
    } else {
        out.style.color = "red";
        out.innerText = "DENIED";
    }
}

// БЕСКОНЕЧНЫЕ ЛОГИ ДЛЯ ГОСТЯ
async function startInfiniteLogs() {
    const box = document.getElementById('guest-console');
    box.innerHTML = '';
    let i = 0;
    async function addNextLine() {
        if (!document.getElementById('scr-guest').classList.contains('hidden')) {
            const p = document.createElement('p');
            p.innerText = CONSOLE_LOGS[i];
            box.appendChild(p);
            box.scrollTop = box.scrollHeight;
            if (box.children.length > 12) box.removeChild(box.firstChild);
            i = (i + 1) % CONSOLE_LOGS.length;
            setTimeout(addNextLine, Math.random() * 2000 + 500);
        }
    }
    addNextLine();
}

// РАДАР
function initializeTacticalRadar() {
    startTransition('scr-map');
    const container = document.getElementById('radar-nodes');
    container.innerHTML = '';
    const nodes = [
        {id: "ONG_LAB", x: 45, y: 30, type: "ong", info: "База ОНГ. UUID_STABLE."},
        {id: "PRISM", x: 65, y: 55, type: "prism", info: "Сектор P.R.I.S.M. Наблюдение."},
        {id: "DYK_REACTOR", x: 30, y: 70, type: "dyk", info: "Реактор Dykzxz. НЕ РАБОТАЕТ."}
    ];
    nodes.forEach(n => {
        const d = document.createElement('div');
        d.className = `node ${n.type}`;
        d.style.left = n.x + '%'; d.style.top = n.y + '%';
        d.onclick = () => {
            document.getElementById('p-title').innerText = n.id;
            document.getElementById('p-text').innerText = n.info;
            document.getElementById('radar-scroll').scrollTo({top: 500, behavior: 'smooth'});
        };
        container.appendChild(d);
    });
}

// ПРОФИЛЬ (ПЛАВНЫЙ)
function openProfile() {
    document.getElementById('modal-profile').classList.remove('hidden');
    toggleSidebar(false);
}
function closeProfile() {
    document.getElementById('modal-profile').classList.add('hidden');
}

// ДАТЧИКИ
function initSensors() {
    setInterval(() => {
        if (document.getElementById('scr-sysdata').classList.contains('hidden')) return;
        let cpu = Math.floor(Math.random() * 20) + 10;
        let temp = Math.floor(Math.random() * 15) + 40;
        document.getElementById('val-cpu').innerText = cpu + "%";
        document.getElementById('bar-cpu').style.width = cpu + "%";
        document.getElementById('val-temp').innerText = temp + "°C";
        document.getElementById('bar-temp').style.width = (temp/100*100) + "%";
    }, 1500);
}

function toggleArchive(b) {
    const c = b.nextElementSibling;
    c.classList.toggle('hidden');
}
function toggleSidebar(s) {
    document.getElementById('sidebar').classList.toggle('open', s);
    document.getElementById('side-overlay').style.display = s ? 'block' : 'none';
}

window.onload = () => {
    initSensors();
    document.getElementById('intro-ascii').innerText = "O.N.G. OS LOADING...";
    setTimeout(() => {
        document.getElementById('intro-logo').classList.remove('hidden');
        setTimeout(() => startTransition('scr-login'), 2000);
    }, 1000);
};

setInterval(() => {
    const c = document.getElementById('clock');
    if(c) c.innerText = new Date().toLocaleTimeString();
}, 1000);
