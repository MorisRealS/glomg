const PROFILES = {
    "msk4ne_":  { name: "MSK4NE", pass: "3333", uuid: "0001-M" },
    "sumber":   { name: "Sumber", pass: "0000", uuid: "7777-S" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", uuid: "1011-D" }
};

const LOG_CMDS = ["SYNCING...", "ENCRYPTING...", "SECTOR_7_SCAN", "UUID_MATCH", "CORE_STABLE", "GATE_OPEN", "DECRYPT_RSA"];
let activeUser = null;

// MATRIX FON
function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const drops = Array(Math.floor(canvas.width/14)).fill(1);
    setInterval(() => {
        ctx.fillStyle = "rgba(5, 2, 8, 0.1)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#a855f7"; drops.forEach((y, i) => {
            ctx.fillText(Math.floor(Math.random()*2), i*14, y*14);
            if(y*14 > canvas.height && Math.random() > 0.98) drops[i] = 0;
            drops[i]++;
        });
    }, 50);
}

// SIDEBAR FIX
function toggleSidebar(state) {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('side-overlay');
    if(state) { sb.classList.add('open'); ov.style.display = 'block'; }
    else { sb.classList.remove('open'); ov.style.display = 'none'; }
}

function openProfile() {
    document.getElementById('p-name-val').innerText = activeUser.name;
    document.getElementById('p-uuid-val').innerText = activeUser.uuid;
    document.getElementById('modal-profile').classList.remove('hidden');
    toggleSidebar(false);
}
function closeProfile() { document.getElementById('modal-profile').classList.add('hidden'); }

// LOGIN
function attemptLogin() {
    const id = document.getElementById('user-id').value.trim().toLowerCase();
    const pass = document.getElementById('user-pass').value.trim();
    if (PROFILES[id] && PROFILES[id].pass === pass) {
        activeUser = PROFILES[id];
        startTransition('main-dashboard');
    } else {
        document.getElementById('output').innerHTML = "<div style='color:red'>> ERROR: ACCESS DENIED</div>";
    }
}

// RADAR
function initRadar() {
    startTransition('scr-radar');
    const container = document.getElementById('radar-nodes');
    container.innerHTML = '';
    const pts = [
        { x: 30, y: 30, n: "ЛАБОРАТОРИЯ ОНГ", c: "#a855f7", act: true },
        { x: 70, y: 40, n: "БУНКЕР P.R.I.S.M", c: "#00f7ff", act: true },
        { x: 50, y: 70, n: "РЕАКТОР DYKzxz", c: "#ff2233", act: false }
    ];
    pts.forEach(p => {
        const d = document.createElement('div');
        d.className = 'node';
        d.style.left = p.x + '%'; d.style.top = p.y + '%';
        d.style.backgroundColor = p.c;
        if(p.act) d.classList.add('pulse');
        d.onclick = () => {
            document.getElementById('rad-title').innerText = p.n;
            document.getElementById('rad-text').innerText = p.act ? "СТАТУС: АКТИВЕН // СИГНАЛ 100%" : "СТАТУС: OFFLINE";
            document.getElementById('scr-radar').scrollTo({top: 500, behavior: 'smooth'});
        };
        container.appendChild(d);
    });
}

// ARCHIVE FIX
function renderArchive() {
    const data = [
        {id: "LOG_01", msg: "Ядро V32.8 запущено удачно."},
        {id: "LOG_02", msg: "Зафиксирована попытка входа: Сектор 4."}
    ];
    document.getElementById('db-logs-list').innerHTML = data.map(i => `
        <div class="db-log-item">
            <div class="db-log-header" onclick="this.nextElementSibling.classList.toggle('open')">
                <span>[ ${i.id} ]</span> <span>VIEW_LOG</span>
            </div>
            <div class="db-log-content">${i.msg}</div>
        </div>
    `).join('');
}

function startTransition(id) {
    document.getElementById('fade').style.opacity = 1;
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        if(id === 'main-dashboard') document.getElementById('user-name-display').innerText = activeUser.name;
        if(id === 'scr-archive') renderArchive();
        if(id === 'scr-guest') {
            const box = document.getElementById('guest-console');
            setInterval(() => {
                const l = document.createElement('div');
                l.innerText = "> " + LOG_CMDS[Math.floor(Math.random()*LOG_CMDS.length)];
                box.prepend(l); if(box.childNodes.length > 20) box.removeChild(box.lastChild);
            }, 800);
        }
        document.getElementById('fade').style.opacity = 0;
    }, 500);
}

window.onload = () => {
    initMatrix();
    setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString(); }, 1000);
};
