const STAFF_DATABASE = {
    "morisreal": { pass: "morisreal_profile_console", name: "MORIS REAL", lvl: 6 },
    "kiddy":     { pass: "kiddy_profile_console",     name: "KIDDY",      lvl: 4 },
    "dykzxz":    { pass: "dykzxz_profile_console",    name: "DYKZXZ",     lvl: 4 },
    "msk4ne_":   { pass: "msk4ne_profile_console",    name: "MSK4NE",     lvl: 4 }
};

function transitionTo(targetId) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
        const target = document.getElementById(targetId);
        target.classList.remove('hidden');
        
        const anims = target.querySelectorAll('.anim-login-fly, .anim-btn-fly');
        anims.forEach(el => { el.style.animation = 'none'; el.offsetHeight; el.style.animation = ''; });
        
        closeSidebar();
        setTimeout(() => fade.classList.remove('active'), 150);
    }, 600);
}

function handleAuth() {
    const id = document.getElementById('auth-id').value.trim().toLowerCase();
    const pass = document.getElementById('auth-pass').value.trim();
    if (STAFF_DATABASE[id] && STAFF_DATABASE[id].pass === pass) {
        triggerMatrix(() => {
            document.getElementById('side-username').textContent = STAFF_DATABASE[id].name;
            document.getElementById('side-lvl').textContent = "LVL: " + STAFF_DATABASE[id].lvl;
            transitionTo('main-dashboard');
        });
    } else { alert("ACCESS DENIED"); }
}

function triggerMatrix(cb) {
    const c = document.getElementById('matrix-canvas');
    c.classList.remove('hidden');
    const ctx = c.getContext('2d');
    c.width = window.innerWidth; c.height = window.innerHeight;
    const drops = new Array(Math.floor(c.width / 16)).fill(1);
    const i = setInterval(() => {
        ctx.fillStyle = "rgba(0,0,0,0.15)"; ctx.fillRect(0,0,c.width,c.height);
        ctx.fillStyle = "#a855f7";
        drops.forEach((y, x) => {
            ctx.fillText(String.fromCharCode(Math.random()*128), x*16, y*16);
            if(y*16 > c.height && Math.random() > 0.975) drops[x] = 0;
            drops[x]++;
        });
    }, 35);
    setTimeout(() => { clearInterval(i); c.classList.add('hidden'); cb(); }, 1500);
}

function toggleSidebar() { document.getElementById('side-panel').classList.toggle('active'); }
function closeSidebar() { document.getElementById('side-panel').classList.remove('active'); }

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
    setInterval(() => {
        const cl = document.getElementById('clock');
        if(cl) cl.textContent = new Date().toTimeString().split(' ')[0];
    }, 1000);
};
