const PROFILES = {
    "msk4ne_":  { name: "MSK4NE", pass: "3333", uuid: "0001-M", lvl: "S-CLASS" },
    "sumber":   { name: "Sumber", pass: "0000", uuid: "7777-S", lvl: "ADMIN" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", uuid: "1011-D", lvl: "TECH" }
};

const NEWS_DATA = [
    "Система переведена на ядро V32.8.",
    "Зафиксирована активность в Секторе 7.",
    "MSK4NE подтвердил стабильность узлов.",
    "Обнаружен неопознанный сигнал в туманности."
];

let activeUser = null;
let guestInterval = null;

// MATRIX BACKGROUND
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

// NAVIGATION
function toggleSidebar(state) {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('side-overlay');
    if(state) { sb.classList.add('open'); ov.style.display = 'block'; }
    else { sb.classList.remove('open'); ov.style.display = 'none'; }
}

function startTransition(id) {
    document.getElementById('fade').style.opacity = 1;
    if(guestInterval) clearInterval(guestInterval);
    
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        
        if(id === 'main-dashboard') document.getElementById('user-name-display').innerText = activeUser.name;
        if(id === 'scr-guest') runGuestMode();
        
        document.getElementById('fade').style.opacity = 0;
    }, 500);
}

// LOGIN LOGIC
function attemptLogin() {
    const id = document.getElementById('user-id').value.trim().toLowerCase();
    const pass = document.getElementById('user-pass').value.trim();
    if (PROFILES[id] && PROFILES[id].pass === pass) {
        activeUser = PROFILES[id];
        startTransition('main-dashboard');
    } else {
        const out = document.getElementById('output');
        out.innerHTML = "<div style='color:red'>> ERROR: ACCESS_DENIED</div>";
    }
}

// GUEST MODE (CONSOLE + NEWS)
function runGuestMode() {
    const consoleBox = document.getElementById('guest-console');
    const newsBox = document.getElementById('news-feed');
    
    // Чистим и заполняем новости
    newsBox.innerHTML = NEWS_DATA.map(n => `<div class="news-item">>> ${n}</div>`).join('');
    
    guestInterval = setInterval(() => {
        const line = document.createElement('div');
        line.innerText = `> SCANNING_SECTOR_${Math.floor(Math.random()*100)}... OK`;
        consoleBox.prepend(line);
        if(consoleBox.childNodes.length > 15) consoleBox.removeChild(consoleBox.lastChild);
    }, 1000);
}

// RADAR
function initRadar() {
    startTransition('scr-radar');
    const container = document.getElementById('radar-nodes');
    container.innerHTML = '';
    const points = [
        { x: 25, y: 30, n: "LAB_ALPHA", c: "#a855f7" },
        { x: 60, y: 50, n: "CORE_REACTOR", c: "#00f7ff" }
    ];
    points.forEach(p => {
        const node = document.createElement('div');
        node.className = 'node pulse';
        node.style.left = p.x + '%'; node.style.top = p.y + '%';
        node.style.backgroundColor = p.c;
        node.onclick = () => {
            document.getElementById('rad-title').innerText = p.n;
            document.getElementById('rad-text').innerText = `Координаты: ${p.x}, ${p.y} | Статус: СТАБИЛЬНО`;
            document.getElementById('scr-radar').scrollTo({top: 500, behavior: 'smooth'});
        };
        container.appendChild(node);
    });
}

function openProfile() {
    document.getElementById('p-name-val').innerText = activeUser.name;
    document.getElementById('p-uuid-val').innerText = activeUser.uuid;
    document.getElementById('modal-profile').classList.remove('hidden');
    toggleSidebar(false);
}
function closeProfile() { document.getElementById('modal-profile').classList.add('hidden'); }

window.onload = () => {
    initMatrix();
    setInterval(() => {
        const cl = document.getElementById('clock');
        if(cl) cl.innerText = new Date().toLocaleTimeString();
    }, 1000);
};
