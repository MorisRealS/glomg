const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: 4, token: "KID", uuid: "1101010010" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: 4, token: "DYK", uuid: "1011100001" },
    "msk4ne_":  { name: "MSK4NE", pass: "3333", level: 4, token: "MSK", uuid: "0001110100" },
    "sumber":   { name: "Sumber", pass: "0000", level: 5, token: "SBR", uuid: "1110001110" },
    "morisreal": { name: "МОРИС", pass: "123", level: 6, token: "MRS", uuid: "1010101010" }
};

let currentUser = null;

// ПЕРЕХОДЫ МЕЖДУ ЭКРАНАМИ
function startTransition(targetId) {
    const fade = document.getElementById('fade');
    fade.classList.add('active');
    
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(targetId).classList.remove('hidden');
        if(targetId === 'scr-guest') startGuestLogs();
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
        
        let status = currentUser.level >= 5 ? "ADMINISTRATOR" : "MODERATOR";
        document.getElementById('p-status-val').innerText = status;

        out.style.color = "var(--terminal-green)";
        out.innerText = "SUCCESS. LOADING...";
        setTimeout(() => startTransition('scr-dash'), 1000);
    } else {
        out.style.color = "red";
        out.innerText = "ACCESS DENIED";
    }
}

// РАДАР С 3 ТОЧКАМИ
function initializeTacticalRadar() {
    startTransition('scr-map');
    const nodesContainer = document.getElementById('radar-nodes');
    nodesContainer.innerHTML = '';
    
    const nodes = [
        {id: "ONG_LAB", x: 45, y: 30, type: "ong", info: "Основная лаборатория ОНГ. Статус: АКТИВНА"},
        {id: "PRISM_BASE", x: 65, y: 55, type: "prism", info: "База P.R.I.S.M. Статус: НАБЛЮДЕНИЕ"},
        {id: "DYK_REACTOR", x: 30, y: 70, type: "dyk", info: "Реактор Dykzxz. Статус: ОСТАНОВЛЕН (КРИТИЧЕСКИЙ СБОЙ)"}
    ];

    nodes.forEach(n => {
        const div = document.createElement('div');
        div.className = `node ${n.type}`;
        div.style.left = n.x + '%';
        div.style.top = n.y + '%';
        div.onclick = () => {
            document.getElementById('p-title').innerText = n.id;
            document.getElementById('p-text').innerText = n.info;
        };
        nodesContainer.appendChild(div);
    });
}

// ПРЫГАЮЩИЕ ДАТЧИКИ
function initSensors() {
    let cpu = 15, temp = 40, mem = 0.5;
    setInterval(() => {
        if (document.getElementById('scr-sysdata').classList.contains('hidden')) return;
        
        const jump = () => [1, -2, 4, -1, 2, -5][Math.floor(Math.random()*6)];
        
        cpu = Math.max(10, Math.min(20, cpu + jump()));
        temp = Math.max(30, Math.min(60, temp + jump()));
        mem = Math.max(0.1, Math.min(1.0, mem + (jump()/100)));

        document.getElementById('val-cpu').innerText = cpu + "%";
        document.getElementById('bar-cpu').style.width = (cpu/20*100) + "%";
        
        document.getElementById('val-temp').innerText = temp + "°C";
        document.getElementById('bar-temp').style.width = (temp/120*100) + "%";
        
        document.getElementById('val-mem').innerText = mem.toFixed(2) + " GB";
        document.getElementById('bar-mem').style.width = (mem/10*100) + "%";

        let total = Math.floor((cpu/20*40) + (temp/60*60));
        document.getElementById('val-total').innerText = total + "%";
        document.getElementById('bar-total').style.width = total + "%";
    }, 1000);
}

// ГОСТЕВАЯ КОНСОЛЬ (5 строк)
async function startGuestLogs() {
    const box = document.getElementById('guest-console');
    box.innerHTML = '';
    const logs = [
        "> Establishing uplink...",
        "> Handshake: SUCCESS",
        "> Запрос UUID от внешнего узла: ОТКЛОНЕНО.",
        "> ВНИМАНИЕ: Гостевой вход в секторе 0.",
        "> [OK] Система мониторинга активна."
    ];
    for (let line of logs) {
        await new Promise(r => setTimeout(r, 700));
        const p = document.createElement('p');
        p.innerText = line;
        box.appendChild(p);
    }
}

// ВСПОМОГАТЕЛЬНОЕ
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
    initSensors();
    const intro = document.getElementById('intro-ascii');
    intro.innerText = "INITIALIZING O.N.G. CORE...";
    setTimeout(() => {
        document.getElementById('intro-logo').classList.remove('hidden');
        setTimeout(() => startTransition('scr-login'), 2500);
    }, 1200);
};

setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);
