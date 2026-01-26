// ==========================================
// 1. БАЗА ДАННЫХ И КОНФИГУРАЦИЯ
// ==========================================
const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: 4, token: "KID", uuid: "1101010010" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: 4, token: "DYK", uuid: "1011100001" },
    "sumber":   { name: "Sumber", pass: "0000", level: 5, token: "SBR", uuid: "1110001110" },
    "morisreal": { name: "МОРИС", pass: "123", level: 6, token: "MRS", uuid: "1010101010" }
};

const LOG_LINES = [
    "> SYNC_UUID_SUCCESS", 
    "> ALERT: PRISM_SCAN_DETECTED", 
    "> REACTOR_4_STABLE", 
    "> SUMBER_BUNKER: CONNECTED", 
    "> DATA_CLEAN: 100%",
    "> SECURITY_LAYER_V32: ACTIVE"
];

// Звуковые ресурсы
const sound_type = new Audio('https://www.soundjay.com/communication/sounds/typewriter-key-1.mp3');
sound_type.volume = 0.15;

let currentUser = null;
let matrixInterval = null;

// ==========================================
// 2. СИСТЕМНЫЕ ЭФФЕКТЫ (ЗВУК, ПРАВАЯ КНОПКА, ПАРАЛЛАКС)
// ==========================================

// Звук при вводе
function playTypingSound() {
    sound_type.currentTime = 0;
    sound_type.play();
}

// Эмбиент (запуск при первом клике)
function initAmbient() {
    const amb = document.getElementById('ambient-pc');
    if(amb) {
        amb.volume = 0.08;
        amb.play().catch(() => console.log("Waiting for user interaction..."));
    }
}

// Кастомное контекстное меню (#20)
document.addEventListener('contextmenu', e => {
    e.preventDefault();
    const menu = document.getElementById('custom-menu');
    if(menu) {
        menu.style.display = 'block';
        menu.style.left = e.pageX + 'px';
        menu.style.top = e.pageY + 'px';
    }
});

document.addEventListener('click', () => {
    const menu = document.getElementById('custom-menu');
    if(menu) menu.style.display = 'none';
});

// Параллакс фона (#12)
document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.pageX) / 60;
    const y = (window.innerHeight / 2 - e.pageY) / 60;
    document.body.style.backgroundPosition = `${x}px ${y}px`;
});

// ==========================================
// 3. ЯДРО ВИЗУАЛИЗАЦИИ (МАТРИЦА И ГЛИТЧ)
// ==========================================

