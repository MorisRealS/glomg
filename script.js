/**
 * ONG_CORE_V5_FINAL
 * Полномасштабная логика без сокращений
 */

const STAFF_DATABASE = {
    "morisreal": { pass: "morisreal_profile_console", name: "MORIS REAL", lvl: 6 },
    "kiddy":     { pass: "kiddy_profile_console",     name: "KIDDY",      lvl: 4 },
    "dykzxz":    { pass: "dykzxz_profile_console",    name: "DYKZXZ",     lvl: 4 },
    "msk4ne_":   { pass: "msk4ne_profile_console",    name: "MSK4NE",     lvl: 4 }
};

/**
 * ФУНКЦИЯ ПЕРЕХОДА ЧЕРЕЗ ЗАТЕМНЕНИЕ
 */
function transitionTo(targetWindowId) {
    const fadeOverlay = document.getElementById('fade-overlay');
    
    // 1. Начинаем затемнение
    fadeOverlay.classList.add('active');
    
    // 2. Ждем, пока экран станет полностью черным (0.6 сек из CSS)
    setTimeout(() => {
        // Скрываем все окна и открываем нужное
        executeWindowSwitch(targetWindowId);
        
        // 3. Убираем затемнение
        setTimeout(() => {
            fadeOverlay.classList.remove('active');
        }, 100); 
    }, 600);
}

function executeWindowSwitch(id) {
    // Прячем абсолютно все активные экраны
    document.querySelectorAll('.screen, #intro-screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Показываем целевое окно
    const target = document.getElementById(id);
    if (target) {
        target.classList.remove('hidden');
    }
    
    // Сбрасываем состояние боковой панели при переходе
    closeSidebar();
}

/**
 * СИСТЕМА АВТОРИЗАЦИИ
 */
function handleAuth() {
    const idField = document.getElementById('auth-id');
    const passField = document.getElementById('auth-pass');
    
    const id = idField.value.trim().toLowerCase();
    const pass = passField.value.trim();

    if (STAFF_DATABASE[id] && STAFF_DATABASE[id].pass === pass) {
        // Эффект завала кода перед финальным входом
        triggerMatrixSequence(() => {
            const userData = STAFF_DATABASE[id];
            
            // Заполнение профиля в плашке
            document.getElementById('side-username').textContent = userData.name;
            document.getElementById('side-lvl').textContent = `ACCESS LEVEL: ${userData.lvl}`;
            document.getElementById('side-id').textContent = `ID: ${id.toUpperCase()}`;
            
            transitionTo('main-dashboard');
        });
    } else {
        alert("КРИТИЧЕСКАЯ ОШИБКА: ДОСТУП ЗАБЛОКИРОВАН. ПРОВЕРЬТЕ ШИФР-КОД.");
        passField.value = "";
    }
}

/**
 * ЭФФЕКТ "ЗАВАЛ КОДА"
 */
function triggerMatrixSequence(onDone) {
    const canvas = document.getElementById('matrix-canvas');
    canvas.classList.remove('hidden');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const alphabet = "0123456789ABCDEF@#$%^&*()_+";
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    const render = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#a855f7";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const char = alphabet[Math.floor(Math.random() * alphabet.length)];
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    };

    const matrixLoop = setInterval(render, 35);

    setTimeout(() => {
        clearInterval(matrixLoop);
        canvas.classList.add('hidden');
        onDone();
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
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * СИСТЕМНЫЕ ЧАСЫ И ИНИЦИАЛИЗАЦИЯ
 */
function initSystemClock() {
    setInterval(() => {
        const now = new Date();
        const time = now.toTimeString().split(' ')[0];
        const clockDisplay = document.getElementById('clock');
        if (clockDisplay) clockDisplay.textContent = time;
    }, 1000);
}

window.onload = () => {
    initSystemClock();
    
    const logoContainer = document.getElementById('big-logo');
    const logoAscii = `
 ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ `;

    let charPosition = 0;
    const typeWriter = () => {
        if (charPosition < logoAscii.length) {
            logoContainer.textContent += logoAscii[charPosition++];
            setTimeout(typeWriter, 1);
        } else {
            // После завершения отрисовки логотипа - переход к авторизации через затемнение
            setTimeout(() => {
                transitionTo('login-screen');
            }, 1000);
        }
    };
    typeWriter();
};

// Глобальный слушатель Enter
document.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        const isLoginVisible = !document.getElementById('login-screen').classList.contains('hidden');
        if (isLoginVisible) {
            handleAuth();
        }
    }
});
