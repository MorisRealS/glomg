// Конфиг безопасности G.L.O.M.G.
const DB = { "morisreal": "morisreal_profile_console" };
let isAuthorized = false;

// 1. СИСТЕМА ПЕРЕХОДОВ (ЗАТЕМНЕНИЕ)
function transitionTo(id) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active'); // Начало затемнения
    
    setTimeout(() => {
        // Скрываем всё
        document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
        // Показываем целевой экран
        document.getElementById(id).classList.remove('hidden');
        closeSidebar();
        
        setTimeout(() => {
            fade.classList.remove('active'); // Конец затемнения
        }, 150);
    }, 600);
}

// 2. ЛОГИКА АВТОРИЗАЦИИ
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
        alert("ОШИБКА: НЕДОПУСТИМЫЙ ИДЕНТИФИКАТОР");
    }
}

// 3. РАДАР (ГЕНЕРАЦИЯ ТОЧЕК)
function openMap() {
    transitionTo('map-screen');
    const container = document.getElementById('node-map');
    container.innerHTML = "";
    
    // Генерируем "активные" объекты на радаре
    const points = [
        {x: 50, y: 50}, // Ядро
        {x: 30, y: 25}, 
        {x: 70, y: 60},
        {x: 45, y: 80}
    ];

    points.forEach((p, i) => {
        setTimeout(() => {
            const d = document.createElement('div');
            d.style.cssText = `
                position: absolute; width: 10px; height: 10px; 
                background: var(--p); border-radius: 50%;
                left: ${p.x}%; top: ${p.y}%;
                box-shadow: 0 0 15px var(--p);
                transform: translate(-50%, -50%);
            `;
            container.appendChild(d);
        }, i * 200);
    });
}

function closeMap() {
    isAuthorized ? transitionTo('main-dashboard') : transitionTo('lobby-screen');
}

// 4. ТЕЛЕМЕТРИЯ (ДИНАМИКА)
setInterval(() => {
    if(!document.getElementById('status-screen').classList.contains('hidden')) {
        let cpuVal = 10 + Math.random() * 15;
        let tempVal = 38 + Math.random() * 7;
        
        document.getElementById('cpu-num').textContent = Math.floor(cpuVal) + "%";
        document.getElementById('cpu-bar').style.width = cpuVal + "%";
        
        document.getElementById('temp-num').textContent = Math.floor(tempVal) + "°C";
        document.getElementById('temp-bar').style.width = tempVal + "%";
    }
}, 2000);

// 5. САЙДБАР УПРАВЛЕНИЕ
function toggleSidebar(e) {
    e.stopPropagation();
    document.getElementById('side-panel').classList.add('open');
    document.getElementById('blur-shield').style.display = "block";
}

function closeSidebar() {
    document.getElementById('side-panel').classList.remove('open');
    document.getElementById('blur-shield').style.display = "none";
}

// 6. ИНИЦИАЛИЗАЦИЯ (ПЕЧАТЬ ЛОГО)
window.onload = () => {
    const l = document.getElementById('big-logo');
    const art = "G.L.O.M.G. CORE\nSYSTEM VERSION 26.2\nSTATUS: ONLINE\nBOOT_SEQUENCE COMPLETE_";
    let i = 0;
    
    function typeEffect() {
        if(i < art.length) {
            l.textContent += art[i++];
            setTimeout(typeEffect, 40);
        } else {
            setTimeout(() => transitionTo('login-screen'), 1200);
        }
    }
    typeEffect();
};
