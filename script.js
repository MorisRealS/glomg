const DB = {
    "morisreal": { pass: "morisreal_profile_console", rank: "CHIEF_OPERATOR", ava: "M", x: 50, y: 50, type: "owner", title: "МОЯ ЛАБОРАТОРИЯ" },
    "sumber": { pass: "SumberTheAdminPRISMS", rank: "PRISMA_LAB_CHIEF", ava: "P", x: 25, y: 40, type: "online", title: "ЛАБА ПРИЗМЫ" },
    "dykxzx": { pass: "DykProfileConsoleONG", rank: "FAILED_REACTOR", ava: "D", x: 75, y: 60, type: "broken", title: "РЕАКТОР ДУКА" }
};

let activeUser = null;

// ИНТРО (БЕЗ ИЗМЕНЕНИЙ)
window.onload = () => {
    const ascii = document.getElementById('intro-ascii');
    const text = "G.L.O.M.G. v26.5\nSYSTEM_BOOT...\nREADY.";
    let i = 0;
    let t = setInterval(() => {
        ascii.textContent += text[i];
        i++;
        if(i >= text.length) { clearInterval(t); setTimeout(() => transition('scr-login'), 1000); }
    }, 40);
};

function transition(id) {
    const f = document.getElementById('fade');
    f.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        f.classList.remove('active');
    }, 400);
}

// АВТОРИЗАЦИЯ (БЕЗ ИЗМЕНЕНИЙ)
function auth() {
    const id = document.getElementById('inp-id').value.toLowerCase();
    const ps = document.getElementById('inp-pass').value;
    if(DB[id] && DB[id].pass === ps) {
        activeUser = { id, ...DB[id] };
        document.getElementById('u-name').textContent = id.toUpperCase();
        document.getElementById('u-name-side').textContent = id.toUpperCase();
        document.getElementById('u-rank').textContent = activeUser.rank;
        document.getElementById('u-ava').textContent = activeUser.ava;
        document.getElementById('u-ava-side').textContent = activeUser.ava;
        transition('scr-dash');
        startNotifs();
    } else { alert("ACCESS DENIED"); }
}

function goGuest() { transition('scr-dash'); } // Для тестов кидаем сразу

function side(st) {
    document.getElementById('sidebar').classList.toggle('open', st);
    document.getElementById('side-overlay').style.display = st ? 'block' : 'none';
}

function modal(id, st) { document.getElementById(id).classList.toggle('hidden', !st); }

// УВЕДОМЛЕНИЯ
function startNotifs() {
    const box = document.getElementById('dash-notifications');
    const logs = ["> SCANNING...", "> FREQUENCY STABLE", "> NODE_07: ONLINE", "> ALL SYSTEMS GO", "> SYNC COMPLETE"];
    setInterval(() => {
        const d = document.createElement('div');
        d.textContent = logs[Math.floor(Math.random()*logs.length)];
        box.prepend(d);
        if(box.childNodes.length > 5) box.lastChild.remove();
    }, 3500);
}

// РАДАР
function goMap() {
    transition('scr-map');
    const nodes = document.getElementById('radar-nodes');
    nodes.innerHTML = "";
    Object.keys(DB).forEach(key => {
        const item = DB[key];
        const dot = document.createElement('div');
        dot.className = `node ${item.type}`;
        dot.style.left = item.x + "%";
        dot.style.top = item.y + "%";
        dot.onclick = () => alert(`${item.title}\nSTATUS: ${item.type.toUpperCase()}`);
        nodes.appendChild(dot);
    });
}

// ЧАСЫ И ТРАФИК
setInterval(() => {
    const c = document.getElementById('clock');
    if(c) c.textContent = new Date().toLocaleTimeString();
    const flow = document.getElementById('data-flow');
    if(flow) flow.textContent = (Math.random() * 40).toFixed(2) + " Kbps";
}, 1000);
