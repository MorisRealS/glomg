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

// 1. Плавный запуск Лого
async function runIntro() {
    const container = document.getElementById('big-logo');
    for (let char of voltaLogo) {
        container.textContent += char;
        await new Promise(r => setTimeout(r, 2));
    }
    await new Promise(r => setTimeout(r, 2000));
    openWindow('login-screen');
}

// 2. Универсальная функция переключения окон
function openWindow(windowId) {
    fadeOverlay.classList.add('fade-active');
    setTimeout(() => {
        // Скрываем все окна
        document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
        // Показываем нужное
        document.getElementById(windowId).classList.remove('hidden');
        fadeOverlay.classList.remove('fade-active');
        
        if (windowId === 'login-screen') startAuth();
    }, 800);
}

async function startAuth() {
    authOutput.innerHTML = "";
    const lines = ["> VOLTA_OS v4.0", "> ПРОВЕРКА ИДЕНТИФИКАТОРА:"];
    for (let l of lines) {
        const d = document.createElement('div');
        authOutput.appendChild(d);
        for(let c of l) { d.textContent += c; await new Promise(r => setTimeout(r, 20)); }
    }
    document.getElementById('input-line').classList.remove('hidden');
    cmdInput.focus();
}

let stage = "ID", user = null;

cmdInput.onkeydown = async (e) => {
    if (e.key === "Enter") {
        let val = cmdInput.value.trim().toLowerCase();
        cmdInput.value = "";
        if (stage === "ID") {
            if (PROFILES[val]) {
                user = PROFILES[val];
                stage = "PASS";
                const d = document.createElement('div');
                authOutput.appendChild(d);
                d.textContent = `> ID [${val.toUpperCase()}] ACCEPTED. ВВЕДИТЕ ПАРОЛЬ:`;
            }
        } else if (stage === "PASS") {
            if (val === user.pass) {
                document.getElementById('user-display').textContent = user.name;
                openWindow('main-dashboard');
            } else { location.reload(); }
        }
    }
};

// Сайдбар
const trigger = document.getElementById('menu-trigger');
const panel = document.getElementById('side-panel');
const blur = document.getElementById('panel-blur');

trigger.onclick = () => {
    panel.classList.add('active');
    blur.style.display = "block";
};
blur.onclick = () => {
    panel.classList.remove('active');
    blur.style.display = "none";
};

window.onload = runIntro;
