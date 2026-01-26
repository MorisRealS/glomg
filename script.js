const PROFILES = {
    "morisreal": { name: "MorisReal", pass: "admin", uuid: "0006-ADM", lvl: 6, role: "ADMIN" },
    "msk4ne_":   { name: "MSK4NE", pass: "3333", uuid: "0001-M", lvl: 5 },
    "sumber":    { name: "Sumber", pass: "0000", uuid: "7777-S", lvl: 5 }
};

let activeUser = null;

window.addEventListener('DOMContentLoaded', () => {
    const introText = document.getElementById('intro-ascii');
    const introLogo = document.getElementById('intro-logo');
    const introScreen = document.getElementById('scr-intro');
    const loginScreen = document.getElementById('login-screen');

    setTimeout(() => {
        if(introText) introText.classList.add('hidden');
        if(introLogo) introLogo.classList.remove('hidden');
    }, 1500);

    setTimeout(() => {
        introScreen.style.opacity = '0';
        setTimeout(() => {
            introScreen.classList.add('hidden');
            loginScreen.classList.remove('hidden');
            initMatrix();
        }, 1000);
    }, 4000);
});

function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const drops = Array(Math.floor(canvas.width/14)).fill(1);
    setInterval(() => {
        ctx.fillStyle = "rgba(5, 2, 8, 0.1)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#a855f7"; 
        drops.forEach((y, i) => {
            ctx.fillText(Math.floor(Math.random()*2), i*14, y*14);
            if(y*14 > canvas.height && Math.random() > 0.98) drops[i] = 0;
            drops[i]++;
        });
    }, 50);
}

function attemptLogin() {
    const id = document.getElementById('user-id').value.trim().toLowerCase();
    const pass = document.getElementById('user-pass').value.trim();
    if (PROFILES[id] && PROFILES[id].pass === pass) {
        activeUser = PROFILES[id];
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-dashboard').classList.remove('hidden');
        const display = document.getElementById('user-name-display');
        display.innerText = activeUser.name;
        if(activeUser.role === "ADMIN") display.style.color = "#ff2233";
    } else {
        document.getElementById('output').innerHTML = "<div style='color:red'>> ERROR: ACCESS_DENIED</div>";
    }
}

function toggleSidebar(state) {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('side-overlay');
    if(state) { sb.classList.add('open'); ov.style.display = 'block'; }
    else { sb.classList.remove('open'); ov.style.display = 'none'; }
}

function openProfile() {
    document.getElementById('p-name-val').innerText = activeUser.name;
    document.getElementById('p-uuid-val').innerText = "UUID: " + activeUser.uuid + " | LVL: " + activeUser.lvl;
    document.getElementById('modal-profile').classList.remove('hidden');
    toggleSidebar(false);
}

function closeProfile() { document.getElementById('modal-profile').classList.add('hidden'); }

setInterval(() => {
    const cl = document.getElementById('clock');
    if(cl) cl.innerText = new Date().toLocaleTimeString();
}, 1000);
