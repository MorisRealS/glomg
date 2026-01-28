// [JS_ID: PROFILES_DATA]
const PROFILES = {
    "morisreal": { name: "MorisReal", pass: "admin", lvl: 6, uuid: "X-882-GLOMG" },
    "sumber":    { name: "Sumber", pass: "0000", lvl: 5, uuid: "X-104-GLOMG" },
    "msk4ne_":   { name: "Msk4ne_", pass: "0000", lvl: 4, uuid: "X-201-GLOMG" },
    "dykzxz":    { name: "Dykzxz", pass: "0000", lvl: 4, uuid: "X-202-GLOMG" },
    "shmegh1":   { name: "shmegh1", pass: "0000", lvl: 4, uuid: "X-203-GLOMG" }
};

const accessLevels = {
    "morisreal": 6,
    "sumber": 5,
    "msk4ne_": 4,
    "dykzxz": 4,
    "shmegh1": 4
};

function checkAccess(user) {
    const level = accessLevels[user.toLowerCase()] || 1;
    localStorage.setItem('accessLevel', level);
    // В архиве можно скрывать папки, если уровень ниже нужного
    if(level < 4) document.querySelector('.tactical-sector').style.display = 'none';
}
// [/JS_ID: PROFILES_DATA]

let currentUser = null;
const socket = io();

// [JS_ID: CORE_LOGIC]
function goTo(screenId) {
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    // Показываем нужный
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.remove('hidden');
    } else {
        console.error("G.L.O.M.G. Error: Screen not found - " + screenId);
    }
    // Закрываем меню если было открыто
    toggleSidebar(false);
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
    const loader = document.getElementById('boot-loader');
    const logo = document.getElementById('boot-stage-logo');
    const terminal = document.getElementById('boot-stage-terminal');
    const termText = document.getElementById('boot-text-full');

    // 30 строк в стиле Major Group / G.L.O.M.G.
    const logs = [
        "INITIALIZING G.L.O.M.G. CORE v8.8.2...",
        "LOADING BIOS... OK",
        "DETECTING ONG_NETWORK_ADAPTER... CONNECTED",
        "SCANNING SYSTEM MEMORY... 64GB OK",
        "ERROR: UNKNOWN_SECTOR_FOUND [0xAA12]",
        "ESTABLISHING SECURE_CONNECTION... SUCCESS",
        "DECRYPTING_NEURAL_INTERFACE...",
        "WARNING: LATENCY_DETECTED_IN_SYNAPTIC_LINK",
        "ERROR: CACHE_MISMATCH_IN_CORE",
        "SYSTEM_INTEGRITY: 98.4%",
        "ALL_SYSTEMS_NOMINAL.",
        "G.L.O.M.G. CORE READY."
    ];

    // Функция посимвольной печати строки
    function typeLine(text, callback) {
        let line = document.createElement('div');
        if (text.includes('ERROR')) line.className = 'text-red';
        else if (text.includes('WARNING')) line.className = 'text-yellow';
        else if (text.includes('G.L.O.M.G.') || text.includes('ONG')) line.className = 'text-purple';
        
        termText.appendChild(line);
        let charIdx = 0;
        
        function charStep() {
            if (charIdx < text.length) {
                line.innerHTML += text[charIdx];
                charIdx++;
                setTimeout(charStep, 10); // Скорость печати букв
            } else {
                callback();
            }
        }
        charStep();
    }

    function runTerminal(idx) {
        if (idx < logs.length) {
            typeLine(`> ${logs[idx]}`, () => {
                // Маленькая пауза перед следующей строкой
                setTimeout(() => runTerminal(idx + 1), 50);
            });
        } else {
            // ФИНАЛ: Переход через затемнение
            setTimeout(() => {
                loader.classList.add('fade-to-black'); // Плавно чернеет
                setTimeout(() => {
                    loader.style.display = "none";
                }, 1500);
            }, 1000);
        }
    }

    // ПОСЛЕДОВАТЕЛЬНОСТЬ
    setTimeout(() => {
        logo.style.opacity = "1"; // Показываем ASCII
        setTimeout(() => {
            logo.style.opacity = "0"; // Затемняем лого
            setTimeout(() => {
                logo.classList.remove('active');
                terminal.classList.add('active');
                terminal.style.opacity = "1";
                runTerminal(0); // Запуск консоли
            }, 800);
        }, 3000);
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

function openProfile() {
    // Сначала закрываем боковое меню
    toggleSidebar(false);
    
    // Заполняем данные (пример)
    const opName = localStorage.getItem('opName') || "OPERATOR";
    document.getElementById('prof-nick').innerText = opName.toUpperCase();
    document.getElementById('prof-uuid').innerText = "G-8821-" + Math.floor(Math.random() * 9000);
    
    if(opName.toLowerCase() === 'sumber') {
        document.getElementById('prof-div').innerText = "P.R.I.S.M.";
        document.getElementById('prof-rank').innerText = "DIVISION_HEAD";
    }

    // Активируем оверлей
    document.getElementById('modal-profile').classList.add('active');
}

function closeProfile() {
    document.getElementById('modal-profile').classList.remove('active');
}

// Закрытие по клику на пустое место (вне карточки)
function closeProfileOutside(event) {
    const card = document.getElementById('profile-card');
    // Если кликнули именно по фону, а не по карточке
    if (!card.contains(event.target)) {
        closeProfile();
    }
}

const pointData = {
    bunker: {
        title: "Бункер P.R.I.S.M",
        owner: "SumberTheCreator",
        uuid: "PRISM-01-SUMB",
        desc: "Автономное подземное хранилище. Укрепленный сектор управления."
    },
    lab: {
        title: "Лаборатория ONG",
        owner: "MorisReal",
        uuid: "ONG-LAB-772",
        desc: "Исследовательский центр био-синтетических аномалий."
    },
    reactor: {
        title: "Реактор ONG",
        owner: "Dykzxz",
        uuid: "ONG-PWR-990",
        desc: "Основной источник энергии для систем G.L.O.M.G."
    }
};

function showPoint(id) {
    const data = pointData[id];
    const infoBox = document.getElementById('point-info');
    infoBox.innerHTML = `
        <h3>Название: ${data.title}</h3>
        <p><strong>Владелец:</strong> ${data.owner}</p>
        <p><strong>UUID:</strong> ${data.uuid}</p>
        <p><strong>Описание:</strong> ${data.desc}</p>
    `;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function updateSensors() {
    const sensors = {
        temp: { el: 'val-temp', base: 40, var: 5 },
        cpu: { el: 'val-cpu', base: 20, var: 15 },
        ram: { el: 'val-ram', base: 45, var: 3 },
        stab: { el: 'val-stab', base: 99, var: 0.5 }
    };

    for (let key in sensors) {
        let change = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * sensors[key].var);
        let newVal = (sensors[key].base + change).toFixed(1);
        document.getElementById(sensors[key].el).innerText = newVal;
    }
    setTimeout(updateSensors, 1500);
}
updateSensors();

// Добавь сюда свои функции handleAuth() и initDashboard()

// Сюда будем добавлять функции для Почты, Радара и т.д.

// [/JS_ID: NEW_FUNCTIONS_ZONE]
