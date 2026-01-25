const DB = { "morisreal": "morisreal_profile_console" };

// ЧАСЫ
function updateClock() {
    const msk = new Date(new Date().getTime() + (new Date().getTimezoneOffset() * 60000) + (3 * 3600000));
    document.querySelectorAll('.time-val').forEach(el => el.textContent = msk.toTimeString().split(' ')[0]);
}
setInterval(updateClock, 1000);

// ДАТЧИКИ (РЕАЛИСТИЧНЫЕ ПАРАМЕТРЫ)
function updateSensors() {
    let cpu = 22 + Math.random() * 35;
    let temp = 56 + Math.random() * 22;
    if(document.getElementById('cpu-bar')) {
        document.getElementById('cpu-num').textContent = Math.floor(cpu) + "%";
        document.getElementById('cpu-bar').style.width = cpu + "%";
        document.getElementById('temp-num').textContent = Math.floor(temp) + "°C";
        document.getElementById('temp-bar').style.width = temp + "%";
    }
}
setInterval(updateSensors, 800);

// ПЕРЕХОДЫ
function transitionTo(id) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        closeSidebar();
        setTimeout(() => fade.classList.remove('active'), 200);
    }, 450);
}

// КАРТА ОСТРОВА (ПО ТВОЕМУ СКРИНУ)
function openMap() {
    transitionTo('map-screen');
    const container = document.getElementById('node-map');
    container.innerHTML = "";
    
    // Форма острова (координаты X, Y в процентах)
    const islandPoints = [
        {x: 35, y: 40}, {x: 40, y: 38}, {x: 50, y: 35}, {x: 60, y: 37}, {x: 65, y: 42},
        {x: 75, y: 40}, {x: 82, y: 45}, {x: 85, y: 55}, {x: 80, y: 65}, {x: 70, y: 68},
        {x: 60, y: 65}, {x: 50, y: 62}, {x: 42, y: 65}, {x: 35, y: 60}, {x: 32, y: 50},
        // Внутренние узлы (рельеф)
        {x: 45, y: 48}, {x: 55, y: 52}, {x: 70, y: 50}, {x: 62, y: 58}
    ];

    islandPoints.forEach((p, i) => {
        setTimeout(() => {
            const node = document.createElement('div');
            node.className = 'node';
            node.style.left = p.x + "%";
            node.style.top = p.y + "%";
            container.appendChild(node);
        }, i * 40);
    });
}

function handleAuth() {
    const u = document.getElementById('auth-id').value.trim().toLowerCase();
    const p = document.getElementById('auth-pass').value.trim();
    if (DB[u] === p) {
        document.getElementById('side-user').textContent = u.toUpperCase();
        transitionTo('main-dashboard');
    } else { alert("ACCESS_DENIED"); }
}

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

// СТАРТ
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
