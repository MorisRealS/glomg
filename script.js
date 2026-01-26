const DB = {
    "morisreal": { pass: "morisreal_profile_console", lvl: 6, rank: "CHIEF OPERATOR", title: "ЛАБОРАТОРИЯ" },
    "sumber": { pass: "SumberTheAdminPRISMS", lvl: 5, rank: "PRISMA OWNER", title: "ПРИЗМА" }
};

let session = null;

function transitionToScreen(id) {
    const f = document.getElementById('fade');
    f.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        toggleSidebar(false);
        f.classList.remove('active');
    }, 500);
}

function processLogin() {
    const u = document.getElementById('inp-id').value.toLowerCase();
    const p = document.getElementById('inp-pass').value;
    if (DB[u] && DB[u].pass === p) {
        session = { id: u, ...DB[u] };
        document.getElementById('u-lvl-display').textContent = session.lvl;
        document.getElementById('welcome-msg').textContent = "WELCOME, " + u.toUpperCase();
        transitionToScreen('scr-dash');
    } else { alert("DENIED"); }
}

function initializeTacticalRadar() {
    transitionToScreen('scr-map');
    const nodes = document.getElementById('radar-nodes');
    nodes.innerHTML = "";
    const pts = [{x:50,y:50,o:"morisreal",t:"owner"}, {x:30,y:40,o:"sumber",t:"online"}];
    pts.forEach(p => {
        const d = document.createElement('div');
        d.className = "node " + p.t;
        d.style.left = p.x + "%"; d.style.top = p.y + "%";
        d.onclick = () => {
            document.getElementById('p-title').textContent = p.o.toUpperCase();
            document.getElementById('p-text').textContent = "COORDINATES: " + p.x + "," + p.y;
            document.getElementById('radar-scroll').scrollTo({ top: 500, behavior: 'smooth' });
        };
        nodes.appendChild(d);
    });
}

function toggleSidebar(st) {
    document.getElementById('sidebar').classList.toggle('open', st);
    document.getElementById('side-overlay').style.display = st ? 'block' : 'none';
}

function handleTerminalCommand(e) {
    if (e.key === 'Enter') {
        const out = document.getElementById('terminal-out');
        const l = document.createElement('div');
        l.textContent = "> " + e.target.value;
        out.appendChild(l);
        e.target.value = "";
        out.scrollTop = out.scrollHeight;
    }
}

// РАБОТА ГОСТЕВОЙ КОНСОЛИ
setInterval(() => {
    const con = document.getElementById('guest-console');
    if (con && !document.getElementById('scr-guest').classList.contains('hidden')) {
        const d = document.createElement('div');
        d.textContent = "[" + new Date().toLocaleTimeString() + "] SYNCING_NODE_" + Math.floor(Math.random()*999);
        con.prepend(d);
        if (con.childNodes.length > 15) con.lastChild.remove();
    }
}, 2000);

setInterval(() => {
    const t = new Date().toLocaleTimeString();
    if (document.getElementById('clock')) document.getElementById('clock').textContent = t;
    if (document.getElementById('radar-clock')) document.getElementById('radar-clock').textContent = t;
}, 1000);

window.onload = () => {
    const pre = document.getElementById('intro-ascii');
    const msg = "G.L.O.M.G. v30.0\nINITIALIZING...\nREADY.";
    let i = 0;
    const t = setInterval(() => {
        pre.textContent += msg[i]; i++;
        if (i >= msg.length) {
            clearInterval(t);
            document.getElementById('intro-logo').classList.remove('hidden');
            setTimeout(() => transitionToScreen('scr-login'), 2000);
        }
    }, 50);
};
