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

const fadeOverlay = document.getElementById('fade-overlay');
const sidePanel = document.getElementById('side-panel');

// Запуск
async function init() {
    const logo = document.getElementById('big-logo');
    for (let char of voltaLogo) {
        logo.textContent += char;
        await new Promise(r => setTimeout(r, 2));
    }
    await new Promise(r => setTimeout(r, 2000));
    openWindow('login-screen');
}

function openWindow(id) {
    fadeOverlay.classList.add('fade-active');
    // Скрываем плашку при смене окон, чтобы не мешала
    sidePanel.classList.remove('active');
    
    setTimeout(() => {
        document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        fadeOverlay.classList.remove('fade-active');
        
        if(id === 'login-screen') startLogin();
        if(id === 'full-console-screen') document.getElementById('main-console-input').focus();
    }, 600);
}

// Логика входа
const cmdInput = document.getElementById('cmd');
let stage = "ID", activeUser = null;

cmdInput.onkeydown = async (e) => {
    if (e.key === "Enter") {
        let val = cmdInput.value.trim().toLowerCase();
        cmdInput.value = "";
        if (stage === "ID" && PROFILES[val]) {
            activeUser = PROFILES[val];
            stage = "PASS";
            printAuth(`> ID [${val.toUpperCase()}] ПОДТВЕРЖДЕН. ПАРОЛЬ:`);
        } else if (stage === "PASS" && val === activeUser.pass) {
            document.getElementById('user-display').textContent = activeUser.name;
            openWindow('main-dashboard');
        }
    }
}

function printAuth(txt) {
    const d = document.createElement('div');
    d.textContent = txt;
    document.getElementById('auth-output').appendChild(d);
}

// ЛОГИКА БОЛЬШОЙ КОНСОЛИ (EXIT)
const mainConsoleInput = document.getElementById('main-console-input');
const mainConsoleOutput = document.getElementById('main-console-output');

mainConsoleInput.onkeydown = (e) => {
    if (e.key === "Enter") {
        let cmd = mainConsoleInput.value.trim().toLowerCase();
        mainConsoleInput.value = "";
        
        if (cmd === "exit") {
            openWindow('main-dashboard');
        } else {
            let d = document.createElement('div');
            d.textContent = `> ВЫ ВВЕЛИ: ${cmd}. КОМАНДА В РАЗРАБОТКЕ.`;
            mainConsoleOutput.appendChild(d);
        }
    }
}

// Сайдбар
document.getElementById('menu-trigger').onclick = () => {
    sidePanel.classList.toggle('active');
    document.getElementById('panel-blur-overlay').style.display = sidePanel.classList.contains('active') ? "block" : "none";
};

window.onload = init;
