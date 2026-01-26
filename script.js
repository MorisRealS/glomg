// База данных персонала
const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: 4, token: "KID", uuid: "1101", rank: "Lead Operator", date: "12.05.2024" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: 4, token: "DYK", uuid: "1011", rank: "Security Tech", date: "15.06.2024" },
    "sumber":   { name: "Sumber", pass: "0000", level: 5, token: "SBR", uuid: "1110", rank: "Supply Manager", date: "01.01.2025" },
    "morisreal": { name: "МОРИС", pass: "123", level: 6, token: "MRS", uuid: "1010", rank: "Director", date: "01.01.2020" }
};

// Сообщения дня для сотрудников
const STAFF_QUOTES = [
    "Помните: каждый пакет данных в ОНГ имеет значение. Не допускайте утечек.",
    "Сектор 'Призма' проявляет активность. Проверьте свои UUID-фильтры.",
    "Обновление V32.7 стабильно. При обнаружении багов — пишите Kiddy.",
    "Sumber ожидает поставку новых энергетических ядер. Будьте начеку.",
    "Чистота кода — залог стабильности ядра. MorisReal следит за вами."
];

const LOG_LINES = ["> SYNC_UUID...", "> ALERT: SCAN_DETECTED", "> REACTOR_STABLE", "> SUMBER_BUNKER: CONNECTED", "> DATA_CLEAN: 100%"];

let currentUser = null;
let currentUserID = "";
let matrixInterval = null;

// Аудио
const sound_type = new Audio('https://www.soundjay.com/communication/sounds/typewriter-key-1.mp3');
sound_type.volume = 0.05;

function playTypingSound() {
    sound_type.currentTime = 0;
    sound_type.play();
}

function initAmbient() {
    const amb = document.getElementById('ambient-pc');
    if(amb) { amb.volume = 0.04; amb.play().catch(() => {}); }
}

// ПЕРЕХОДЫ И ГЛИТЧ
function startTransition(targetId) {
    const fade = document.getElementById('fade');
    fade.classList.add('glitch-active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        const next = document.getElementById(targetId);
        if(next) next.classList.remove('hidden');
        
        // Авто-запуски при переходе на экраны
        if(targetId === 'scr-dash' || targetId === 'scr-messages') checkMessages();
        if(targetId === 'scr-guest') startGuestConsole();
        
        fade.classList.remove('glitch-active');
    }, 400);
}

// СИСТЕМА СООБЩЕНИЙ (localStorage)
function sendMessage() {
    const to = document.getElementById('msg-recipient').value;
    const text = document.getElementById('msg-text').value;
    if(!text) return;

    let allMsgs = JSON.parse(localStorage.getItem('ong_messages') || "[]");
    allMsgs.push({
        from: currentUser.name,
        to: to,
        text: text,
        time: new Date().toLocaleTimeString(),
        read: false
    });
    localStorage.setItem('ong_messages', JSON.stringify(allMsgs));
    
    document.getElementById('msg-text').value = "";
    alert("UUID-ПЕРЕДАЧА ЗАВЕРШЕНА");
}

function checkMessages() {
    let allMsgs = JSON.parse(localStorage.getItem('ong_messages') || "[]");
    let myMsgs = allMsgs.filter(m => m.to === currentUserID);
    
    // Уведомление в кабинете
    const alertBox = document.getElementById('msg-alert');
    if(alertBox) {
        if(myMsgs.some(m => !m.read)) alertBox.classList.remove('hidden');
        else alertBox.classList.add('hidden');
    }

    // Список сообщений в разделе Связь
    const list = document.getElementById('messages-list');
    if(list) {
        list.innerHTML = myMsgs.length ? myMsgs.map(m => `
            <div class="msg-item ${m.read ? '' : 'unread'}">
                <small>[${m.time}] ОТ: ${m.from}</small>
                <p>${m.text}</p>
            </div>
        `).reverse().join('') : "<p>Входящих данных нет.</p>";
        
        // Помечаем как прочитанные
        allMsgs.forEach(m => { if(m.to === currentUserID) m.read = true; });
        localStorage.setItem('ong_messages', JSON.stringify(allMsgs));
    }
}

// ЛОГИКА АВТОРИЗАЦИИ
function processLogin() {
    const id = document.getElementById('inp-id').value.toLowerCase().trim();
    const pass = document.getElementById('inp-pass').value.trim();
    const out = document.getElementById('login-output');

    const scanner = document.createElement('div');
    scanner.className = 'login-scanner';
    document.querySelector('.login-frame').appendChild(scanner);

    setTimeout(() => {
        scanner.remove();
        if (PROFILES[id] && PROFILES[id].pass === pass) {
            currentUser = PROFILES[id];
            currentUserID = id;

            // Заполнение профиля
            document.getElementById('welcome-user-name').innerText = currentUser.name;
            document.getElementById('p-name-val').innerText = currentUser.name;
            document.getElementById('p-uuid-val').innerText = currentUser.uuid;
            document.getElementById('p-lvl-text-val').innerText = currentUser.level;
            document.getElementById('p-rank-val').innerText = currentUser.rank;
            document.getElementById('p-date-val').innerText = currentUser.date;
            
            // Сообщение для персонала
            document.getElementById('staff-message-gen').innerText = STAFF_QUOTES[Math.floor(Math.random()*STAFF_QUOTES.length)];

            initMatrix(id === 'morisreal' ? "#FFD700" : "#A855F7");
            startTransition('scr-dash');
        } else {
            out.innerText = "ACCESS_DENIED";
            out.style.color = "red";
        }
    }, 1200);
}

