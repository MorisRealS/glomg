const PROFILES = {
    "morisreal": { pass: "1111", name: "MORIS REAL" },
    "kiddy": { pass: "2222", name: "KIDDY" },
    "dykzxz": { pass: "3333", name: "DYKZXZ" },
    "msk4ne_": { pass: "4444", name: "MSK4NE" }
};

// Инициализация
async function startSystem() {
    const logoEl = document.getElementById('big-logo');
    const logoTxt = `
 ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ `;

    for (let char of logoTxt) {
        logoEl.textContent += char;
        await new Promise(r => setTimeout(r, 1));
    }
    setTimeout(() => openWindow('login-screen'), 1500);
}

function openWindow(id) {
    document.getElementById('fade-overlay').classList.add('fade-active');
    
    // Закрываем меню если открыто
    document.getElementById('side-panel').classList.remove('active');
    document.getElementById('panel-blur-overlay').style.display = "none";

    setTimeout(() => {
        document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        document.getElementById('fade-overlay').classList.remove('fade-active');

        if (id === 'login-screen') startLogin();
    }, 500);
}

// Логика логина
const cmdInput = document.getElementById('cmd');
let stage = "ID", user = null;

function startLogin() {
    document.getElementById('auth-output').innerHTML = "> ВВЕДИТЕ ID:";
    document.getElementById('input-line').classList.remove('hidden');
    cmdInput.focus();
}

cmdInput.onkeydown = (e) => {
    if (e.key === "Enter") {
        let v = cmdInput.value.trim().toLowerCase();
        cmdInput.value = "";
        if (stage === "ID" && PROFILES[v]) {
            user = PROFILES[v]; stage = "PASS";
            document.getElementById('auth-output').innerHTML += `<br>> ID ПРИНЯТ. ПАРОЛЬ:`;
        } else if (stage === "PASS" && v === user.pass) {
            document.getElementById("user-display").textContent = user.name;
            openWindow('main-dashboard');
        }
    }
}

// Сайдбар
document.getElementById('menu-trigger').onclick = (e) => {
    e.stopPropagation();
    document.getElementById('side-panel').classList.add('active');
    document.getElementById('panel-blur-overlay').style.display = "block";
};

document.getElementById('panel-blur-overlay').onclick = () => {
    document.getElementById('side-panel').classList.remove('active');
    document.getElementById('panel-blur-overlay').style.display = "none";
};

window.onload = startSystem;
