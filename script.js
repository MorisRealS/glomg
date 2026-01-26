const PROFILES = {
    "morisreal": { name: "MorisReal", pass: "admin", lvl: 6 },
    "sumber":    { name: "Sumber", pass: "0000", lvl: 5 },
    "dykzxz":    { name: "Dykzxz", pass: "2222", lvl: 3 },
    "kiddy":     { name: "Kiddy", pass: "1111", lvl: 2 }
};

let step = "ID";
let tempUser = null;

// Плавный переход через черный экран
function startTransition(targetId) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    
    setTimeout(() => {
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        // Показываем нужный
        document.getElementById(targetId).classList.remove('hidden');
        
        // Спец-функции для модулей
        if(targetId === 'scr-archive') renderArchive();
        if(targetId === 'scr-status') startHardwareMonitor();
        
        fade.classList.remove('active');
    }, 600);
}

// Работа терминала (Логин)
const cmdInput = document.getElementById('cmd');
const output = document.getElementById('output');

cmdInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const val = cmdInput.value.trim().toLowerCase();
        cmdInput.value = "";

        if (step === "ID") {
            if (PROFILES[val]) {
                tempUser = PROFILES[val];
                step = "PASSWORD";
                output.innerHTML += `<div>> USER '${val}' FOUND. WAITING FOR KEY...</div>`;
                document.querySelector('.prompt').textContent = "PASS:> ";
                cmdInput.type = "password";
            } else {
                output.innerHTML += `<div style="color:red">> ERROR: INVALID_ID</div>`;
            }
        } else if (step === "PASSWORD") {
            if (val === tempUser.pass) {
                localStorage.setItem('ong_user', JSON.stringify(tempUser));
                loginSuccess(tempUser);
            } else {
                output.innerHTML += `<div style="color:red">> ACCESS_DENIED. SYSTEM REBOOT...</div>`;
                setTimeout(() => location.reload(), 1500);
            }
        }
    }
});

function loginSuccess(user) {
    startTransition('scr-dash');
    document.getElementById('user-name-display').textContent = user.name;
    document.getElementById('p-name').textContent = "NAME: " + user.name;
    document.getElementById('p-lvl').textContent = "LVL: " + user.lvl;
}

function enterGuestMode() {
    document.getElementById('guest-news').classList.remove('hidden');
    output.innerHTML = "<div>> GUEST_SESSION_STARTED. READ_ONLY.</div>";
}

// Сайдбар
function toggleSidebar(state) {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('side-overlay');
    if(state) {
        sb.classList.add('open');
        ov.style.display = 'block';
    } else {
        sb.classList.remove('open');
        ov.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('ong_user');
    location.reload();
}

// --- МОДУЛЬ АРХИВА ---
function renderArchive() {
    const logs = [
        { id: "LOG_88", title: "Project Prisma Status", txt: "Всё стабильно, утечек нет." },
        { id: "LOG_92", title: "Security Breach #2", txt: "Обнаружена попытка входа извне." },
        { id: "LOG_99", title: "Administrator Note", txt: "Сменить пароли к Level 6." }
    ];
    const container = document.getElementById('archive-list');
    container.innerHTML = logs.map(l => `
        <div class="archive-item">
            <div class="archive-header" onclick="this.parentElement.classList.toggle('open')">
                <span>[${l.id}] ${l.title}</span>
            </div>
            <div class="archive-content">${l.txt}</div>
        </div>
    `).join('');
}

// --- МОДУЛЬ СТАТУСА ---
function startHardwareMonitor() {
    setInterval(() => {
        if(document.getElementById('scr-status').classList.contains('hidden')) return;
        document.getElementById('cpu-val').textContent = Math.floor(Math.random() * 100) + "%";
        document.getElementById('mem-val').textContent = Math.floor(Math.random() * 100) + "%";
        document.getElementById('temp-val').textContent = 40 + Math.floor(Math.random() * 10);
    }, 1000);
}

// --- ЗАГРУЗКА И ФОН ---
window.onload = () => {
    const saved = localStorage.getItem('ong_user');
    if (saved) {
        loginSuccess(JSON.parse(saved));
    } else {
        // Последовательность интро
        setTimeout(() => {
            document.getElementById('intro-ascii').classList.add('hidden');
            document.getElementById('intro-logo').classList.remove('hidden');
            setTimeout(() => startTransition('scr-login'), 3000);
        }, 1500);
    }
    initMatrix();
};

function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const drops = Array(Math.floor(canvas.width/14)).fill(1);
    setInterval(() => {
        ctx.fillStyle = "rgba(5, 2, 8, 0.1)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#a855f7"; 
        drops.forEach((y, i) => {
            ctx.fillText(Math.floor(Math.random()*2), i*14, y*14);
            if(y*14 > canvas.height && Math.random() > 0.98) drops[i] = 0;
            drops[i]++;
        });
    }, 50);
}

setInterval(() => {
    const cl = document.getElementById('clock');
    if(cl) cl.innerText = new Date().toLocaleTimeString();
}, 1000);

// --- ЛОГИКА СООБЩЕНИЙ ОТ БОТА (WebSocket заготовка) ---
/*
const socket = new WebSocket('ws://твой_сервер');
socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if(msg.type === 'ALARM') {
        document.body.classList.add('alarm-active');
        alert("ТРЕВОГА: " + msg.text);
    }
};
*/
