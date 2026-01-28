const PROFILES = {
    "morisreal": { pass: "admin", lvl: 6, uuid: "X-882-GLOMG" },
    "sumber":    { pass: "0000", lvl: 5, uuid: "X-104-GLOMG" },
    "msk4ne_":   { pass: "0000", lvl: 4, uuid: "X-201-GLOMG" },
    "dykzxz":    { pass: "0000", lvl: 4, uuid: "X-202-GLOMG" },
    "shmegh1":   { pass: "0000", lvl: 4, uuid: "X-203-GLOMG" }
};

function startSystemBoot() {
    const loader = document.getElementById('boot-loader');
    loader.classList.remove('fade-to-black');
    // Тут сработает логика, которая у тебя прописана в window.onload
}

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
    // Скрываем все окна
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.add('hidden');
    });
    
    // Показываем целевое
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.remove('hidden');
        // Принудительная прокрутка вверх при входе
        target.scrollTop = 0;
    }
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
    // ВАЖНО: Берем ID из твоего HTML
    const loginInput = document.getElementById('login-id');
    const passInput = document.getElementById('login-pass');
    
    if (!loginInput || !passInput) return;

    const user = loginInput.value.trim().toLowerCase();
    const pass = passInput.value.trim();

    if (PROFILES[user]) {
        if (PROFILES[user].pass === pass) {
            // Сохраняем данные пользователя глобально
            currentUser = {
                name: user.toUpperCase(),
                lvl: PROFILES[user].lvl,
                uuid: PROFILES[user].uuid
            };
            
            localStorage.setItem('opName', user);
            
            // Обновляем текст в кабинете сразу
            const opDisplay = document.getElementById('op-name');
            if (opDisplay) opDisplay.innerText = currentUser.name;

            // Запускаем загрузку
            document.getElementById('scr-login').classList.add('hidden');
            document.getElementById('boot-loader').style.display = 'block';
            
            // Запускаем твою анимацию (она у тебя в window.onload, но вызовем её вручную или через триггер)
            startSystemBoot(); 
        } else {
            alert("ACCESS_DENIED: НЕВЕРНЫЙ ПАРОЛЬ");
        }
    } else {
        alert("ACCESS_DENIED: ПОЛЬЗОВАТЕЛЬ НЕ НАЙДЕН");
    }
}

    const name = input.value.trim().toLowerCase();
    
    if (name.length >= 3) {
        // Сохраняем имя
        localStorage.setItem('opName', name);
        
        // Обновляем текст в личном кабинете
        const opDisplay = document.getElementById('op-name');
        if (opDisplay) opDisplay.innerText = name.toUpperCase();

        // Запускаем анимацию загрузки
        startBootSequence(); 
    } else {
        alert("ОШИБКА ДОСТУПА: Имя слишком короткое");
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

function loadDoc(type) {
    const title = document.getElementById('doc-title');
    const body = document.getElementById('doc-body');
    
    if(type === 'echo') {
        title.innerText = 'АРХИВ НИД: ОБЪЕКТ "ЭХО"';
        body.innerText = 'АКУСТИЧЕСКАЯ АНОМАЛИЯ. ТРЕБУЕТСЯ УРОВЕНЬ 2 ДЛЯ РАСШИФРОВКИ ЛОГОВ.';
    }
    // Добавь другие условия для отчетов
}

function updateBriefing(name) {
    const briefing = document.querySelector('.staff-briefing p');
    if (name.toLowerCase() === 'sumber') {
        briefing.innerHTML = "<strong>СТАТУС: АДМИНИСТРАТОР P.R.I.S.M.</strong> Ваша задача — полный контроль за распределением энергии реактора.";
    } else {
        briefing.innerHTML = "<strong>СТАТУС: СОТРУДНИК ONG.</strong> Используйте терминал для мониторинга закрепленных за вами объектов.";
    }
}

// Добавь сюда свои функции handleAuth() и initDashboard()

// Сюда будем добавлять функции для Почты, Радара и т.д.

// [/JS_ID: NEW_FUNCTIONS_ZONE]
