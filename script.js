// Конфигурация системы G.L.O.M.G.
const DB = { "morisreal": "morisreal_profile_console" };
let isAuthorized = false;

// 1. УПРАВЛЕНИЕ ПЕРЕХОДАМИ
function transitionTo(id) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        closeSidebar();
        setTimeout(() => fade.classList.remove('active'), 250);
    }, 450);
}

// 2. АВТОРИЗАЦИЯ И ГОСТЬ
function enterGuest() {
    isAuthorized = false;
    transitionTo('lobby-screen');
}

function handleAuth() {
    const user = document.getElementById('auth-id').value.trim();
    const pass = document.getElementById('auth-pass').value.trim();
    if (DB[user] === pass) {
        isAuthorized = true;
        document.getElementById('op-name').textContent = user.toUpperCase();
        document.getElementById('side-user').textContent = user.toUpperCase();
        transitionTo('main-dashboard');
    } else {
        alert("ACCESS_DENIED: INVALID OPERATOR CREDENTIALS");
    }
}

// 3. ТАКТИЧЕСКАЯ КАРТА
function openMap() {
    transitionTo('map-screen');
    const container = document.getElementById('node-map');
    container.innerHTML = "";
    
    // Точки на радаре
    const points = [
        {x: 50, y: 50, label: "CORE"},
        {x: 35, y: 40, label: "N-01"},
        {x: 65, y: 45, label: "E-04"},
        {x: 45, y: 70, label: "S-02"}
    ];

    points.forEach((p, i) => {
        setTimeout(() => {
            const node = document.createElement('div');
            node.style.cssText = `
                position: absolute; width: 12px; height: 12px; 
                background: #a855f7; border-radius: 50%;
                left: ${p.x}%; top: ${p.y}%;
                box-shadow: 0 0 15px #a855f7;
                z-index: 50; transform: translate(-50%, -50%);
            `;
            container.appendChild(node);
        }, i * 150);
    });
}

function closeMap() {
    // Исправление бага безопасности
    if (isAuthorized) {
        transitionTo('main-dashboard');
    } else {
        transitionTo('lobby-screen');
    }
}

// 4. ТЕЛЕМЕТРИЯ (ПЛАВНЫЕ ДАТЧИКИ)
function updateStats() {
    if (!document.getElementById('status-screen').classList.contains('hidden')) {
        let cpu = 22 + Math.random() * 8;
        let temp = 58 + Math.random() * 4;

        document.getElementById('cpu-num').textContent = Math.floor(cpu) + "%";
        document.getElementById('cpu-bar').style.width = cpu + "%";
        
        document.getElementById('temp-num').textContent = Math.floor(temp) + "°C";
        document.getElementById('temp-bar').style.width = temp + "%";
    }
}
setInterval(updateStats, 2000);

// 5. САЙДБАР
function toggleSidebar(e) {
    e.stopPropagation();
    document.getElementById('side-panel').style.left = "0";
    document.getElementById('blur-shield').style.display = "block";
}
function closeSidebar() {
    document.getElementById('side-panel').style.left = "-320px";
    document.getElementById('blur-shield').style.display = "none";
}

// 6. СТАРТОВАЯ АНИМАЦИЯ
window.onload = () => {
    const l = document.getElementById('big-logo');
    const art = "G.L.O.M.G. CORE V26.1\n--------------------\nBOOTING...\nLINKING_NODES...\nSYSTEM_READY.";
    let i = 0;
    function type() {
        if(i < art.length) {
            l.textContent += art[i++];
            setTimeout(type, 30);
        } else {
            setTimeout(() => transitionTo('login-screen'), 1200);
        }
    }
    type();
};
