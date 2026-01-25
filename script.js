const STAFF = { "morisreal": "morisreal_profile_console" };

// ЧАСЫ МСК (UTC+3)
function updateClock() {
    const now = new Date();
    const msk = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (3 * 3600000));
    const timeStr = msk.toTimeString().split(' ')[0];
    document.querySelectorAll('.time-val').forEach(el => el.textContent = timeStr);
}
setInterval(updateClock, 1000);

// ДАТЧИКИ (РВАНЫЙ АЛГОРИТМ)
let cpu = 4.2, temp = 39.5, load = 15;
function updateSensors() {
    // ЦП 1-10% с рваным шагом
    let cpuStep = (Math.random() > 0.4 ? 1.2 : -0.9) * Math.random();
    cpu = Math.min(Math.max(cpu + cpuStep, 1), 10);
    
    // Температура 37-44
    temp += (Math.random() > 0.5 ? 0.4 : -0.3);
    temp = Math.min(Math.max(temp, 37), 44);

    // Нагрузка
    load += (Math.random() > 0.5 ? 1 : -1);

    if(document.getElementById('cpu-val')) {
        document.getElementById('cpu-val').textContent = cpu.toFixed(1) + "%";
        document.getElementById('temp-val').textContent = temp.toFixed(1) + "°C";
        document.getElementById('load-val').textContent = Math.floor(load) + "%";
    }
}
setInterval(updateSensors, 800);

function transitionTo(targetId) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(targetId).classList.remove('hidden');
        closeSidebar();
        
        // Перезапуск анимаций вылета
        const anims = document.getElementById(targetId).querySelectorAll('.anim-btn-fly, .anim-login-fly');
        anims.forEach(a => { a.style.animation = 'none'; a.offsetHeight; a.style.animation = ''; });
        
        setTimeout(() => fade.classList.remove('active'), 150);
    }, 500);
}

function handleAuth() {
    const id = document.getElementById('auth-id').value.trim().toLowerCase();
    const pass = document.getElementById('auth-pass').value.trim();
    if (STAFF[id] === pass) {
        document.getElementById('side-username').textContent = id.toUpperCase();
        transitionTo('main-dashboard');
    } else { alert("ACCESS DENIED"); }
}

function toggleSidebar(e) {
    e.stopPropagation();
    document.getElementById('side-panel').classList.toggle('active');
    document.getElementById('overlay-blur').style.display = 
        document.getElementById('side-panel').classList.contains('active') ? "block" : "none";
}

function closeSidebar() {
    document.getElementById('side-panel').classList.remove('active');
    document.getElementById('overlay-blur').style.display = "none";
}

function scrollToSection(id) { document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); }

window.onload = () => {
    const l = document.getElementById('big-logo');
    const a = `
 ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ `;
    let p = 0;
    const t = () => {
        if(p < a.length) { l.textContent += a[p++]; setTimeout(t, 1); }
        else { setTimeout(() => transitionTo('login-screen'), 1000); }
    };
    t();
    updateClock();
};
