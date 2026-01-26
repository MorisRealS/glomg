const PROFILES = {
    "msk4ne_":  { name: "MSK4NE", pass: "3333", uuid: "0001-M" },
    "sumber":   { name: "Sumber", pass: "0000", uuid: "7777-S" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", uuid: "1011-D" }
};

const LOG_CMDS = [
    "ATTACHING UUID...", "ENCRYPTING CHANNEL...", "SCANNING SECTOR 7...", 
    "BYPASSING FIREWALL...", "ACCESSING NODE #09", "HEARTBEAT: OK", 
    "BUFFER_OVERFLOW: NO", "FETCHING DATA PACKS...", "DECRYPTING RSA-4096",
    "RE-ROUTING IP...", "WIPING LOGS...", "TRACING SIGNAL...",
    "PRISM_CORE: ONLINE", "SYNCING DATABASE...", "UPLOAD_PENDING...",
    "CRYPTO_KEY_ACCEPTED", "LINK_STABLE_99%", "GATE_B_OPEN", "DELETING_TRACE",
    "NODE_4_ACTIVE", "SIGNAL_MATCHED", "CORE_REBOOT_PREP", "LINKING_UUID_7",
    "SENSORS_INIT", "ALARM_DISABLED", "PROXY_SET", "PACKET_SENT", "ACK_RECEIVED"
];

let activeUser = null;

// MATRIX
function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const columns = canvas.width / 14;
    const drops = Array(Math.floor(columns)).fill(1);
    setInterval(() => {
        ctx.fillStyle = "rgba(5, 2, 8, 0.1)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#a855f7"; ctx.font = "14px monospace";
        drops.forEach((y, i) => {
            const text = Math.floor(Math.random()*2);
            ctx.fillText(text, i*14, y*14);
            if(y*14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }, 45);
}

// LOGIN
function attemptLogin() {
    const id = document.getElementById('user-id').value.trim().toLowerCase();
    const pass = document.getElementById('user-pass').value.trim();
    if (PROFILES[id] && PROFILES[id].pass === pass) {
        activeUser = PROFILES[id];
        startTransition('main-dashboard');
    } else {
        const out = document.getElementById('output');
        out.innerHTML = "<div style='color:red'>> ОШИБКА: ДОСТУП ОТКЛОНЕН</div>";
    }
}

// SENSORS
function runSensors() {
    setInterval(() => {
        const jump = () => (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 1.5);
        
        // CPU 10-20
        let cpu = parseFloat(document.getElementById('val-cpu').innerText) + jump();
        cpu = Math.min(Math.max(cpu, 10), 20).toFixed(1);
        document.getElementById('val-cpu').innerText = cpu + "%";
        document.getElementById('bar-cpu').style.width = cpu + "%";

        // TEMP 30-60
        let temp = parseFloat(document.getElementById('val-temp').innerText) + jump() * 2;
        temp = Math.min(Math.max(temp, 30), 60).toFixed(1);
        document.getElementById('val-temp').innerText = temp + "°C";
        document.getElementById('bar-temp').style.width = (temp * 1.6) + "%";

        // MEM 0.3 - 2.0 GB
        let mem = parseFloat(document.getElementById('val-mem').innerText) + (jump()/10);
        mem = Math.min(Math.max(mem, 0.3), 2.0).toFixed(2);
        document.getElementById('val-mem').innerText = mem + " GB";
        document.getElementById('bar-mem').style.width = (mem * 50) + "%";
    }, 1200);
}

// RADAR
function initRadar() {
    startTransition('scr-radar');
    const container = document.getElementById('radar-nodes'); container.innerHTML = '';
    const pts = [
        { x: 30, y: 30, n: "ЛАБОРАТОРИЯ ОНГ", c: "#a855f7", act: true },
        { x: 75, y: 40, n: "БУНКЕР P.R.I.S.M", c: "#00f7ff", act: true },
        { x: 50, y: 75, n: "РЕАКТОР DYKzxz", c: "#ff2233", act: false },
        { x: 15, y: 65, n: "СЕКТОР_СЕРЫЙ_А", c: "gray", act: false },
        { x: 80, y: 20, n: "СЕКТОР_СЕРЫЙ_Б", c: "gray", act: false }
    ];
    pts.forEach(p => {
        const d = document.createElement('div'); d.className = 'node';
        d.style.left = p.x + '%'; d.style.top = p.y + '%';
        d.style.backgroundColor = p.c; d.style.boxShadow = `0 0 15px ${p.c}`;
        if(p.act) d.classList.add('pulse');
        d.onclick = () => {
            document.getElementById('rad-title').innerText = p.n;
            document.getElementById('rad-title').style.color = p.c;
            document.getElementById('rad-text').innerText = p.act ? "СТАТУС: АКТИВЕН // UUID_SYNC_100%" : "СТАТУС: НЕАКТИВЕН // НЕТ ПИТАНИЯ";
        };
        container.appendChild(d);
    });
}

function startTransition(id) {
    document.getElementById('fade').style.opacity = 1;
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        if(id === 'main-dashboard') {
            document.getElementById('user-name-display').innerText = activeUser.name;
            runSensors();
        }
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
