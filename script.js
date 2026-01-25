const PROFILES = {
    "morisreal": { pass: "1111", name: "MORIS REAL" },
    "kiddy": { pass: "2222", name: "KIDDY" },
    "dykzxz": { pass: "3333", name: "DYKZXZ" },
    "msk4ne_": { pass: "4444", name: "MSK4NE" }
};

async function init() {
    const el = document.getElementById('big-logo');
    const txt = `
 ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ `;

    for (let c of txt) { el.textContent += c; await new Promise(r => setTimeout(r, 1)); }
    setTimeout(() => openWindow('login-screen'), 1200);
}

function openWindow(id) {
    document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');

    // Если мы в главном меню — разрешаем плашку
    if (id === 'main-dashboard') {
        document.getElementById('side-panel').classList.remove('side-hidden');
    }

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
            user = PROFILES[v]; stage = "PASS";
            out.innerHTML += `<br>> ID [${v.toUpperCase()}] ПРИНЯТ. ВВЕДИТЕ ПАРОЛЬ:`;
        } else if (stage === "PASS" && v === user.pass) {
            document.getElementById('user-display').textContent = user.name;
            openWindow('main-dashboard');
        } else if (v !== "") {
            out.innerHTML += `<br>> ОШИБКА: ОТКАЗАНО В ДОСТУПЕ.`;
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

window.onload = init;
