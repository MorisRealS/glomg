const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: "A1", token: "KID" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: "B3", token: "DYK" },
    "msk4ne_":  { name: "MSK4NE", pass: "3333", level: "S-Class", token: "MSK" },
    "sumber":   { name: "Sumber", pass: "0000", level: "Admin", token: "SBR" },
    "krimpi":   { name: "Krimpi", pass: "5555", level: "Guest", token: "KRM" },
    "morisreal": { name: "МОРИС", pass: "123", level: "L4", token: "MRS" }
};

let step = "ID"; 
let tempUser = null;

const output = document.getElementById('output');
const inpId = document.getElementById('inp-id');
const inpPass = document.getElementById('inp-pass');
const dashScreen = document.getElementById('scr-dash');
const loginScreen = document.getElementById('scr-login');

function print(text, color = "") {
    if (!output) return;
    const div = document.createElement('div');
    if (color) div.style.color = color;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

function processLogin() {
    const idVal = inpId.value.trim().toLowerCase();
    const passVal = inpPass.value;

    if (PROFILES[idVal]) {
        if (PROFILES[idVal].pass === passVal) {
            tempUser = PROFILES[idVal];
            print("> ACCESS_GRANTED", "#00ff44");
            
            // Загружаем данные в профиль
            document.getElementById('p-name-val').innerText = tempUser.name;
            document.getElementById('p-lvl-val').innerText = tempUser.level;
            document.getElementById('p-token-val').innerText = tempUser.token || "UNK";
            document.getElementById('u-lvl-display').innerText = tempUser.level;

            startTransition();
        } else {
            print("> ERROR: INVALID_KEY", "#ff2233");
        }
    } else {
        print("> ERROR: ID_NOT_FOUND", "#ff2233");
    }
}

function startTransition() {
    document.getElementById('fade').classList.add('active');
    setTimeout(() => {
        loginScreen.classList.add('hidden');
        dashScreen.classList.remove('hidden');
        document.getElementById('fade').classList.remove('active');
    }, 600);
}

function transitionToScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function toggleSidebar(state) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('side-overlay');
    if (state) {
        sidebar.classList.add('open');
        overlay.style.display = 'block';
    } else {
        sidebar.classList.remove('open');
        overlay.style.display = 'none';
    }
}

function openProfile() {
    document.getElementById('modal-profile').classList.remove('hidden');
    toggleSidebar(false);
}

function closeProfile() {
    document.getElementById('modal-profile').classList.add('hidden');
}

function handleTerminalCommand(event) {
    if (event.key === "Enter") {
        const input = document.getElementById('terminal-input');
        const out = document.getElementById('terminal-out');
        const cmd = input.value;
        
        const line = document.createElement('div');
        line.innerHTML = `<span style="color:var(--purple)">></span> ${cmd}`;
        out.appendChild(line);
        
        input.value = "";
        out.scrollTop = out.scrollHeight;
    }
}

// Часы
setInterval(() => {
    const now = new Date();
    const time = now.toLocaleTimeString();
    if(document.getElementById('clock')) document.getElementById('clock').innerText = time;
    if(document.getElementById('radar-clock')) document.getElementById('radar-clock').innerText = time;
}, 1000);

// Интро
window.onload = () => {
    setTimeout(() => {
        document.getElementById('scr-intro').classList.add('hidden');
        document.getElementById('scr-login').classList.remove('hidden');
    }, 2500);
};

// Радар (Заглушка логики)
function initializeTacticalRadar() {
    transitionToScreen('scr-map');
}
