const DB = {
    "morisreal": { pass: "morisreal_profile_console", lvl: 6, rank: "CHIEF OPERATOR", title: "МОЯ ЛАБОРАТОРИЯ" },
    "sumber": { pass: "SumberTheAdminPRISMS", lvl: 5, rank: "PRISMA OWNER", title: "БУНКЕР ПРИЗМЫ" },
    "dykzxz": { pass: "DykProfileConsoleONG", lvl: 4, rank: "REACTOR ENG", title: "МОЙ РЕАКТОР" }
};

let activeUser = null;

// ИНТРО
window.onload = () => {
    const pre = document.getElementById('intro-ascii');
    const txt = "G.L.O.M.G. v28.2_STABLE\nLOADING_CORE_SYSTEMS...\nESTABLISHING_ENCRYPTED_TUNNEL...\nSYSTEM_READY.";
    let i = 0;
    let t = setInterval(() => {
        pre.textContent += txt[i]; i++;
        if(i >= txt.length) { 
            clearInterval(t); 
            document.getElementById('intro-logo').classList.remove('hidden');
            setTimeout(() => transition('scr-login'), 2500);
        }
    }, 45);
};

// ПЕРЕХОДЫ МЕЖДУ СТРАНИЦАМИ
function transition(id) {
    document.getElementById('fade').classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        document.getElementById('fade').classList.remove('active');
        side(false); // Закрываем меню при переходе
    }, 450);
}

// АВТОРИЗАЦИЯ
function auth() {
    const id = document.getElementById('inp-id').value.toLowerCase();
    const ps = document.getElementById('inp-pass').value;
    if(DB[id] && DB[id].pass === ps) {
        activeUser = { id, ...DB[id] };
        document.getElementById('u-lvl-display').textContent = activeUser.lvl;
        document.getElementById('welcome-msg').textContent = `WELCOME, ${id.toUpperCase()}`;
        document.getElementById('prof-info').innerHTML = `ID: ${id.toUpperCase()}<br>LEVEL: ${activeUser.lvl}<br>POSITION: ${activeUser.rank}`;
        transition('scr-dash');
    } else {
        alert("ACCESS_DENIED: INVALID_CREDENTIALS");
    }
}

// ГОСТЬ
function goGuest() {
    activeUser = null;
    transition('scr-guest');
    const con = document.getElementById('guest-console');
    const logs = ["> PING node_1... OK", "> DB_SYNC... 100%", "> TEMP_CHECK... NORMAL", "> RADIATION_LEVEL... 0.04mSv", "> CORE_STATUS... IDLE", "> SCANNING... NO_THREATS"];
    setInterval(() => {
        const d = document.createElement('div');
        d.textContent = `[${new Date().toLocaleTimeString()}] ${logs[Math.floor(Math.random()*logs.length)]}`;
        con.prepend(d);
        if(con.childNodes.length > 18) con.lastChild.remove(); // Заполнение всей консоли
    }, 1600);
}

// РАДАР
function goMap() {
    transition('scr-map');
    const box = document.getElementById('radar-nodes'); box.innerHTML = "";
    const nodes = [ {x:50,y:50,o:"morisreal",t:"owner"}, {x:35,y:45,o:"sumber",t:"online"}, {x:75,y:65,o:"dykzxz",t:"broken"} ];
    nodes.forEach(n => {
        const dot = document.createElement('div');
        dot.className = `node ${n.t}`;
        dot.style.left = n.x + "%"; dot.style.top = n.y + "%";
        dot.onclick = () => {
            document.getElementById('radar-popup').classList.remove('hidden');
            document.getElementById('p-title').textContent = n.o.toUpperCase();
            document.getElementById('p-text').textContent = (n.o === activeUser.id) ? DB[n.o].title : `DATA_ACCESS: RESTRICTED | RANK: ${DB[n.o].rank}`;
        };
        box.appendChild(dot);
    });
}

// САЙДБАР
function side(st) {
    document.getElementById('sidebar').classList.toggle('open', st);
    document.getElementById('side-overlay').style.display = st ? 'block' : 'none';
}

// МОДАЛКИ
function modal(id, st) {
    document.getElementById(id).classList.toggle('hidden', !st);
}

// КОНСОЛЬ
function handleCmd(e) {
    if(e.key === 'Enter') {
        const out = document.getElementById('terminal-out');
        const cmd = e.target.value;
        const d = document.createElement('div');
        d.textContent = `> root@glomg:~# ${cmd}`;
        out.appendChild(d);
        
        const res = document.createElement('div');
        res.style.color = "#888";
        res.textContent = `System: command '${cmd}' not found in core modules.`;
        out.appendChild(res);
        
        e.target.value = "";
        out.scrollTop = out.scrollHeight;
    }
}

setInterval(() => {
    const c = document.getElementById('clock');
    if(c) c.textContent = new Date().toLocaleTimeString();
}, 1000);
