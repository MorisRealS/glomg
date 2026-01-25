const DB = { "morisreal": "morisreal_profile_console" };

// ЧАСЫ (MSK UTC+3)
function clockTick() {
    const now = new Date();
    const msk = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (3 * 3600000));
    const str = msk.toTimeString().split(' ')[0];
    document.querySelectorAll('.time-val').forEach(el => el.textContent = str);
}
setInterval(clockTick, 1000);

// ДАТЧИКИ
let cpu = 5, temp = 39, net = 100;
function updateTelemetry() {
    cpu += (Math.random() > 0.4 ? 1.5 : -1.2) * Math.random();
    cpu = Math.min(Math.max(cpu, 1), 12);
    temp += (Math.random() > 0.5 ? 0.3 : -0.2);
    net = Math.floor(Math.random() * 800) + 40;

    if(document.getElementById('cpu-bar')) {
        document.getElementById('cpu-num').textContent = cpu.toFixed(1) + "%";
        document.getElementById('cpu-bar').style.width = (cpu * 8.3) + "%";
        document.getElementById('temp-num').textContent = temp.toFixed(1) + "°C";
        document.getElementById('temp-bar').style.width = ((temp-35) * 10) + "%";
        document.getElementById('net-num').textContent = net + " KB/s";
        document.getElementById('net-bar').style.width = (net / 10) + "%";
    }
}
setInterval(updateTelemetry, 800);

// ПЕРЕХОДЫ С ОБНОВЛЕНИЕМ АНИМАЦИИ
function transitionTo(id) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        const target = document.getElementById(id);
        target.classList.remove('hidden');
        closeSidebar();
        
        // Перезапуск анимации появления (Glitch)
        const animBox = target.querySelector('.auth-terminal, .telemetry-grid, .menu-stack');
        if(animBox) {
            animBox.style.animation = 'none';
            animBox.offsetHeight; 
            animBox.style.animation = '';
        }
        
        setTimeout(() => fade.classList.remove('active'), 150);
    }, 400);
}

function handleAuth() {
    const u = document.getElementById('auth-id').value.trim().toLowerCase();
    const p = document.getElementById('auth-pass').value.trim();
    if (DB[u] === p) {
        document.getElementById('side-user').textContent = u.toUpperCase();
        transitionTo('main-dashboard');
    } else {
        alert("ACCESS_DENIED: UNAUTHORIZED");
    }
}

function toggleSidebar(e) {
    e.stopPropagation();
    const p = document.getElementById('side-panel');
    const s = document.getElementById('blur-shield');
    p.classList.toggle('active');
    s.style.display = p.classList.contains('active') ? "block" : "none";
}

function closeSidebar() {
    document.getElementById('side-panel').classList.remove('active');
    const s = document.getElementById('blur-shield');
    if(s) s.style.display = "none";
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// ПЕЧАТЬ ЛОГО
window.onload = () => {
    const l = document.getElementById('big-logo');
    const txt = `
 ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ `;
    let i = 0;
    const type = () => {
        if(i < txt.length) { l.textContent += txt[i++]; setTimeout(type, 1); }
        else { setTimeout(() => transitionTo('login-screen'), 1000); }
    };
    type();
    clockTick();
};
