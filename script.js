const PROFILES = {
    "morisreal": { pass: "morisreal_profile_console", name: "MORIS REAL", lvl: 6 },
    "kiddy": { pass: "kiddy_profile_console", name: "KIDDY", lvl: 4 },
    "dykzxz": { pass: "dykzxz_profile_console", name: "DYKZXZ", lvl: 4 },
    "msk4ne_": { pass: "msk4ne_profile_console", name: "MSK4NE", lvl: 4 }
};

// Эффект "Лютого кода" (Матрица)
function runMatrixEffect(callback) {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    canvas.classList.remove('hidden');
    canvas.classList.add('active');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}/\\|#@$%^&*";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const interval = setInterval(() => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#a855f7";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }, 33);

    setTimeout(() => {
        clearInterval(interval);
        canvas.classList.remove('active');
        setTimeout(() => { canvas.classList.add('hidden'); if(callback) callback(); }, 500);
    }, 1500); // Длительность эффекта 1.5 сек
}

function openWindow(id) {
    document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if (id === 'main-dashboard' || id === 'lobby-screen') document.getElementById('side-panel').classList.remove('side-hidden');
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Логин через графическое окно (Lobby)
function handleGUILogin() {
    const u = document.getElementById('gui-user').value.toLowerCase();
    const p = document.getElementById('gui-pass').value;
    if (PROFILES[u] && PROFILES[u].pass === p) {
        runMatrixEffect(() => {
            const user = PROFILES[u];
            document.getElementById('user-display').textContent = user.name;
            document.getElementById('user-lvl-tag').textContent = `ACCESS LVL: ${user.lvl}`;
            openWindow('main-dashboard');
        });
    } else {
        alert("ОШИБКА ДОСТУПА: НЕВЕРНЫЕ ДАННЫЕ");
    }
}

// Консоль
document.getElementById('cmd').onkeydown = (e) => {
    if (e.key === "Enter") {
        let v = e.target.value.trim().toLowerCase();
        e.target.value = "";
        if (v === "lobby") {
            runMatrixEffect(() => openWindow('lobby-screen'));
        } else {
            document.getElementById('auth-output').innerHTML += `<br>> [${v}] - КОМАНДА НЕ НАЙДЕНА. ПОПРОБУЙТЕ 'LOBBY'`;
        }
    }
};

window.onload = () => {
    const logo = document.getElementById('big-logo');
    const text = `
 ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ `;
    let i = 0;
    const type = () => { if(i < text.length) { logo.textContent += text[i++]; setTimeout(type, 1); } else {
        setTimeout(() => { openWindow('login-screen'); document.getElementById('auth-output').innerHTML = "> СИСТЕМА ГОТОВА. ВВЕДИТЕ КОМАНДУ:"; }, 1000);
    }};
    type();
};
