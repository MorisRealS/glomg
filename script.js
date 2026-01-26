const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: 4, token: "KID", uuid: "1101010010" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: 4, token: "DYK", uuid: "1011100001" },
    "morisreal": { name: "МОРИС", pass: "123", level: 6, token: "MRS", uuid: "1010101010" }
};

const LOG_LINES = ["> SYNC_UUID...", "> ACCESS_GRANTED", "> WARNING: PORT_SCAN", "> PRISM_LINK: OK", "> CORE_STABLE"];
const sound_type = new Audio('https://www.soundjay.com/communication/sounds/typewriter-key-1.mp3');
sound_type.volume = 0.05;

let currentUser = null;
let matrixInterval = null;

// --- #20 КОНТЕКСТНОЕ МЕНЮ ---
document.addEventListener('contextmenu', e => {
    e.preventDefault();
    const menu = document.getElementById('custom-menu');
    menu.style.display = 'block';
    menu.style.left = e.pageX + 'px';
    menu.style.top = e.pageY + 'px';
});
document.addEventListener('click', () => { 
    if(document.getElementById('custom-menu')) document.getElementById('custom-menu').style.display = 'none'; 
});

// --- #12 ПАРАЛЛАКС ---
document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.pageX) / 60;
    const y = (window.innerHeight / 2 - e.pageY) / 60;
    document.body.style.backgroundPosition = `${x}px ${y}px`;
});

// --- #7 МАТРИЦА (ПО ЦВЕТАМ) ---
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
        ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.fillStyle = color;
        ctx.font = "15px monospace";
        drops.forEach((y, i) => {
            const text = Math.floor(Math.random()*2);
            ctx.fillText(text, i*15, y*15);
            if(y*15 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }, 35);
}

// --- #15 ГЛИТЧ-ПЕРЕХОД ---
function startTransition(targetId) {
    const fade = document.getElementById('fade');
    fade.classList.add('glitch-active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(targetId).classList.remove('hidden');
        if(targetId === 'scr-guest') startGuestConsole();
        fade.classList.remove('glitch-active');
    }, 400);
}

// --- #8 СКАНЕР + ЛОГИН ---
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
            document.getElementById('welcome-user-name').innerText = currentUser.name;
            document.getElementById('p-name-val').innerText = currentUser.name;
            document.getElementById('p-token-val').innerText = currentUser.token;
            document.getElementById('p-lvl-text-val').innerText = currentUser.level;
            document.getElementById('p-uuid-val').innerText = currentUser.uuid;
            
            const mColor = id === 'morisreal' ? "#FFD700" : "#A855F7";
            initMatrix(mColor);
            startTransition('scr-dash');
        } else {
            out.innerText = "ACCESS_DENIED";
            out.style.color = "red";
        }
    }, 1200);
}

// --- #1 ЗВУК + #26 ОШИБКИ ---
function startGuestConsole() {
    const box = document.getElementById('guest-console');
    box.innerHTML = '';
    let i = 0;
    function add() {
        if(document.getElementById('scr-guest').classList.contains('hidden')) return;
        const p = document.createElement('p');
        p.innerText = Math.random() > 0.85 ? "> ERROR: UUID_NULL" : LOG_LINES[i];
        p.style.marginBottom = "5px";
        box.insertBefore(p, box.firstChild);
        sound_type.play();
        if(box.children.length > 5) box.removeChild(box.lastChild);
        i = (i + 1) % LOG_LINES.length;
        setTimeout(add, 1500);
    }
    add();
}

// --- РАДАР ---
function initializeTacticalRadar() {
    startTransition('scr-map');
    const container = document.getElementById('radar-nodes');
    container.innerHTML = '';
    const nodes = [
        {id: "ONG_HQ", x: 48, y: 35, type: "ong", info: "ГЛАВНЫЙ ШТАБ ОНГ. СТАТУС: ONLINE."},
        {id: "REACTOR_X", x: 30, y: 70, type: "dyk", info: "РЕАКТОР. ТРЕБУЕТСЯ СТАБИЛИЗАЦИЯ."}
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

// --- СИСТЕМА ---
function initSensors() {
    setInterval(() => {
        if (document.getElementById('scr-sysdata').classList.contains('hidden')) return;
        let cpu = Math.floor(Math.random() * 15) + 10;
        let temp = Math.floor(Math.random() * 5) + 40;
        document.getElementById('val-cpu').innerText = cpu + "%";
        document.getElementById('bar-cpu').style.width = cpu*3 + "%";
        document.getElementById('val-temp').innerText = temp + "°C";
        document.getElementById('bar-temp').style.width = temp + "%";
    }, 1500);
}

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

window.onload = () => {
    initMatrix();
    initSensors();
    document.getElementById('intro-ascii').innerText = "V32.0_BOOT";
    setTimeout(() => {
        document.getElementById('intro-logo').classList.remove('hidden');
        setTimeout(() => startTransition('scr-login'), 1500);
    }, 1000);
};

setInterval(() => {
    const c = document.getElementById('clock');
    if(c) c.innerText = new Date().toLocaleTimeString();
}, 1000);