function initMatrix(color = "#A855F7") {
    const canvas = document.getElementById('matrix-bg');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const columns = Math.floor(canvas.width / 15);
    const drops = Array(columns).fill(1);

    if(matrixInterval) clearInterval(matrixInterval);
    matrixInterval = setInterval(() => {
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color;
        ctx.font = "15px monospace";
        drops.forEach((y, i) => {
            const text = Math.floor(Math.random() * 2);
            ctx.fillText(text, i * 15, y * 15);
            if(y * 15 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }, 35);
}

function startTransition(targetId) {
    const fade = document.getElementById('fade');
    fade.classList.add('glitch-active'); // Глитч-эффект (#15)
    
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        const target = document.getElementById(targetId);
        if(target) target.classList.remove('hidden');
        
        // Автоматические триггеры при переходе
        if(targetId === 'scr-guest') startGuestConsole();
        if(targetId === 'scr-login') initMatrix("#A855F7");
        
        fade.classList.remove('glitch-active');
    }, 400);
}

// ==========================================
// 4. ЛОГИКА АВТОРИЗАЦИИ (#8 СКАНЕР)
// ==========================================

function processLogin() {
    const id = document.getElementById('inp-id').value.toLowerCase().trim();
    const pass = document.getElementById('inp-pass').value.trim();
    const out = document.getElementById('login-output');

    // Создаем визуальный сканер
    const scanner = document.createElement('div');
    scanner.className = 'login-scanner';
    document.querySelector('.login-frame').appendChild(scanner);

    setTimeout(() => {
        scanner.remove();
        if (PROFILES[id] && PROFILES[id].pass === pass) {
            currentUser = PROFILES[id];
            
            // Заполнение данных профиля
            document.getElementById('welcome-user-name').innerText = currentUser.name;
            document.getElementById('p-name-val').innerText = currentUser.name;
            document.getElementById('p-token-val').innerText = currentUser.token;
            document.getElementById('p-lvl-text-val').innerText = "LEVEL " + currentUser.level;
            
            // Цвет матрицы под юзера (#7)
            const mColor = id === 'morisreal' ? "#FFD700" : "#A855F7";
            initMatrix(mColor);
            
            startTransition('scr-dash');
        } else {
            out.innerText = "ACCESS_DENIED: INVALID_KEY";
            out.style.color = "red";
            // Тряска при ошибке
            document.querySelector('.login-frame').classList.add('glitch');
            setTimeout(() => document.querySelector('.login-frame').classList.remove('glitch'), 300);
        }
    }, 1200);
}

// ==========================================
// 5. МОДУЛИ ЭКРАНОВ (РАДАР, КОНСОЛЬ, ДАТЧИКИ)
// ==========================================

function startGuestConsole() {
    const box = document.getElementById('guest-console');
    if(!box) return;
    box.innerHTML = '';
    let i = 0;
    
    function addLine() {
        if(document.getElementById('scr-guest').classList.contains('hidden')) return;
        const p = document.createElement('p');
        
        // Случайные ошибки (#26)
        const isError = Math.random() > 0.85;
        p.innerText = isError ? "> CRITICAL_ERR: UUID_VOID_REFERENCE" : LOG_LINES[i];
        if(isError) p.style.color = "red";
        
        box.insertBefore(p, box.firstChild);
        sound_type.play();
        
        if(box.children.length > 6) box.removeChild(box.lastChild);
        i = (i + 1) % LOG_LINES.length;
        setTimeout(addLine, 1500);
    }
    addLine();
}

function initializeTacticalRadar() {
    startTransition('scr-map');
    const container = document.getElementById('radar-nodes');
    if(!container) return;
    container.innerHTML = '';
    
    const nodes = [
        {id: "ONG_HQ", x: 48, y: 35, type: "ong", info: "ГЛАВНЫЙ ШТАБ ОНГ. Слой: Физический. Защита: MAX."},
        {id: "SUMBER_BUNKER", x: 25, y: 25, type: "ong", info: "БУНКЕР SUMBER. Склад ядер и UUID-ключей. Статус: ACTIVE."},
        {id: "PRISM_EYE", x: 75, y: 65, type: "prism", info: "БУНКЕР ПРИЗМЫ. Обнаружен шпионский узел. Тип: ВРАЖДЕБНЫЙ."},
        {id: "DYK_REACTOR", x: 40, y: 80, type: "dyk", info: "РЕАКТОР DYK. Стабильность: 82%. Требуется мониторинг."}
    ];

    nodes.forEach(n => {
        const d = document.createElement('div');
        d.className = `node ${n.type}`;
        d.style.left = n.x + '%'; d.style.top = n.y + '%';
        d.onclick = () => {
            document.getElementById('p-title').innerText = n.id;
            document.getElementById('p-text').innerText = n.info;
        };
        container.appendChild(d);
    });
}

function initSensors() {
    setInterval(() => {
        if (document.getElementById('scr-sysdata').classList.contains('hidden')) return;
        
        const cpu = Math.floor(Math.random() * 10) + 20;
        const temp = Math.floor(Math.random() * 8) + 42;
        const mem = (Math.random() * 2 + 5.4).toFixed(1);

        // CPU
        document.getElementById('val-cpu').innerText = cpu + "%";
        document.getElementById('bar-cpu').style.width = cpu + "%";
        
        // TEMP
        document.getElementById('val-temp').innerText = temp + "°C";
        document.getElementById('bar-temp').style.width = (temp/100)*100 + "%";
        
        // RAM (от 16 ГБ)
        document.getElementById('val-mem').innerText = mem + " GB";
        document.getElementById('bar-mem').style.width = (mem/16)*100 + "%";

        // Общий статус системы
        const health = document.getElementById('sys-health-text');
        if(temp > 48) {
            health.innerText = "WARNING: OVERHEAT";
            health.style.color = "orange";
        } else {
            health.innerText = "OPTIMAL";
            health.style.color = "lime";
        }
    }, 1500);
}

// ==========================================
// 6. ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
// ==========================================

window.onload = () => {
    initMatrix();
    initSensors();
    
    // Включение эмбиента по первому клику (политика браузеров)
    document.addEventListener('mousedown', initAmbient, {once: true});
    
    // Эффект загрузки Intro
    const introText = document.getElementById('intro-ascii');
    if(introText) introText.innerText = "O.N.G._SYSTEM_v32.5_BOOTING...";
    
    setTimeout(() => {
        const logo = document.getElementById('intro-logo');
        if(logo) logo.classList.remove('hidden');
        setTimeout(() => startTransition('scr-login'), 2000);
    }, 1000);
};

// Часы в статус-баре
setInterval(() => {
    const c = document.getElementById('clock');
    if(c) c.innerText = new Date().toLocaleTimeString();
}, 1000);

// Интерфейсные переключатели
function toggleArchive(btn) {
    const content = btn.nextElementSibling;
    content.classList.toggle('hidden');
    btn.innerText = content.classList.contains('hidden') ? btn.innerText.replace('[-]', '[+]') : btn.innerText.replace('[+]', '[-]');
}

function toggleSidebar(s) {
    document.getElementById('sidebar').classList.toggle('open', s);
    document.getElementById('side-overlay').style.display = s ? 'block' : 'none';
}

function openProfile() { document.getElementById('modal-profile').classList.remove('hidden'); toggleSidebar(false); }
function closeProfile() { document.getElementById('modal-profile').classList.add('hidden'); }
