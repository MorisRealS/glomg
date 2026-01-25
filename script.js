// Конфигурация данных
const DB = { "morisreal": "morisreal_profile_console" };
let isAuthorized = false; // Глобальный флаг сессии

// Функция переходов между экранами
function transitionTo(id) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        closeSidebar();
        setTimeout(() => fade.classList.remove('active'), 250);
    }, 500);
}

// Вход в режиме гостя
function enterGuest() {
    isAuthorized = false;
    transitionTo('lobby-screen');
}

// Логика авторизации
function handleAuth() {
    const user = document.getElementById('auth-id').value.trim().toLowerCase();
    const pass = document.getElementById('auth-pass').value.trim();
    if (DB[user] === pass) {
        isAuthorized = true;
        document.getElementById('op-name').textContent = user.toUpperCase();
        document.getElementById('side-user').textContent = user.toUpperCase();
        transitionTo('main-dashboard');
    } else {
        alert("ОШИБКА: ДОСТУП ЗАПРЕЩЕН. ПРОВЕРЬТЕ ЛОГИН/ПАРОЛЬ.");
    }
}

// ПЛАВНЫЕ ДАТЧИКИ (ОБНОВЛЕНИЕ РАЗ В 2 СЕКУНДЫ)
function updateSensors() {
    // Работает только если экран статуса активен
    if (!document.getElementById('status-screen').classList.contains('hidden')) {
        // Стабильный волнообразный алгоритм
        let cpu = 25 + (Math.sin(Date.now() / 4000) * 8);
        let temp = 60 + (Math.cos(Date.now() / 5000) * 4);

        document.getElementById('cpu-num').textContent = Math.floor(cpu) + "%";
        document.getElementById('cpu-bar').style.width = cpu + "%";
        
        document.getElementById('temp-num').textContent = Math.floor(temp) + "°C";
        document.getElementById('temp-bar').style.width = temp + "%";
    }
}
setInterval(updateSensors, 2000); 

// КАРТА ОСТРОВА (ГЕНЕРАЦИЯ ТОЧЕК)
function openMap() {
    transitionTo('map-screen');
    const container = document.getElementById('node-map');
    container.innerHTML = "";
    
    // Координаты, описывающие форму твоего острова
    const islandPoints = [
        {x: 25, y: 45}, {x: 30, y: 35}, {x: 45, y: 30}, {x: 60, y: 32}, {x: 75, y: 40},
        {x: 85, y: 55}, {x: 90, y: 50}, {x: 92, y: 65}, {x: 82, y: 80}, {x: 65, y: 85},
        {x: 45, y: 78}, {x: 30, y: 75}, {x: 20, y: 60}
    ];

    islandPoints.forEach((p, i) => {
        setTimeout(() => {
            const node = document.createElement('div');
            node.className = 'node';
            node.style.left = p.x + "%";
            node.style.top = p.y + "%";
            container.appendChild(node);
        }, i * 50);
    });
}

// ЗАКРЫТИЕ КАРТЫ (С ПРОВЕРКОЙ ПРАВ)
function closeMap() {
    if (isAuthorized) {
        transitionTo('main-dashboard');
    } else {
        transitionTo('lobby-screen');
    }
}

// УПРАВЛЕНИЕ САЙДБАРОМ
function toggleSidebar(e) {
    e.stopPropagation();
    document.getElementById('side-panel').style.left = "0";
    document.getElementById('blur-shield').style.display = "block";
}

function closeSidebar() {
    document.getElementById('side-panel').style.left = "-350px";
    document.getElementById('blur-shield').style.display = "none";
}

// ЭФФЕКТ ПЕЧАТНОЙ МАШИНКИ ПРИ ЗАГРУЗКЕ
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
    function type() {
        if(i < art.length) {
            l.textContent += art[i++];
            setTimeout(type, 1);
        } else {
            // После завершения анимации переходим к логину
            setTimeout(() => transitionTo('login-screen'), 1000);
        }
    }
    type();
};
