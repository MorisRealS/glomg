const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: 4, token: "KID", uuid: "1101010010" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: 4, token: "DYK", uuid: "1011100001" },
    "msk4ne_":  { name: "MSK4NE", pass: "3333", level: 4, token: "MSK", uuid: "0001110100" },
    "sumber":   { name: "Sumber", pass: "0000", level: 5, token: "SBR", uuid: "1110001110" },
    "morisreal": { name: "МОРИС", pass: "123", level: 6, token: "MRS", uuid: "1010101010" }
};

const LOGS = [
    "> UUID_SYNC: 100%", "> ACCESS_GRANTED: NODE_7", "> WARNING: PORT_SCAN", 
    "> PRISM_UPLINK: ACTIVE", "> REACTOR_STATUS: IDLE", "> LOG_CLEANUP...", 
    "> CORE_TEMP: STABLE", "> UUID_COLLISION: NONE"
];

let currentUser = null;

function startTransition(targetId) {
    const fade = document.getElementById('fade');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        const target = document.getElementById(targetId);
        target.classList.remove('hidden');
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

// КОНСОЛЬ: Строго 5 строк, симметрия
function startGuestConsole() {
    const box = document.getElementById('guest-console');
    box.innerHTML = '';
    let i = 0;
    function add() {
        if (!document.getElementById('scr-guest').classList.contains('hidden')) {
            const p = document.createElement('p');
            p.innerText = LOGS[i];
            p.style.margin = "8px 0";
            box.insertBefore(p, box.firstChild);
            if (box.children.length > 5) box.removeChild(box.lastChild);
            i = (i + 1) % LOGS.length;
            setTimeout(add, 1200);
        }
    }
    add();
}

// ДАТЧИКИ: ОЖИВЛЕНИЕ
function initSensors() {
    setInterval(() => {
        if (document.getElementById('scr-sysdata').classList.contains('hidden')) return;
        
        let cpu = Math.floor(Math.random() * 15) + 10;
        let temp = Math.floor(Math.random() * 10) + 40;
        let mem = (Math.random() * 0.5 + 4.2).toFixed(2);
        
        document.getElementById('val-cpu').innerText = cpu + "%";
        document.getElementById('bar-cpu').style.width = (cpu*5) + "%";
        
        document.getElementById('val-temp').innerText = temp + "°C";
        document.getElementById('bar-temp').style.width = temp + "%";
        
        document.getElementById('val-mem').innerText = mem + " GB";
        document.getElementById('bar-mem').style.width = (mem*10) + "%";
        
        let total = 100 - (cpu/2);
        document.getElementById('val-total').innerText = Math.floor(total) + "%";
        document.getElementById('bar-total').style.width = total + "%";
    }, 1500);
}

function initializeTacticalRadar() {
    startTransition('scr-map');
    const container = document.getElementById('radar-nodes');
    container.innerHTML = '';
    const nodes = [
        {id: "ONG_HQ", x: 48, y: 35, type: "ong", info: "Штаб ОНГ. Статус: Online."},
        {id: "PRISM", x: 65, y: 55, type: "prism", info: "Узел Призмы. Сканирование..."},
        {id: "REACTOR", x: 30, y: 70, type: "dyk", info: "Реактор. Статус: Offline."}
    ];
    nodes.forEach(n => {
        const d = document.createElement('div');
        d.className = `node ${n.type}`;
        d.style.left = n.x + '%'; d.style.top = n.y + '%';
        d.onclick = () => {
            document.getElementById('p-title').innerText = n.id;
            document.getElementById('p-text').innerText = n.info;
            document.getElementById('radar-scroll').scrollTo({top: 400, behavior: 'smooth'});
        };
        container.appendChild(d);
    });
}

function toggleSidebar(s) {
    document.getElementById('sidebar').classList.toggle('open', s);
    document.getElementById('side-overlay').style.display = s ? 'block' : 'none';
}
function openProfile() { document.getElementById('modal-profile').classList.remove('hidden'); toggleSidebar(false); }
function closeProfile() { document.getElementById('modal-profile').classList.add('hidden'); }
function toggleArchive(b) { b.nextElementSibling.classList.toggle('hidden'); }

window.onload = () => {
    initSensors();
    document.getElementById('intro-ascii').innerText = "SYSTEM_READY";
    setTimeout(() => {
        document.getElementById('intro-logo').classList.remove('hidden');
        setTimeout(() => startTransition('scr-login'), 2000);
    }, 1000);
};

setInterval(() => {
    const c = document.getElementById('clock');
    if(c) c.innerText = new Date().toLocaleTimeString();
}, 1000);
