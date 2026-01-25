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

// 3. ЛОГО НА ВЕСЬ ЭКРАН СНАЧАЛА
async function runIntro() {
    const logoContainer = document.getElementById('big-logo');
    // Посимвольная печать лого
    for (let char of voltaLogo) {
        logoContainer.textContent += char;
        await new Promise(r => setTimeout(r, 2));
    }
    await new Promise(r => setTimeout(r, 2000));
    
    // Гасим лого и открываем консоль
    document.getElementById('intro-screen').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('intro-screen').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
        startConsole();
    }, 1000);
}

async function typeOutput(text, speed = 30) {
    const line = document.createElement('div');
    output.appendChild(line);
    for (let char of text) {
        line.textContent += char;
        await new Promise(r => setTimeout(r, speed));
    }
}

async function startConsole() {
    await typeOutput("> VOLTA KERNEL BOOT SUCCESS...", 20);
    await typeOutput("> CONNECTING TO ONG_CORE...", 40);
    await typeOutput("> PLEASE IDENTIFY YOURSELF:", 20);
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
                await typeOutput(`> ID [${val.toUpperCase()}] ACCEPTED.`, 20);
                await typeOutput("> ENTER PASSCODE:", 20);
                cmdInput.type = "password";
                stage = "PASS";
            } else { await typeOutput("> ERROR: ACCESS DENIED.", 20); }
        } else if (stage === "PASS") {
            if (val === user.pass) {
                await typeOutput("> AUTHORIZED. LOADING CORE INTERFACE...", 20);
                setTimeout(showDashboard, 1000);
            } else { location.reload(); }
        }
    }
});

function showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-dashboard').classList.remove('hidden');
    document.getElementById('user-display').textContent = user.name;
    // Глитч при переходе
    const g = document.getElementById('glitch-layer');
    g.classList.add('glitch-active');
    setTimeout(() => g.classList.remove('glitch-active'), 400);
}

// Запуск
window.onload = runIntro;

// Сайдбар
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
