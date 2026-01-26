const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: 4, token: "KID", uuid: "1101010010" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: 4, token: "DYK", uuid: "1011100001" },
    "msk4ne_":  { name: "MSK4NE", pass: "3333", level: 4, token: "MSK", uuid: "0001110100" },
    "sumber":   { name: "Sumber", pass: "0000", level: 5, token: "SBR", uuid: "1110001110" },
    "morisreal": { name: "МОРИС", pass: "123", level: 6, token: "MRS", uuid: "1010101010" }
};

const LOG_DB = [
    "> Синхронизация UUID с сектором 7...", "> ВНИМАНИЕ: Поток данных нестабилен.", 
    "> Попытка обхода порта 443 заблокирована.", "> P.R.I.S.M запрашивает пакеты...",
    "> Реактор Dykzxz: Статус - НЕАКТИВЕН.", "> Очистка логов гостевого входа...",
    "> Фоновое сканирование: Угроз не обнаружено.", "> Доступ разрешен: MorisReal.",
    "> Обнаружена аномалия в архиве данных.", "> Обновление системных библиотек..."
];

let currentUser = null;

function startTransition(targetId) {
    const fade = document.getElementById('fade');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(targetId).classList.remove('hidden');
        if (targetId === 'scr-guest') startGuestConsole();
        fade.classList.remove('active');
    }, 600);
}

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
        document.getElementById('p-status-val').innerText = currentUser.level >= 5 ? "ADMIN" : "OPERATOR";
        out.style.color = "lime"; out.innerText = "ACCESS GRANTED";
        setTimeout(() => startTransition('scr-dash'), 1000);
    } else {
        out.style.color = "red"; out.innerText = "DENIED";
    }
}

// КОНСОЛЬ: Новые строки появляются СВЕРХУ (без прокрутки)
async function startGuestConsole() {
    const box = document.getElementById('guest-console');
    box.innerHTML = '';
    let i = 0;
    async function add() {
        if (!document.getElementById('scr-guest').classList.contains('hidden')) {
            const p = document.createElement('p');
            p.innerText = LOG_DB[i];
            p.style.opacity = "0";
            p.style.transform = "translateY(-10px)";
            
            // Вставляем новую строку в самое начало
            box.insertBefore(p, box.firstChild);
            
            // Анимация появления
            setTimeout(() => {
                p.style.opacity = "1";
                p.style.transform = "translateY(0)";
            }, 50);

            if (box.children.length > 8) box.removeChild(box.lastChild);
            i = (i + 1) % LOG_DB.length;
            setTimeout(add, Math.random() * 1500 + 800);
        }
    }
    add();
}

function initializeTacticalRadar() {
    startTransition('scr-map');
    const container = document.getElementById('radar-nodes');
    container.innerHTML = '';
    const nodes = [
        {id: "ONG_MAIN", x: 48, y: 35, type: "ong", info: "База ОНГ. Статус: СТАБИЛЬНО."},
        {id: "PRISM_HUB", x: 65, y: 55, type: "prism", info: "Сектор Призмы. Статус: НАБЛЮДЕНИЕ."},
        {id: "DYK_VOID", x: 32, y: 72, type: "dyk", info: "Реактор Dykzxz. Статус: ОСТАНОВЛЕН."}
    ];
    nodes.forEach(n => {
        const d = document.createElement('div');
        d.className = `node ${n.type}`;
        d.style.left = n.x + '%'; d.style.top = n.y + '%';
        d.onclick = () => {
            document.getElementById('p-title').innerText = n.id;
            document.getElementById('p-text').innerText = n.info;
            document.getElementById('radar-scroll').scrollTo({top: 450, behavior: 'smooth'});
        };
        container.appendChild(d);
    });
}

function openProfile() { document.getElementById('modal-profile').classList.remove('hidden'); toggleSidebar(false); }
function closeProfile() { document.getElementById('modal-profile').classList.add('hidden'); }

function toggleArchive(b) { b.nextElementSibling.classList.toggle('hidden'); }
function toggleSidebar(s) {
    document.getElementById('sidebar').classList.toggle('open', s);
    document.getElementById('side-overlay').style.display = s ? 'block' : 'none';
}

window.onload = () => {
    document.getElementById('intro-ascii').innerText = "BOOTING O.N.G. OS...";
    setTimeout(() => {
        document.getElementById('intro-logo').classList.remove('hidden');
        setTimeout(() => startTransition('scr-login'), 2000);
    }, 1000);
};

setInterval(() => {
    const c = document.getElementById('clock');
    if(c) c.innerText = new Date().toLocaleTimeString();
}, 1000);
