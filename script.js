/** * ONG_CORE_V4_OFFICIAL_SCRIPT
 * Глобальные данные пользователей и уровни доступа
 */
const PROFILES = {
    "morisreal": { pass: "morisreal_profile_console", name: "MORIS REAL", lvl: 6 },
    "kiddy":     { pass: "kiddy_profile_console",     name: "KIDDY",      lvl: 4 },
    "dykzxz":    { pass: "dykzxz_profile_console",    name: "DYKZXZ",     lvl: 4 },
    "msk4ne_":   { pass: "msk4ne_profile_console",    name: "MSK4NE",     lvl: 4 }
};

// Конфиг подсказок
const hintPhrases = ["пссс", "ты можешь написать просто lobby", "попробуй"];

/** * ЭФФЕКТ: ЗАВАЛ КОДА (МАТРИЦА) 
 */
function startMatrixEffect() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const symbols = "0123456789ABCDEF<>[]{}/\\|#";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#a855f7";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = symbols[Math.floor(Math.random() * symbols.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    };
    const matrixInterval = setInterval(draw, 33);
    return matrixInterval;
}

/** * ЛОГИКА ПЕРЕХОДА (Завал -> Затухание -> Окно)
 */
function transitionTo(targetWindowId) {
    const canvas = document.getElementById('matrix-canvas');
    const overlay = document.getElementById('fade-overlay');
    
    // 1. Активируем завал кода
    canvas.classList.remove('hidden');
    canvas.classList.add('active');
    const interval = startMatrixEffect();

    // 2. Через 0.6с накладываем черное затухание поверх завала
    setTimeout(() => {
        overlay.classList.add('active');
        
        // 3. Когда экран полностью черный, меняем окно
        setTimeout(() => {
            clearInterval(interval);
            canvas.classList.add('hidden');
            canvas.classList.remove('active');
            
            openWindow(targetWindowId);

            // 4. Убираем затухание
            setTimeout(() => {
                overlay.classList.remove('active');
            }, 500);
        }, 800);
    }, 600);
}

/** * УПРАВЛЕНИЕ ОКНАМИ
 */
function openWindow(id) {
    document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    
    const panel = document.getElementById('side-panel');
    if (id === 'main-dashboard' || id === 'lobby-screen') {
        panel.classList.remove('side-hidden');
    }
    panel.classList.remove('active');
    document.getElementById('blur-overlay').style.display = "none";

    if (id === 'login-screen') {
        appStage = "ID";
        document.getElementById('auth-output').innerHTML = "> ONG_CORE В ОЖИДАНИИ... ВВЕДИТЕ ID:";
        document.getElementById('cmd').focus();
    }
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Пасхалки
async function runHintSystem() {
    const box = document.getElementById('hint-box');
    for (let msg of hintPhrases) {
        await new Promise(r => setTimeout(r, 4000));
        box.textContent = msg; box.style.opacity = "1";
        await new Promise(r => setTimeout(r, 2000));
        box.style.opacity = "0";
    }
}

/** * ОБРАБОТКА КОНСОЛИ
 */
let appStage = "ID", currentUser = null;

document.getElementById('cmd').onkeydown = (e) => {
    if (e.key === "Enter") {
        let val = e.target.value.trim().toLowerCase();
        e.target.value = "";
        const history = document.getElementById('auth-output');

        if (val === "lobby") {
            transitionTo('lobby-screen');
            return;
        }

        if (appStage === "ID") {
            if (PROFILES[val]) {
                currentUser = PROFILES[val];
                appStage = "PASS";
                history.innerHTML += `<br>> ID [${val.toUpperCase()}] ПРИНЯТ. УРОВЕНЬ: ${currentUser.lvl}. ВВЕДИТЕ ПАРОЛЬ:`;
            } else {
                history.innerHTML += `<br>> ОШИБКА: ID НЕ НАЙДЕН.`;
            }
        } else if (appStage === "PASS") {
            if (val === currentUser.pass) {
                transitionTo('main-dashboard');
                document.getElementById('user-display').textContent = currentUser.name;
                document.getElementById('user-lvl-tag').textContent = `ACCESS LVL: ${currentUser.lvl}`;
            } else {
                history.innerHTML += `<br>> ОШИБКА: НЕВЕРНЫЙ ПАРОЛЬ.`;
            }
        }
    }
};

/** * ИНИЦИАЛИЗАЦИЯ (ЛОГОТИП)
 */
window.onload = () => {
    const logoEl = document.getElementById('big-logo');
    const ascii = `
 ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ `;

    let charIdx = 0;
    const typeLogo = () => {
        if (charIdx < ascii.length) {
            logoEl.textContent += ascii[charIdx++];
            setTimeout(typeLogo, 1);
        } else {
            setTimeout(() => {
                openWindow('login-screen');
                runHintSystem();
            }, 1200);
        }
    };
    typeLogo();
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
