const STAFF = { "morisreal": "morisreal_profile_console" };
let startTime = Date.now();

// ЧАСЫ И АПТАЙМ
function updateTime() {
    const now = new Date();
    const msk = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (3 * 3600000));
    document.querySelectorAll('.time-val').forEach(el => el.textContent = msk.toTimeString().split(' ')[0]);
    
    // Uptime calculation
    let diff = Math.floor((Date.now() - startTime) / 1000);
    let h = Math.floor(diff / 3600).toString().padStart(2, '0');
    let m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
    let s = (diff % 60).toString().padStart(2, '0');
    if(document.getElementById('uptime-val')) document.getElementById('uptime-val').textContent = `${h}:${m}:${s}`;
}
setInterval(updateTime, 1000);

// ДИНАМИЧЕСКАЯ ТЕЛЕМЕТРИЯ
let cpu = 5, temp = 40, net = 120;
function updateTelemetry() {
    // CPU: 1-12% рваный ритм
    cpu += (Math.random() > 0.4 ? 1.5 : -1.2) * Math.random();
    cpu = Math.min(Math.max(cpu, 1), 12);
    
    // TEMP: 38-46°C
    temp += (Math.random() > 0.5 ? 0.3 : -0.2);
    temp = Math.min(Math.max(temp, 38), 46);

    // NET: 50-800 KB/s
    net = Math.floor(Math.random() * 750) + 50;

    if(document.getElementById('cpu-bar')) {
        document.getElementById('cpu-num').textContent = cpu.toFixed(1) + "%";
        document.getElementById('cpu-bar').style.width = (cpu * 8) + "%"; // Scale for visibility
        
        document.getElementById('temp-num').textContent = temp.toFixed(1) + "°C";
        document.getElementById('temp-bar').style.width = ((temp - 30) * 6) + "%";
        
        document.getElementById('net-num').textContent = net + " KB/s";
        document.getElementById('net-bar').style.width = (net / 8) + "%";
    }
}
setInterval(updateTelemetry, 700);

function transitionTo(targetId) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(targetId).classList.remove('hidden');
        closeSidebar();
        
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
        startTime = Date.now(); // Reset uptime on login
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
        else { setTimeout(() => transitionTo('login-screen'), 800); }
    };
    t();
};
