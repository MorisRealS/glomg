const DB = { "morisreal": "morisreal_profile_console" };

// 1. ЧАСЫ
function updateClock() {
    const msk = new Date(new Date().getTime() + (new Date().getTimezoneOffset() * 60000) + (3 * 3600000));
    document.querySelectorAll('.time-val').forEach(el => el.textContent = msk.toTimeString().split(' ')[0]);
}
setInterval(updateClock, 1000);

// 2. ДАТЧИКИ И ГРАФИК
let cpu = 25, temp = 58;
function updateSensors() {
    cpu = 15 + Math.random() * 45;
    temp = 54 + Math.random() * 24;
    
    if(document.getElementById('cpu-bar')) {
        document.getElementById('cpu-num').textContent = Math.floor(cpu) + "%";
        document.getElementById('cpu-bar').style.width = cpu + "%";
        document.getElementById('temp-num').textContent = Math.floor(temp) + "°C";
        document.getElementById('temp-bar').style.width = temp + "%";
        
        // Живой "текстовый" график
        const graph = document.getElementById('net-graph');
        let bars = "";
        for(let i=0; i < Math.floor(Math.random()*15 + 5); i++) bars += "|";
        graph.textContent = bars;
    }
}
setInterval(updateSensors, 800);

// 3. ПЕРЕХОДЫ
function transitionTo(id) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        closeSidebar();
        setTimeout(() => fade.classList.remove('active'), 150);
    }, 400);
}

// 4. АВТОРИЗАЦИЯ
function handleAuth() {
    const u = document.getElementById('auth-id').value.trim().toLowerCase();
    const p = document.getElementById('auth-pass').value.trim();
    if (DB[u] === p) {
        document.getElementById('side-user').textContent = u.toUpperCase();
        transitionTo('main-dashboard');
    } else {
        alert("ACCESS_DENIED: UNAUTHORIZED_OPERATOR");
    }
}

// 5. КОНСОЛЬНЫЙ МОДУЛЬ
function runMatrixLog() {
    const consoleEl = document.getElementById('matrix-console');
    consoleEl.classList.toggle('hidden');
    if(!consoleEl.classList.contains('hidden')) {
        consoleEl.innerHTML = "INITIALIZING_LOG_STREAM...<br>";
        let lines = 0;
        const interval = setInterval(() => {
            if(lines < 10) {
                consoleEl.innerHTML += `> DATA_PACKET_${Math.floor(Math.random()*9000+1000)}_LOADED<br>`;
                lines++;
            } else { clearInterval(interval); }
        }, 200);
    }
}

// 6. САЙДБАР
function toggleSidebar(e) {
    e.stopPropagation();
    document.getElementById('side-panel').classList.add('active');
    document.getElementById('blur-shield').style.display = "block";
}

function closeSidebar() {
    document.getElementById('side-panel').classList.remove('active');
    document.getElementById('blur-shield').style.display = "none";
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// 7. СТАРТ
window.onload = () => {
    const l = document.getElementById('big-logo');
    const art = `
 ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ `;
    let i = 0;
    const type = () => {
        if(i < art.length) {
            l.textContent += art[i++];
            setTimeout(type, 1);
        } else {
            setTimeout(() => transitionTo('login-screen'), 1200);
        }
    };
    type();
    updateClock();
};
