/**
 * GLOMG_CORE_V10_STABLE
 * ПОЛНАЯ ВЕРСИЯ БЕЗ СОКРАЩЕНИЙ
 */

const STAFF_DATABASE = {
    "morisreal": { pass: "morisreal_profile_console", name: "MORIS REAL", lvl: 6 },
    "kiddy":     { pass: "kiddy_profile_console",     name: "KIDDY",      lvl: 4 },
    "dykzxz":    { pass: "dykzxz_profile_console",    name: "DYKZXZ",     lvl: 4 },
    "msk4ne_":   { pass: "msk4ne_profile_console",    name: "MSK4NE",     lvl: 4 }
};

/**
 * ФУНКЦИЯ ПЕРЕХОДА (С ПЕРЕЗАПУСКОМ ФИЗИКИ)
 */
function transitionTo(targetId) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');

    setTimeout(() => {
        // Скрываем всё
        document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
        
        const target = document.getElementById(targetId);
        target.classList.remove('hidden');

        // СБРОС И ПОВТОР АНИМАЦИЙ ВЫЛЕТА
        const anims = target.querySelectorAll('.anim-login-fly, .anim-btn-fly');
        anims.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // триггер перерисовки
            el.style.animation = '';
        });

        closeSidebar();
        setTimeout(() => fade.classList.remove('active'), 150);
    }, 600);
}

function handleAuth() {
    const id = document.getElementById('auth-id').value.trim().toLowerCase();
    const pass = document.getElementById('auth-pass').value.trim();
    
    if (STAFF_DATABASE[id] && STAFF_DATABASE[id].pass === pass) {
        triggerMatrix(() => {
            const u = STAFF_DATABASE[id];
            document.getElementById('side-username').textContent = u.name;
            document.getElementById('side-lvl').textContent = `LVL: ${u.lvl}`;
            document.getElementById('side-id').textContent = `ID: ${id.toUpperCase()}`;
            transitionTo('main-dashboard');
        });
    } else {
        alert("ОШИБКА ДОСТУПА: НЕВЕРНЫЕ ДАННЫЕ");
    }
}

/**
 * МАТРИЧНЫЙ ДОЖДЬ (ЗАВАЛ КОДА)
 */
function triggerMatrix(cb) {
    const c = document.getElementById('matrix-canvas');
    c.classList.remove('hidden');
    const ctx = c.getContext('2d');
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const drops = new Array(Math.floor(c.width / 16)).fill(1);
    const intrvl = setInterval(() => {
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = "#a855f7";
        ctx.font = "16px monospace";
        
        drops.forEach((y, x) => {
            const txt = String.fromCharCode(Math.random() * 128);
            ctx.fillText(txt, x * 16, y * 16);
            if (y * 16 > c.height && Math.random() > 0.975) drops[x] = 0;
            drops[x]++;
        });
    }, 35);

    setTimeout(() => {
        clearInterval(intrvl);
        c.classList.add('hidden');
        cb();
    }, 1500);
}

function toggleSidebar() {
    const p = document.getElementById('side-panel');
    const b = document.getElementById('overlay-blur');
    const a = p.classList.toggle('active');
    b.style.display = a ? "block" : "none";
}

function closeSidebar() {
    document.getElementById('side-panel').classList.remove('active');
    document.getElementById('overlay-blur').style.display = "none";
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior: 'smooth' });
}

window.onload = () => {
    const l = document.getElementById('big-logo');
    const a = `
 ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ `;
    
    let pos = 0;
    const type = () => {
        if(pos < a.length) {
            l.textContent += a[pos++];
            setTimeout(type, 1);
        } else {
            setTimeout(() => transitionTo('login-screen'), 1200);
        }
    };
    type();

    setInterval(() => {
        const cl = document.getElementById('clock');
        if(cl) cl.textContent = new Date().toTimeString().split(' ')[0];
    }, 1000);
};
