const PROFILES = {
    "morisreal": { pass: "morisreal_profile_console", name: "MORIS REAL", lvl: 6 },
    "kiddy": { pass: "kiddy_profile_console", name: "KIDDY", lvl: 4 },
    "dykzxz": { pass: "dykzxz_profile_console", name: "DYKZXZ", lvl: 4 },
    "msk4ne_": { pass: "msk4ne_profile_console", name: "MSK4NE", lvl: 4 }
};

const hints = ["пссс", "ты можешь написать просто lobby", "попробуй"];

async function runHints() {
    const box = document.getElementById('hint-box');
    for (let text of hints) {
        await new Promise(r => setTimeout(r, 2500));
        box.textContent = text;
        box.style.opacity = "1";
        await new Promise(r => setTimeout(r, 2000));
        box.style.opacity = "0";
    }
}

function openWindow(id) {
    document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    document.getElementById('side-panel').classList.remove('active');
    document.getElementById('blur-overlay').style.display = "none";

    if (id === 'main-dashboard' || id === 'lobby-screen') {
        document.getElementById('side-panel').classList.remove('side-hidden');
    }

    if (id === 'login-screen') {
        stage = "ID";
        document.getElementById('auth-output').innerHTML = "> SYSTEM_ONLINE... ВВЕДИТЕ ID:";
        document.getElementById('cmd').focus();
        runHints();
    }
}

let stage = "ID", user = null;

document.getElementById('cmd').onkeydown = (e) => {
    if (e.key === "Enter") {
        let v = e.target.value.trim().toLowerCase();
        e.target.value = "";
        const out = document.getElementById('auth-output');

        if (v === "lobby") {
            openWindow('lobby-screen');
            return;
        }

        if (stage === "ID" && PROFILES[v]) {
            user = PROFILES[v]; 
            stage = "PASS";
            out.innerHTML += `<br>> ID [${v.toUpperCase()}] ПРИНЯТ. LVL: ${user.lvl}. ВВЕДИТЕ ПАРОЛЬ:`;
        } else if (stage === "PASS" && v === user.pass) {
            document.getElementById('user-display').textContent = user.name;
            document.getElementById('user-lvl-tag').textContent = `ACCESS LEVEL: ${user.lvl}`;
            document.getElementById('status-lvl-display').textContent = `ТЕКУЩИЙ УРОВЕНЬ ДОСТУПА: ${user.lvl}`;
            openWindow('main-dashboard');
        } else if (v !== "") {
            out.innerHTML += `<br>> ОШИБКА: ДОСТУП ЗАПРЕЩЕН.`;
        }
    }
};

// Меню
document.getElementById('menu-trigger').onclick = () => {
    document.getElementById('side-panel').classList.add('active');
    document.getElementById('blur-overlay').style.display = "block";
};
document.getElementById('blur-overlay').onclick = () => {
    document.getElementById('side-panel').classList.remove('active');
    document.getElementById('blur-overlay').style.display = "none";
};

// Логотип
const logo = `
 ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ `;

window.onload = async () => {
    const el = document.getElementById('big-logo');
    for (let c of logo) { el.textContent += c; await new Promise(r => setTimeout(r, 1)); }
    setTimeout(() => openWindow('login-screen'), 1500);
};
