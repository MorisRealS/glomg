const DB = { "morisreal": "morisreal_profile_console" };

// 1. ЧАСЫ (MSK UTC+3)
function updateClock() {
    const now = new Date();
    const msk = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (3 * 3600000));
    const timeStr = msk.toTimeString().split(' ')[0];
    document.querySelectorAll('.time-val').forEach(el => el.textContent = timeStr);
}
setInterval(updateClock, 1000);

// 2. РЕАЛИСТИЧНАЯ ТЕЛЕМЕТРИЯ (V20)
let cpu = 25, temp = 58, net = 150;
function updateSensors() {
    // ЦП: База 20-35%, пики до 75%
    cpu += (Math.random() > 0.45 ? 8 : -7) * Math.random();
    cpu = Math.min(Math.max(cpu, 20), 75);
    
    // Температура: 55°C - 84°C
    temp += (Math.random() > 0.5 ? 1.2 : -0.9);
    temp = Math.min(Math.max(temp, 55), 84);

    // Трафик: 40 - 950 KB/s
    net = Math.floor(Math.random() * 900) + 40;

    const cpuBar = document.getElementById('cpu-bar');
    if(cpuBar) {
        document.getElementById('cpu-num').textContent = Math.floor(cpu) + "%";
        cpuBar.style.width = cpu + "%";
        
        document.getElementById('temp-num').textContent = Math.floor(temp) + "°C";
        document.getElementById('temp-bar').style.width = temp + "%"; // 84 градуса = 84% полоски
        
        document.getElementById('net-num').textContent = net + " KB/s";
        document.getElementById('net-bar').style.width = (net / 10) + "%";
    }
}
setInterval(updateSensors, 800);

// 3. ПЕРЕХОДЫ МЕЖДУ ЭКРАНАМИ
function transitionTo(id) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    
    setTimeout(() => {
        document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
        const target = document.getElementById(id);
        target.classList.remove('hidden');
        closeSidebar();
        
        // Сброс и запуск анимаций появления
        const animContent = target.querySelector('.anim-glitch-in, .menu-stack, .telemetry-grid');
        if(animContent) {
            animContent.style.animation = 'none';
            animContent.offsetHeight; // trigger reflow
            animContent.style.animation = '';
        }
        
        setTimeout(() => fade.classList.remove('active'), 200);
    }, 500);
}

// 4. АВТОРИЗАЦИЯ
function handleAuth() {
    const u = document.getElementById('auth-id').value.trim().toLowerCase();
    const p = document.getElementById('auth-pass').value.trim();
    
    if (DB[u] === p) {
        document.getElementById('side-user').textContent = u.toUpperCase();
        transitionTo('main-dashboard');
    } else {
        alert("ОШИБКА: ОТКАЗАНО В ДОСТУПЕ. ПРОВЕРЬТЕ КЛЮЧ.");
    }
}

// 5. САЙДБАР (ПЛАШКА)
function toggleSidebar(e) {
    e.stopPropagation();
    const panel = document.getElementById('side-panel');
    const shield = document.getElementById('blur-shield');
    panel.classList.toggle('active');
    shield.style.display = panel.classList.contains('active') ? "block" : "none";
}

function closeSidebar() {
    document.getElementById('side-panel').classList.remove('active');
    document.getElementById('blur-shield').style.display = "none";
}

// 6. СКРОЛЛ
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// 7. ЗАПУСК (ЛОГОТИП)
window.onload = () => {
    const logoEl = document.getElementById('big-logo');
    const art = `
 ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ `;
    
    let charIndex = 0;
    const typeLogo = () => {
        if(charIndex < art.length) {
            logoEl.textContent += art[charIndex++];
            setTimeout(typeLogo, 1);
        } else {
            setTimeout(() => transitionTo('login-screen'), 1200);
        }
    };
    typeLogo();
    updateClock();
};
