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
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ 
      ++ SYSTEM TYPE: VOLTA_OS_v4 ++          `;

const output = document.getElementById('output');
const cmdInput = document.getElementById('cmd');
const fadeOverlay = document.getElementById('fade-overlay');

// 1. ПЕРВЫЙ ЭТАП: ЛОГО
async function runIntro() {
    const logoContainer = document.getElementById('big-logo');
    for (let char of voltaLogo) {
        logoContainer.textContent += char;
        await new Promise(r => setTimeout(r, 2));
    }
    await new Promise(r => setTimeout(r, 1500));
    
    // Мягкий уход в черное перед консолью
    fadeOverlay.classList.add('fade-active');
    setTimeout(() => {
        document.getElementById('intro-screen').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
        fadeOverlay.classList.remove('fade-active');
        startConsole();
    }, 800);
}

async function typeOutput(text, speed = 30) {
    const line = document.createElement('div');
    output.appendChild(line);
    for (let char of text) {
        line.textContent += char;
        await new Promise(r => setTimeout(r, speed));
    }
    output.scrollTop = output.scrollHeight;
}

async function startConsole() {
    await typeOutput("> VOLTA_OS SYSTEM ONLINE...", 20);
    await typeOutput("> IDENTIFICATION REQUIRED:", 30);
    document.getElementById('input-line').classList.remove('hidden');
    cmdInput.focus();
}

let stage = "ID";
let user = null;

cmdInput.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        let val = cmdInput.value.trim().toLowerCase();
        cmdInput.value = "";

        if (stage === "ID") {
            if (PROFILES[val]) {
                user = PROFILES[val];
                await typeOutput(`> ID: ${val.toUpperCase()} ACCEPTED.`, 20);
                await typeOutput("> ENTER PASSCODE:", 20);
                // 2. НЕ используем type="password", чтобы не было окна сохранения пароля
                stage = "PASS";
            } else { await typeOutput("> ERROR: ACCESS DENIED.", 20); }
        } else if (stage === "PASS") {
            if (val === user.pass) {
                await typeOutput("> SUCCESS. LOADING CORE...", 20);
                // 4. Мягкий переход через затемнение
                transitionToDashboard();
            } else { 
                await typeOutput("> FATAL ERROR. REBOOTING...", 10);
                setTimeout(() => location.reload(), 1000); 
            }
        }
    }
});

function transitionToDashboard() {
    fadeOverlay.classList.add('fade-active');
    setTimeout(() => {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-dashboard').classList.remove('hidden');
        document.getElementById('user-display').textContent = user.name;
        fadeOverlay.classList.remove('fade-active');
    }, 800);
}

// Запуск
window.onload = runIntro;

// Сайдбар и Выход
const trigger = document.getElementById('menu-trigger');
const panel = document.getElementById('side-panel');
const blur = document.getElementById('panel-blur');

trigger.onclick = () => {
    panel.classList.toggle('active');
    blur.style.display = panel.classList.contains('active') ? 'block' : 'none';
};
blur.onclick = () => {
    panel.classList.remove('active');
    blur.style.display = 'none';
};
document.getElementById('logout-btn').onclick = () => location.reload();