// МАТРИЦА
function initMatrix(color = "#A855F7") {
    const canvas = document.getElementById('matrix-bg');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const drops = Array(Math.floor(canvas.width / 15)).fill(1);
    if(matrixInterval) clearInterval(matrixInterval);
    matrixInterval = setInterval(() => {
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.fillStyle = color;
        ctx.font = "15px monospace";
        drops.forEach((y, i) => {
            ctx.fillText(Math.floor(Math.random()*2), i*15, y*15);
            if(y*15 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }, 35);
}

// КОНСОЛЬ ГОСТЯ
function startGuestConsole() {
    const box = document.getElementById('guest-console');
    if(!box) return;
    box.innerHTML = '';
    let i = 0;
    function add() {
        if(document.getElementById('scr-guest').classList.contains('hidden')) return;
        const p = document.createElement('p');
        p.innerText = Math.random() > 0.85 ? "> ERROR: UUID_LOST" : LOG_LINES[i];
        box.insertBefore(p, box.firstChild);
        sound_type.play();
        if(box.children.length > 5) box.removeChild(box.lastChild);
        i = (i + 1) % LOG_LINES.length;
        setTimeout(add, 1500);
    }
    add();
}

// РАДАР С АВТОСКРОЛЛОМ
function initializeTacticalRadar() {
    startTransition('scr-map');
    const container = document.getElementById('radar-nodes');
    container.innerHTML = '';
    const nodes = [
        {id: "ONG_HQ", x: 48, y: 35, type: "ong", info: "ШТАБ ОНГ. Слой: Физический. Защита: MAX."},
        {id: "SUMBER_BUNKER", x: 25, y: 25, type: "ong", info: "БУНКЕР SUMBER. Склад ядер и UUID-ключей."},
        {id: "PRISM_EYE", x: 75, y: 65, type: "prism", info: "БУНКЕР ПРИЗМЫ. Обнаружен шпионский узел."},
        {id: "DYK_REACTOR", x: 40, y: 80, type: "dyk", info: "РЕАКТОР DYK. Стабильность: 82%."}
    ];
    nodes.forEach(n => {
        const d = document.createElement('div');
        d.className = `node ${n.type}`;
        d.style.left = n.x + '%'; d.style.top = n.y + '%';
        d.onclick = () => {
            document.getElementById('p-title').innerText = n.id;
            document.getElementById('p-text').innerText = n.info;
            // Плавный скролл к блоку инфо
            document.getElementById('radar-scroll').scrollTo({
                top: document.getElementById('radar-info-block').offsetTop,
                behavior: 'smooth'
            });
        };
        container.appendChild(d);
    });
}

// ДАТЧИКИ СИСТЕМЫ
function initSensors() {
    setInterval(() => {
        if (document.getElementById('scr-sysdata').classList.contains('hidden')) return;
        let cpu = Math.floor(Math.random()*15)+20;
        let temp = Math.floor(Math.random()*5)+40;
        let mem = (Math.random()*2+5).toFixed(1);
        document.getElementById('val-cpu').innerText = cpu + "%";
        document.getElementById('bar-cpu').style.width = cpu + "%";
        document.getElementById('val-temp').innerText = temp + "°C";
        document.getElementById('bar-temp').style.width = temp + "%";
        document.getElementById('val-mem').innerText = mem + " GB";
        document.getElementById('bar-mem').style.width = (mem/16)*100 + "%";
    }, 1500);
}

// Загрузка системы
window.onload = () => {
    initMatrix();
    initSensors();
    document.addEventListener('mousedown', initAmbient, {once: true});
    document.getElementById('intro-ascii').innerText = "SYSTEM_V32.7_BOOTING...";
    setTimeout(() => {
        document.getElementById('intro-logo').classList.remove('hidden');
        setTimeout(() => startTransition('scr-login'), 1500);
    }, 1000);
};

// Контекстное меню
document.addEventListener('contextmenu', e => {
    e.preventDefault();
    const m = document.getElementById('custom-menu');
    m.style.display = 'block'; m.style.left = e.pageX + 'px'; m.style.top = e.pageY + 'px';
});
document.addEventListener('click', () => { if(document.getElementById('custom-menu')) document.getElementById('custom-menu').style.display='none'; });

setInterval(() => {
    const c = document.getElementById('clock');
    if(c) c.innerText = new Date().toLocaleTimeString();
}, 1000);

function toggleSidebar(s) { document.getElementById('sidebar').classList.toggle('open', s); document.getElementById('side-overlay').style.display = s?'block':'none'; }
function openProfile() { document.getElementById('modal-profile').classList.remove('hidden'); toggleSidebar(false); }
function closeProfile() { document.getElementById('modal-profile').classList.add('hidden'); }
