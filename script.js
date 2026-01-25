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

async function boot() {
    const logo = document.getElementById('big-logo');
    for (let char of voltaLogo) {
        logo.textContent += char;
        await new Promise(r => setTimeout(r, 2));
    }
    await new Promise(r => setTimeout(r, 1500));
    openWindow('login-screen');
}

function openWindow(id) {
    document.getElementById('fade-overlay').classList.add('fade-active');
    // Скрываем плашку при любом переходе
    document.getElementById('side-panel').classList.remove('active');
    document.getElementById('panel-blur-overlay').style.display = "none";

    setTimeout(() => {
        document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        document.getElementById('fade-overlay').classList.remove('fade-active');

        if (id === 'login-screen') startLoginAuth();
        if (id === 'full-console-screen') document.getElementById('main-console-input').focus();
    }, 600);
}

// Авторизация
const cmdIn = document.getElementById('cmd');
let stage = "ID", user = null;

async function startLoginAuth() {
    const out = document.getElementById('auth-output');
    out.innerHTML = "> ВВЕДИТЕ ИДЕНТИФИКАТОР:";
    document.getElementById('input-line').classList.remove('hidden');
    cmdIn.focus();
}

cmdIn.onkeydown = (e) => {
    if (e.key === "Enter") {
        let val = cmdIn.value.trim().toLowerCase();
        cmdIn.value = "";
        if (stage === "ID" && PROFILES[val]) {
            user = PROFILES[val];
            stage = "PASS";
            document.getElementById('auth-output').innerHTML += `<br>> ID [${val.toUpperCase()}] ПРИНЯТ. ПАРОЛЬ:`;
        } else if (stage === "PASS" && val === user.pass) {
            document.getElementById('user-display').textContent = user.name;
            openWindow('main-dashboard');
        }
    }
};

// Большая консоль
const mainIn = document.getElementById('main-console-input');
mainIn.onkeydown = (e) => {
    if (e.key === "Enter") {
        let val = mainIn.value.trim().toLowerCase();
        mainIn.value = "";
        if (val === "exit") openWindow('main-dashboard');
        else {
            const d = document.createElement('div');
            d.textContent = `> ${val}: команда не найдена.`;
            document.getElementById('main-console-output').appendChild(d);
        }
    }
};

// Плашка и Блюр
document.getElementById('menu-trigger').onclick = (e) => {
    e.stopPropagation();
    document.getElementById('side-panel').classList.add('active');
    document.getElementById('panel-blur-overlay').style.display = "block";
};

document.getElementById('panel-blur-overlay').onclick = () => {
    document.getElementById('side-panel').classList.remove('active');
    document.getElementById('panel-blur-overlay').style.display = "none";
};

// Время для логов
setInterval(() => {
    const now = new Date().toLocaleTimeString();
    document.querySelectorAll('.time-now').forEach(el => el.textContent = now);
}, 1000);

window.onload = boot;
