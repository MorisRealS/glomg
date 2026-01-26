/**
 * G.L.O.M.G. CORE v31.8
 * Скрипт управления интерфейсом и логикой
 */

// База данных доступа (Полная)
const AUTHORIZED_DATABASE = {
    "morisreal": { 
        password: "morisreal_profile_console", 
        level: 6, 
        rank: "CHIEF OPERATOR" 
    },
    "sumber": { 
        password: "SumberTheAdminPRISMS", 
        level: 5, 
        rank: "PRISMA OWNER" 
    },
    "dykzxz": { 
        password: "reactor_secure_77", 
        level: 4, 
        rank: "REACTOR ENGINEER" 
    },
    "msk4ne_": { 
        password: "operator_access_99", 
        level: 4, 
        rank: "SYSTEM OPERATOR" 
    }
};

// Глобальное состояние
let currentOperator = null;

/**
 * Функция плавного переключения экранов
 */
function transitionToScreen(targetId) {
    const fadeElement = document.getElementById('fade');
    
    // Активируем затемнение
    fadeElement.classList.add('active');
    
    setTimeout(function() {
        // Скрываем все экраны
        const allScreens = document.querySelectorAll('.screen');
        allScreens.forEach(function(screen) {
            screen.classList.add('hidden');
        });
        
        // Показываем нужный экран
        const targetScreen = document.getElementById(targetId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
        }
        
        // Закрываем сайдбар на всякий случай
        toggleSidebar(false);
        
        // Убираем затемнение
        fadeElement.classList.remove('active');
    }, 500);
}

/**
 * Обработка входа в систему
 */
function processLogin() {
    const inputId = document.getElementById('inp-id').value.toLowerCase().trim();
    const inputPass = document.getElementById('inp-pass').value.trim();
    
    const record = AUTHORIZED_DATABASE[inputId];
    
    if (record && record.password === inputPass) {
        // Успешный вход
        currentOperator = {
            name: inputId,
            level: record.level,
            rank: record.rank
        };
        
        // Обновляем UI данными оператора
        document.getElementById('u-lvl-display').textContent = currentOperator.level;
        document.getElementById('welcome-msg').textContent = "WELCOME, " + currentOperator.name.toUpperCase();
        
        transitionToScreen('scr-dash');
    } else {
        // Ошибка входа
        alert("ACCESS DENIED: Идентификатор или ключ неверны.");
        // Сброс полей
        document.getElementById('inp-pass').value = "";
    }
}

/**
 * Управление боковой панелью
 */
function toggleSidebar(isOpen) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('side-overlay');
    
    if (isOpen === true) {
        sidebar.classList.add('open');
        overlay.style.display = 'block';
    } else {
        sidebar.classList.remove('open');
        overlay.style.display = 'none';
    }
}

/**
 * Инициализация и отрисовка радара
 */
function initializeTacticalRadar() {
    transitionToScreen('scr-map');
    
    const nodesContainer = document.getElementById('radar-nodes');
    nodesContainer.innerHTML = ""; // Очистка старых точек
    
    // Точки на карте (Координаты в %)
    const points = [
        { x: 50, y: 50, label: "CENTRAL_CORE", desc: "Главный сервер G.L.O.M.G. Статус: Стабилен." },
        { x: 25, y: 30, label: "REACTOR_4", desc: "Энергоблок под управлением Dykzxz. Мощность: 94%." },
        { x: 70, y: 20, label: "PRISMA_NODE", desc: "Узел связи Sumber. Сигнал: Зашифрован." },
        { x: 40, y: 80, label: "STORAGE_V2", desc: "Архив данных. Доступность: 100%." }
    ];
    
    points.forEach(function(p) {
        const nodeElement = document.createElement('div');
        nodeElement.className = "node";
        nodeElement.style.left = p.x + "%";
        nodeElement.style.top = p.y + "%";
        
        // Клик по точке радара
        nodeElement.onclick = function() {
            document.getElementById('p-title').textContent = p.label;
            document.getElementById('p-text').innerHTML = p.desc + "<br><br>LOCATION_X: " + p.x + "<br>LOCATION_Y: " + p.y;
            
            // Плавный скролл вниз к информации
            const scrollWrapper = document.getElementById('radar-scroll');
            scrollWrapper.scrollTo({
                top: 600,
                behavior: 'smooth'
            });
        };
        
        nodesContainer.appendChild(nodeElement);
    });
}

