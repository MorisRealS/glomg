const PROFILES = {
    "morisreal": { pass: "1111", name: "MORIS REAL" },
    "kiddy": { pass: "2222", name: "KIDDY" },
    "dykzxz": { pass: "3333", name: "DYKZXZ" },
    "msk4ne_": { pass: "4444", name: "MSK4NE" }
};

const logoText = `
 ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ `;

async function init() {
    const el = document.getElementById('big-logo');
    for (let c of logoText) { el.textContent += c; await new Promise(r => setTimeout(r, 1)); }
    setTimeout(() => openWindow('login-screen'), 1800);
}

function openWindow(id) {
    document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(id);
    target.classList.remove('hidden');
    
    // Закрываем меню
    document.getElementById('side-panel').classList.remove('active');
    document.getElementById('blur-overlay').style.display = "none";

    if (id === 'login-screen') {
        document.getElementById('auth-output').innerHTML = "> ИНИЦИАЛИЗАЦИЯ ПОДКЛЮЧЕНИЯ...<br>> СИСТЕМА ГОТОВА.<br>> ВВЕДИТЕ ID ПОЛЬЗОВАТЕЛЯ:";
        document.getElementById('cmd').focus();
    }
}

let stage = "ID", user = null;
document.getElementById('cmd').onkeydown = (e) => {
    if (e.key === "Enter") {
        let v = e.target.value.trim().toLowerCase();
        e.target.value = "";
        const out = document.getElementById('auth-output');
        
        if (stage === "ID" && PROFILES[v]) {
            user = PROFILES[v]; 
            stage = "PASS";
            out.innerHTML += `<br>> ID: ${v.toUpperCase()} ПРИНЯТ. ВВЕДИТЕ ПАРОЛЬ:`;
        } else if (stage === "PASS" && v === user.pass) {
            document.getElementById('user-display').textContent = user.name;
            openWindow('main-dashboard');
        } else if (stage === "ID" && !PROFILES[v]) {
            out.innerHTML += `<br>> ОШИБКА: ID НЕ НАЙДЕН.`;
        }
    }
};

document.getElementById('menu-trigger').onclick = () => {
    document.getElementById('side-panel').classList.add('active');
    document.getElementById('blur-overlay').style.display = "block";
};

document.getElementById('blur-overlay').onclick = () => {
    document.getElementById('side-panel').classList.remove('active');
    document.getElementById('blur-overlay').style.display = "none";
};

window.onload = init;
