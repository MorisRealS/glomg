const DB = {
    "morisreal": { pass: "123", lvl: 6, name: "МОРИС", token: "MRS" },
    "sumber": { pass: "prisma", lvl: 5, name: "SUMBER", token: "SBR" }
};

function transitionToScreen(id) {
    const fade = document.getElementById('fade');
    fade.style.opacity = 1;
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        toggleSidebar(false);
        fade.style.opacity = 0;
    }, 400);
}

function processLogin() {
    const u = document.getElementById('inp-id').value.toLowerCase();
    const p = document.getElementById('inp-pass').value;
    if (DB[u] && DB[u].pass === p) {
        document.getElementById('u-lvl-display').innerText = DB[u].lvl;
        document.getElementById('p-name').innerText = DB[u].name;
        document.getElementById('p-token').innerText = DB[u].token;
        document.getElementById('p-lvl').innerText = "L" + DB[u].lvl;
        transitionToScreen('scr-dash');
    } else {
        alert("ОШИБКА: ДОСТУП ЗАПРЕЩЕН");
    }
}

function handleTerminalCommand(e) {
    if (e.key === 'Enter') {
        const out = document.getElementById('terminal-out');
        const val = e.target.value;
        if (!val) return;

        const line = document.createElement('div');
        line.innerHTML = `<span style="color:#a855f7">></span> ${val}`;
        out.appendChild(line);
        
        const res = document.createElement('div');
        res.style.color = "#666";
        res.style.marginBottom = "15px";
        
        if(val.toLowerCase() === 'help') {
            res.innerText = "Available: STATUS, CLEAR, EXIT, WHOAMI";
        } else if(val.toLowerCase() === 'clear') {
            out.innerHTML = "";
            e.target.value = "";
            return;
        } else {
            res.innerText = `System: command '${val}' not found in core modules.`;
        }
        
        out.appendChild(res);
        e.target.value = "";
        out.scrollTop = out.scrollHeight;
    }
}

function toggleSidebar(state) {
    document.getElementById('sidebar').classList.toggle('open', state);
    document.getElementById('side-overlay').style.display = state ? 'block' : 'none';
}

function openProfile() {
    document.getElementById('modal-profile').classList.remove('hidden');
    toggleSidebar(false);
}

function closeProfile() {
    document.getElementById('modal-profile').classList.add('hidden');
}

// РЕЖИМ ГОСТЯ: ЖИВЫЕ ЛОГИ
setInterval(() => {
    const con = document.getElementById('guest-console');
    if (con && !document.getElementById('scr-guest').classList.contains('hidden')) {
        const d = document.createElement('div');
        d.innerText = `[${new Date().toLocaleTimeString()}] PING_NODE_${Math.floor(Math.random()*999)} ... OK`;
        con.prepend(d);
        if (con.childNodes.length > 20) con.lastChild.remove();
    }
}, 1500);

// ЧАСЫ
setInterval(() => {
    const t = new Date().toLocaleTimeString();
    if(document.getElementById('clock')) document.getElementById('clock').innerText = t;
    if(document.getElementById('radar-clock')) document.getElementById('radar-clock').innerText = t;
}, 1000);
