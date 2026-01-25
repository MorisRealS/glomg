/**
 * ONG_CORE_V6_STABLE
 * ПОЛНАЯ ВЕРСИЯ БЕЗ СОКРАЩЕНИЙ
 */

const STAFF_DATABASE = {
    "morisreal": { pass: "morisreal_profile_console", name: "MORIS REAL", lvl: 6 },
    "kiddy":     { pass: "kiddy_profile_console",     name: "KIDDY",      lvl: 4 },
    "dykzxz":    { pass: "dykzxz_profile_console",    name: "DYKZXZ",     lvl: 4 },
    "msk4ne_":   { pass: "msk4ne_profile_console",    name: "MSK4NE",     lvl: 4 }
};

/**
 * ГЛОБАЛЬНАЯ ФУНКЦИЯ ПЕРЕХОДА С ЗАТЕМНЕНИЕМ
 */
function transitionTo(targetId) {
    const fade = document.getElementById('fade-overlay');
    
    // Включаем слой затемнения
    fade.classList.add('active');
    
    setTimeout(() => {
        // Скрываем все окна
        const allScreens = document.querySelectorAll('.screen, #intro-screen');
        allScreens.forEach(screen => screen.classList.add('hidden'));
        
        // Показываем целевое окно
        const target = document.getElementById(targetId);
        if (target) target.classList.remove('hidden');
        
        // Закрываем плашку
        closeSidebar();
        
        // Убираем затемнение
        setTimeout(() => {
            fade.classList.remove('active');
        }, 150);
    }, 600); // 600ms соответствует CSS transition
}

/**
 * ОБРАБОТКА ВХОДА
 */
function handleAuth() {
    const idInput = document.getElementById('auth-id');
    const passInput = document.getElementById('auth-pass');
    
    const id = idInput.value.trim().toLowerCase();
    const pass = passInput.value.trim();

    if (STAFF_DATABASE[id] && STAFF_DATABASE[id].pass === pass) {
        // Эффект "завала кода"
        triggerCodeRain(() => {
            const user = STAFF_DATABASE[id];
            
            // Настройка профиля в сайдбаре
            document.getElementById('side-username').textContent = user.name;
            document.getElementById('side-lvl').textContent = `LVL: ${user.lvl}`;
            document.getElementById('side-id').textContent = `ID: ${id.toUpperCase()}`;
            
            transitionTo('main-dashboard');
        });
    } else {
        alert("ОШИБКА: ИДЕНТИФИКАТОР ИЛИ ПАРОЛЬ НЕВЕРНЫ");
        passInput.value = "";
    }
}

/**
 * ЭФФЕКТ МАТРИЦЫ (ЗАВАЛ КОДА)
 */
function triggerCodeRain(callback) {
    const canvas = document.getElementById('matrix-canvas');
    canvas.classList.remove('hidden');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$@%";
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    const draw = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
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

    const matrixInterval = setInterval(draw, 35);

    setTimeout(() => {
        clearInterval(matrixInterval);
        canvas.classList.add('hidden');
        callback();
    }, 1500);
}

/**
 * УПРАВЛЕНИЕ САЙДБАРОМ
 */
function toggleSidebar() {
    const panel = document.getElementById('side-panel');
    const blur = document.getElementById('overlay-blur');
    const isActive = panel.classList.toggle('active');
    blur.style.display = isActive ? "block" : "none";
}

function closeSidebar() {
    document.getElementById('side-panel').classList.remove('active');
    document.getElementById('overlay-blur').style.display = "none";
}

function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

/**
 * ИНИЦИАЛИЗАЦИЯ
 */
function initClock() {
    setInterval(() => {
        const el = document.getElementById('clock');
        if (el) {
            const now = new Date();
            el.textContent = now.toTimeString().split(' ')[0];
        }
    }, 1000);
}

window.onload = () => {
    initClock();
    
    const logoEl = document.getElementById('big-logo');
    const asciiLogo = `
 ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ `;

    let pos = 0;
    const typeWriter = () => {
        if (pos < asciiLogo.length) {
            logoEl.textContent += asciiLogo[pos++];
            setTimeout(typeWriter, 1);
        } else {
            setTimeout(() => {
                transitionTo('login-screen');
            }, 1200);
        }
    };
    typeWriter();
};

// Слушатель Enter
document.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        const loginVisible = !document.getElementById('login-screen').classList.contains('hidden');
        if (loginVisible) handleAuth();
    }
});
