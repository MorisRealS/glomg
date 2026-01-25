const PROFILES = {
    "morisreal": { pass: "1111", name: "MORIS REAL" },
    "kiddy": { pass: "2222", name: "KIDDY" },
    "dykzxz": { pass: "3333", name: "DYKZXZ" },
    "msk4ne_": { pass: "4444", name: "MSK4NE" }
};

const voltaLogo = `
 ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ `;

const authOutput = document.getElementById('auth-output');
const cmdInput = document.getElementById('cmd');
const fadeOverlay = document.getElementById('fade-overlay');

// 1. Плавный запуск (Лого -> Консоль)
async function bootSystem() {
    const logoPre = document.getElementById('big-logo');
    for (let char of voltaLogo) {
        logoPre.textContent += char;
        await new Promise(r => setTimeout(r, 2));
    }
    await new Promise(r => setTimeout(r, 1800));
    openWindow('login-screen');
}

// 2. Глобальная функция смены окон
function openWindow(id) {
    fadeOverlay.classList.add('fade-active');
    setTimeout(() => {
        // Прячем всё
        document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
        // Показываем нужное
        document.getElementById(id).classList.remove('hidden');
        fadeOverlay.classList.remove('fade-active');
        
        if (id === 'login-screen') runAuthText();
        if (id === 'full-console-screen') document.getElementById('main-console-input').focus();
    }, 800);
}

async function runAuthText() {
    authOutput.innerHTML = "";
    const lines = ["> ИНИЦИАЛИЗАЦИЯ ЯДРА VOLTA...", "> СТАТУС: СОЕДИНЕНИЕ УСТАНОВЛЕНО", "> ВВЕДИТЕ ИДЕНТИФИКАТОР:"];
    for (let l of lines) {
        let div = document.createElement('div');
        authOutput.appendChild(div);
        for(let c of l) { div.textContent += c; await new Promise(r => setTimeout(r, 20)); }
    }
    document.getElementById('input-line').classList.remove('hidden');
    cmdInput.focus();
}

let stage = "ID", activeUser = null;

cmdInput.onkeydown = async (e) => {
    if (e.key === "Enter") {
        let val = cmdInput.value.trim().toLowerCase();
        cmdInput.value = "";
        if (stage === "ID") {
            if (PROFILES[val]) {
                activeUser = PROFILES[val];
                stage = "PASS";
                let d = document.createElement('div');
                d.textContent = `> ID: ${val.toUpperCase()} ПОДТВЕРЖДЕН. ПАРОЛЬ:`;
                authOutput.appendChild(d);
            }
        } else if (stage === "PASS") {
            if (val === activeUser.pass) {
                document.getElementById('user-display').textContent = activeUser.name;
                openWindow('main-dashboard');
            } else { location.reload(); }
        }
    }
};

// Сайдбар (Плашка)
const trigger = document.getElementById('menu-trigger');
const panel = document.getElementById('side-panel');
const blur = document.getElementById('panel-blur-overlay');

trigger.onclick = () => {
    panel.classList.add('active');
    blur.style.display = "block";
};
blur.onclick = () => {
    panel.classList.remove('active');
    blur.style.display = "none";
};

window.onload = bootSystem;
