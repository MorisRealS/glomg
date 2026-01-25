const DB = { "morisreal": "morisreal_profile_console" };

// 1. ЧАСЫ И СЕНСОРЫ
function updateClock() {
    const msk = new Date(new Date().getTime() + (new Date().getTimezoneOffset() * 60000) + (3 * 3600000));
    document.querySelectorAll('.time-val').forEach(el => el.textContent = msk.toTimeString().split(' ')[0]);
}
setInterval(updateClock, 1000);

function updateSensors() {
    let cpu = 20 + Math.random() * 45;
    let temp = 55 + Math.random() * 25;
    if(document.getElementById('cpu-bar')) {
        document.getElementById('cpu-num').textContent = Math.floor(cpu) + "%";
        document.getElementById('cpu-bar').style.width = cpu + "%";
        document.getElementById('temp-num').textContent = Math.floor(temp) + "°C";
        document.getElementById('temp-bar').style.width = temp + "%";
    }
}
setInterval(updateSensors, 800);

// 2. ПЕРЕХОДЫ МЕЖДУ ЭКРАНАМИ
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

// 3. ГЕНЕРАЦИЯ КАРТЫ ОСТРОВА (ПО ТВОЕМУ КРАСНОМУ КОНТУРУ)
function openMap() {
    transitionTo('map-screen');
    const container = document.getElementById('node-map');
    const svg = document.getElementById('map-svg');
    container.innerHTML = "";
    svg.innerHTML = "";

    // Основные точки контура (Minecraft остров)
    const outline = [
        {x: 20, y: 45}, {x: 25, y: 35}, {x: 35, y: 30}, {x: 45, y: 28}, {x: 55, y: 30},
        {x: 65, y: 35}, {x: 70, y: 45}, {x: 75, y: 55}, {x: 82, y: 50}, {x: 88, y: 45},
        {x: 93, y: 50}, {x: 95, y: 60}, {x: 90, y: 75}, {x: 80, y: 82}, {x: 70, y: 85},
        {x: 58, y: 80}, {x: 45, y: 75}, {x: 35, y: 78}, {x: 22, y: 75}, {x: 18, y: 65},
        {x: 18, y: 55}, {x: 20, y: 45}
    ];

    // Генерируем внутренние узлы (рельеф острова)
    const internals = [];
    for(let i=0; i<50; i++) {
        let rx = 22 + Math.random() * 68;
        let ry = 35 + Math.random() * 45;
        internals.push({x: rx, y: ry});
    }

    const allNodes = [...outline, ...internals];

    allNodes.forEach((p, i) => {
        setTimeout(() => {
            const node = document.createElement('div');
            node.className = 'node';
            node.style.left = p.x + "%";
            node.style.top = p.y + "%";
            container.appendChild(node);

            // Соединяем точки контура линиями
            if (i > 0 && i < outline.length) {
                const prev = outline[i-1];
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", prev.x + "%");
                line.setAttribute("y1", prev.y + "%");
                line.setAttribute("x2", p.x + "%");
                line.setAttribute("y2", p.y + "%");
                line.setAttribute("class", "map-line");
                svg.appendChild(line);
            }
        }, i * 15);
    });
}

function closeMap() { transitionTo('main-dashboard'); }

// 4. ЛОГИКА АВТОРИЗАЦИИ
function handleAuth() {
    const u = document.getElementById('auth-id').value.trim().toLowerCase();
    const p = document.getElementById('auth-pass').value.trim();
    if (DB[u] === p) {
        document.getElementById('side-user').textContent = u.toUpperCase();
        transitionTo('main-dashboard');
    } else {
        alert("ACCESS_DENIED: OPERATOR_NOT_FOUND");
    }
}

// 5. САЙДБАР
function toggleSidebar(e) {
    e.stopPropagation();
    document.getElementById('side-panel').classList.add('active');
    document.getElementById('blur-shield').style.display = "block";
}

function closeSidebar() {
    document.getElementById('side-panel').classList.remove('active');
    document.getElementById('blur-shield').style.display = "none";
}

// 6. ЗАГРУЗОЧНЫЙ ЛОГОТИП
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
            setTimeout(() => transitionTo('login-screen'), 1000);
        }
    };
    type();
    updateClock();
};
