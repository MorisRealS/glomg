/**
 * ONG_CORE_V4_LEGACY
 * База данных сотрудников
 */
const DATABASE = {
    "morisreal": { pass: "morisreal_profile_console", name: "MORIS REAL", lvl: 6, date: "2026.01.20" },
    "kiddy":     { pass: "kiddy_profile_console",     name: "KIDDY",      lvl: 4, date: "2026.01.22" },
    "dykzxz":    { pass: "dykzxz_profile_console",    name: "DYKZXZ",     lvl: 4, date: "2026.01.24" },
    "msk4ne_":   { pass: "msk4ne_profile_console",    name: "MSK4NE",     lvl: 4, date: "2026.01.25" }
};

/**
 * ГЛОБАЛЬНАЯ НАВИГАЦИЯ С ЭФФЕКТАМИ
 */
function transitionTo(targetWindowId) {
    const overlay = document.getElementById('fade-overlay');
    overlay.classList.add('active'); // Затухание
    
    setTimeout(() => {
        openWindow(targetWindowId);
        // Проявление
        setTimeout(() => overlay.classList.remove('active'), 200);
    }, 800);
}

function openWindow(id) {
    document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    
    // Автоматический фокус для авторизации
    if (id === 'login-screen') {
        document.getElementById('auth-id').focus();
    }
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

/**
 * СИСТЕМА АВТОРИЗАЦИИ
 */
function handleAuth() {
    const inputId = document.getElementById('auth-id').value.trim().toLowerCase();
    const inputPass = document.getElementById('auth-pass').value.trim();

    if (DATABASE[inputId] && DATABASE[inputId].pass === inputPass) {
        // ЭФФЕКТ "ЗАВАЛА КОДА" ПЕРЕД ВХОДОМ
        runMatrixSequence(() => {
            const user = DATABASE[inputId];
            // Заполнение данных профиля
            document.getElementById('display-name').textContent = user.name;
            document.getElementById('display-id').textContent = `ID: ${inputId.toUpperCase()}`;
            document.getElementById('display-lvl').textContent = user.lvl;
            document.getElementById('display-date').textContent = user.date;
            
            transitionTo('main-dashboard');
        });
    } else {
        alert("ACCESS DENIED: INVALID CREDENTIALS");
        document.getElementById('auth-pass').value = "";
    }
}

/**
 * ЭФФЕКТ МАТРИЦЫ (ЗАВАЛ КОДА)
 */
function runMatrixSequence(callback) {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    canvas.classList.remove('hidden');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "0123456789ABCDEF";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#a855f7";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    };

    const interval = setInterval(draw, 30);
    
    // Через 1.5 сек останавливаем и переходим
    setTimeout(() => {
        clearInterval(interval);
        canvas.classList.add('hidden');
        callback();
    }, 1500);
}

/**
 * ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
 */
function updateClock() {
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    const el = document.getElementById('sys-clock');
    if (el) el.textContent = time;
}
setInterval(updateClock, 1000);

// Обработка Enter в полях ввода
document.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        const loginScreen = document.getElementById('login-screen');
        if (!loginScreen.classList.contains('hidden')) {
            handleAuth();
        }
    }
});

/**
 * ЗАПУСК ЛОГОТИПА (ИНТРО)
 */
window.onload = () => {
    const logoEl = document.getElementById('big-logo');
    const asciiLogo = `
 ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ `;

    let charIdx = 0;
    const type = () => {
        if (charIdx < asciiLogo.length) {
            logoEl.textContent += asciiLogo[charIdx++];
            setTimeout(type, 1);
        } else {
            setTimeout(() => transitionTo('login-screen'), 1000);
        }
    };
    type();
};