/**
 * Обработка команд терминала
 */
function handleTerminalCommand(event) {
    if (event.key === 'Enter') {
        const output = document.getElementById('terminal-out');
        const inputField = document.getElementById('terminal-input');
        const cmd = inputField.value.trim();
        
        if (cmd === "") return;
        
        // Эхо команды
        const cmdLine = document.createElement('div');
        cmdLine.style.marginBottom = "5px";
        cmdLine.textContent = "> " + cmd;
        output.appendChild(cmdLine);
        
        // Ответ системы
        const responseLine = document.createElement('div');
        responseLine.style.color = "#666";
        responseLine.style.marginBottom = "15px";
        
        // Мини-логика команд
        if (cmd.toLowerCase() === "help") {
            responseLine.textContent = "Доступные команды: help, clear, status, nodes, logout";
        } else if (cmd.toLowerCase() === "clear") {
            output.innerHTML = "";
            inputField.value = "";
            return;
        } else if (cmd.toLowerCase() === "status") {
            responseLine.textContent = "SYSTEM_OK. OPERATOR: " + (currentOperator ? currentOperator.name : "GUEST");
        } else {
            responseLine.textContent = "Команда '" + cmd + "' не распознана ядром.";
        }
        
        output.appendChild(responseLine);
        
        // Скролл в конец
        inputField.value = "";
        output.scrollTop = output.scrollHeight;
    }
}

/**
 * Цикл логов для режима гостя
 */
setInterval(function() {
    const guestConsole = document.getElementById('guest-console');
    const isGuestVisible = !document.getElementById('scr-guest').classList.contains('hidden');
    
    if (guestConsole && isGuestVisible) {
        const logEntry = document.createElement('div');
        const timestamp = new Date().toLocaleTimeString();
        const actions = ["SYNC_DATA", "PING_NODE", "CHECK_FIREWALL", "REFRESH_CACHE", "QUERY_DB"];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const randomNode = Math.floor(Math.random() * 255);
        
        logEntry.textContent = "[" + timestamp + "] " + randomAction + " on 192.168.1." + randomNode + "... OK";
        
        // Добавляем в начало
        guestConsole.prepend(logEntry);
        
        // Ограничиваем количество строк
        if (guestConsole.childNodes.length > 25) {
            guestConsole.lastChild.remove();
        }
    }
}, 1200);

/**
 * Обновление системных часов
 */
setInterval(function() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    
    if (document.getElementById('clock')) {
        document.getElementById('clock').textContent = timeStr;
    }
    if (document.getElementById('radar-clock')) {
        document.getElementById('radar-clock').textContent = timeStr;
    }
}, 1000);

/**
 * Анимация загрузки при старте
 */
window.onload = function() {
    const introPre = document.getElementById('intro-ascii');
    const introText = "G.L.O.M.G. CORE v31.8\n\nBOOTING_KERNEL...\nLOADING_UI_MODULES...\nESTABLISHING_ENCRYPTED_TUNNEL...\nSYSTEM_READY.";
    let charIndex = 0;
    
    const typingInterval = setInterval(function() {
        introPre.textContent += introText[charIndex];
        charIndex++;
        
        if (charIndex >= introText.length) {
            clearInterval(typingInterval);
            
            // Показываем логотип
            document.getElementById('intro-logo').classList.remove('hidden');
            
            // Через паузу переходим к логину
            setTimeout(function() {
                transitionToScreen('scr-login');
            }, 2500);
        }
    }, 40);
};
