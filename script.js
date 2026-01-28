// [JS_ID: PROFILES_DATA]
const PROFILES = {
    "morisreal": { name: "MorisReal", pass: "admin", lvl: 6, uuid: "X-882-GLOMG" },
    "sumber":    { name: "Sumber", pass: "0000", lvl: 5, uuid: "X-104-GLOMG" },
    "msk4ne_":   { name: "Msk4ne_", pass: "0000", lvl: 4, uuid: "X-201-GLOMG" },
    "dykzxz":    { name: "Dykzxz", pass: "0000", lvl: 4, uuid: "X-202-GLOMG" },
    "shmegh1":   { name: "shmegh1", pass: "0000", lvl: 4, uuid: "X-203-GLOMG" }
};
// [/JS_ID: PROFILES_DATA]

let currentUser = null;
const socket = io();

// [JS_ID: CORE_LOGIC]
function goTo(screenId) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(screenId).classList.remove('hidden');
        fade.classList.remove('active');
    }, 500);
}

function typeText(text, id, delay = 0) {
    const el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = "";
    setTimeout(() => {
        let i = 0;
        let interval = setInterval(() => {
            if(i < text.length) { el.innerHTML += text.charAt(i); i++; }
            else clearInterval(interval);
        }, 40);
    }, delay);
}

function closeAllPanels() {
    document.getElementById('side-overlay').classList.remove('open');
    if(document.getElementById('sidebar')) document.getElementById('sidebar').classList.remove('open');
}

// НОВАЯ ФУНКЦИЯ АВТОРИЗАЦИИ
function handleAuth() {
    const login = document.getElementById('login-id').value.toLowerCase();
    const pass = document.getElementById('login-pass').value;

    if (PROFILES[login] && PROFILES[login].pass === pass) {
        currentUser = PROFILES[login];
        goTo('scr-dash');
        socket.emit('auth', currentUser.name);
        initDashboard(); // Запуск наполнения кабинета данными
    } else {
        alert("ОШИБКА: НЕВЕРНЫЙ ID ИЛИ ПАРОЛЬ");
        document.getElementById('login-pass').value = "";
    }
}

// Слушатель для нажатия Enter в поле пароля
document.getElementById('login-pass').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAuth();
});
// [/JS_ID: CORE_LOGIC]


// [JS_ID: NEW_FUNCTIONS_ZONE]

function toggleGuestAI() {
    const body = document.getElementById('guest-ai-body');
    const textId = 'guest-ai-text';
    
    // Переключаем класс для анимации раскрытия
    body.classList.toggle('open');
    
    // Если открыли — печатаем текст с задержкой
    if(body.classList.contains('open')) {
        const message = "Обнаружен поврежденный сектор... Я — ИИ серии G7. Мои архивы пусты на 98%, но я помню систему G.L.O.M.G. до великого сбоя...";
        
        // Очищаем старый текст перед новой печатью
        document.getElementById(textId).innerHTML = "";
        
        // Задержка 1.5 секунды (1500 мс) перед появлением букв
        typeText(message, textId, 1500);
    }
}

// 1. Функция для работы системных часов
function updateClock() {
    const clockElements = document.querySelectorAll('.clock-val');
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU', { hour12: false });
    
    clockElements.forEach(el => {
        el.innerText = timeString;
    });
}

// Запускаем часы каждую секунду
setInterval(updateClock, 1000);
updateClock(); // Инициализация сразу


// 2. Рандомные VHS помехи (необязательно, но круто для атмосферы)
// Раз в 3-7 секунд экран будет "дергаться" на мгновение
function triggerVHSGlitch() {
    const overlay = document.querySelector('.vhs-overlay');
    if (!overlay) return;

    const chance = Math.random();
    if (chance > 0.8) {
        overlay.style.opacity = "0.8";
        setTimeout(() => { overlay.style.opacity = "1"; }, 150);
    }
}
setInterval(triggerVHSGlitch, 3000);

// ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ КАБИНЕТА
function initDashboard() {
    if (!currentUser) return;

    // Заполняем данные на экране кабинета
    if(document.getElementById('op-name')) document.getElementById('op-name').innerText = currentUser.name;
    if(document.getElementById('op-uuid')) document.getElementById('op-uuid').innerText = currentUser.uuid;
    if(document.getElementById('op-lvl')) document.getElementById('op-lvl').innerText = currentUser.lvl;

    // Запускаем приветствие ИИ
    const welcomeMsg = `> СИСТЕМА: Авторизация завершена. Оператор ${currentUser.name}, протоколы CORE активны.`;
    typeText(welcomeMsg, 'dash-ai-text', 1000);
}
// Обнови функцию closeAllPanels, чтобы она убирала размытие
function closeAllPanels() {
    toggleSidebar(false);
}

// В функции initDashboard замени текст на фиолетовый приветственный
function initDashboard() {
    if (!currentUser) return;
    document.getElementById('op-name').innerText = currentUser.name;
    const msg = `> СИСТЕМА: Авторизация завершена. Оператор ${currentUser.name}, протоколы CORE активны. Ожидаю указаний...`;
    typeText(msg, 'dash-ai-text', 1000);
}

function toggleSidebar(open) {
    const sb = document.getElementById('sidebar');
    const overlay = document.getElementById('side-overlay');
    const dash = document.getElementById('scr-dash');

    if (open) {
        sb.classList.add('open');
        overlay.classList.add('active');
        if(dash) dash.classList.add('blurred');
    } else {
        sb.classList.remove('open');
        overlay.classList.remove('active');
        if(dash) dash.classList.remove('blurred');
    }
}

window.onload = function() {
    const bootLoader = document.getElementById('boot-loader');
    const logoStage = document.getElementById('boot-stage-logo');
    const termStage = document.getElementById('boot-stage-terminal');
    const termText = document.getElementById('boot-text-full');

    const bootLines = [
        "G.L.O.M.G. CORE_OS [BUILD 8.8.2.0]",
        "GLOBAL LABORATORY OF MAJOR GROUP",
        "CONNECTING TO: ONG_NETWORK... OK",
        "ERROR: SYNAPTIC_DATABASE_CORRUPTION",
        "WARNING: SECURITY_PROTOCOL_ACTIVE",
        "LOADING_MODULE: SCIENTIFIC_RESEARCH... OK",
        "G.L.O.M.G. READY. SYSTEMS: NOMINAL"
    ];

    function typeText(lines, index, callback) {
        if (index < lines.length) {
            let div = document.createElement('div');
            if (lines[index].includes('ERROR')) div.className = 'text-red';
            else if (lines[index].includes('WARNING')) div.className = 'text-yellow';
            else if (lines[index].includes('G.L.O.M.G.')) div.className = 'text-purple';
            
            div.innerHTML = `> ${lines[index]}`;
            termText.appendChild(div);
            setTimeout(() => typeText(lines, index + 1, callback), 100);
        } else {
            setTimeout(callback, 1000);
        }
    }

    // 1. Показываем ASCII логотип
    setTimeout(() => {
        logoStage.style.opacity = "1";
        
        // 2. Уходим в затемнение через 2 секунды
        setTimeout(() => {
            logoStage.style.opacity = "0";
            
            setTimeout(() => {
                logoStage.classList.remove('active');
                termStage.classList.add('active');
                termStage.style.opacity = "1";
                
                // 3. Печатаем консоль на весь экран
                typeText(bootLines, 0, () => {
                    // 4. Финальное плавное затемнение перед логином
                    bootLoader.style.backgroundColor = "#000";
                    bootLoader.style.opacity = "0";
                    setTimeout(() => bootLoader.style.display = "none", 1200);
                });
            }, 600); 
        }, 2000);
    }, 500);
};

function toggleSidebar(open) {
    const sb = document.getElementById('sidebar');
    const overlay = document.getElementById('side-overlay');
    const dash = document.getElementById('scr-dash');
    if (open) {
        sb.classList.add('open');
        overlay.classList.add('active');
        if (dash) dash.classList.add('blurred');
    } else {
        sb.classList.remove('open');
        overlay.classList.remove('active');
        if (dash) dash.classList.remove('blurred');
    }
}

// Добавь сюда свои функции handleAuth() и initDashboard()

// Сюда будем добавлять функции для Почты, Радара и т.д.

// [/JS_ID: NEW_FUNCTIONS_ZONE]
