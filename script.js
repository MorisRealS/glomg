// Твой старый объект профилей (оставил как был)
const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: "A1", token: "KID" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: "B3", token: "DYK" },
    "msk4ne_":  { name: "MSK4NE", pass: "3333", level: "S-Class", token: "MSK" },
    "sumber":   { name: "Sumber", pass: "0000", level: "Admin", token: "SBR" },
    "morisreal": { name: "МОРИС", pass: "123", level: "L4", token: "MRS" }
};

let currentUser = null;

function processLogin() {
    const u = document.getElementById('inp-id').value.toLowerCase();
    const p = document.getElementById('inp-pass').value;

    if (PROFILES[u] && PROFILES[u].pass === p) {
        currentUser = PROFILES[u];
        // Заполняем личное дело
        document.getElementById('p-name').innerText = currentUser.name;
        document.getElementById('p-token').innerText = currentUser.token || "UNK";
        document.getElementById('p-lvl-val').innerText = currentUser.level;
        document.getElementById('u-lvl-display').innerText = currentUser.level;
        
        transitionToScreen('scr-dash');
    } else {
        alert("ACCESS_DENIED: Invalid Credentials");
    }
}

// НОВАЯ КОНСОЛЬ (Чистая, без root@glomg)
function handleTerminalCommand(e) {
    if (e.key === 'Enter') {
        const out = document.getElementById('terminal-out');
        const val = e.target.value;
        if (!val) return;

        const line = document.createElement('div');
        line.innerHTML = `<span class="prompt">></span> ${val}`;
        out.appendChild(line);
        
        const res = document.createElement('div');
        res.style.color = "#666";
        res.style.marginBottom = "15px";
        res.innerText = `System: command '${val}' not found in core modules.`;
        
        out.appendChild(res);
        e.target.value = "";
        out.scrollTop = out.scrollHeight;
    }
}

// УПРАВЛЕНИЕ ОКНОМ ПРОФИЛЯ
function openProfile() {
    if(!currentUser) { alert("Сначала авторизуйтесь!"); return; }
    document.getElementById('modal-profile').classList.remove('hidden');
    toggleSidebar(false);
}

function closeProfile() {
    document.getElementById('modal-profile').classList.add('hidden');
}

function toggleSidebar(s) {
    document.getElementById('sidebar').classList.toggle('open', s);
    document.getElementById('side-overlay').style.display = s ? 'block' : 'none';
}

// Таймер для часов
setInterval(() => {
    const t = new Date().toLocaleTimeString();
    if(document.getElementById('clock')) document.getElementById('clock').innerText = t;
}, 1000);
