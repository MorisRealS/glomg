/* --- СИСТЕМНАЯ БАЗА ДАННЫХ --- */
const CORE_DATABASE = {
    "morisreal": {
        "pass": "morisreal_profile_console",
        "lvl": 6,
        "rank": "CHIEF OPERATOR",
        "title": "ЛИЧНАЯ ЛАБОРАТОРИЯ"
    },
    "sumber": {
        "pass": "SumberTheAdminPRISMS",
        "lvl": 5,
        "rank": "PRISMA OWNER",
        "title": "БУНКЕР ПРИЗМЫ"
    }
};

let activeSession = null;

/* --- ПЕРЕХОДЫ --- */
function transitionToScreen(id) {
    const fade = document.getElementById('fade');
    fade.classList.add('active');
    
    setTimeout(function() {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(function(s) {
            s.classList.add('hidden');
        });
        
        const target = document.getElementById(id);
        if (target) {
            target.classList.remove('hidden');
        }
        
        toggleSidebar(false);
        fade.classList.remove('active');
    }, 500);
}

/* --- ЛОГИКА ВХОДА --- */
function processLogin() {
    const user = document.getElementById('inp-id').value.toLowerCase();
    const pass = document.getElementById('inp-pass').value;
    
    const dbEntry = CORE_DATABASE[user];
    
    if (dbEntry && dbEntry.pass === pass) {
        activeSession = {
            id: user,
            lvl: dbEntry.lvl,
            rank: dbEntry.rank,
            title: dbEntry.title
        };
        
        document.getElementById('u-lvl-display').textContent = activeSession.lvl;
        document.getElementById('welcome-msg').textContent = "WELCOME, " + user.toUpperCase();
        transitionToScreen('scr-dash');
    } else {
        alert("ACCESS DENIED: INVALID_KEY");
    }
}

/* --- ТАКТИЧЕСКИЙ РАДАР --- */
function initializeTacticalRadar() {
    transitionToScreen('scr-map');
    
    const nodeContainer = document.getElementById('radar-nodes');
    nodeContainer.innerHTML = ""; // Очистка перед отрисовкой
    
    const points = [
        { x: 50, y: 50, owner: "morisreal", type: "owner" },
        { x: 30, y: 45, owner: "sumber", type: "online" }
    ];
    
    points.forEach(function(p) {
        const dot = document.createElement('div');
        dot.className = "node " + p.type;
        dot.style.left = p.x + "%";
        dot.style.top = p.y + "%";
        
        dot.onclick = function() {
            document.getElementById('p-title').textContent = p.owner.toUpperCase();
            const text = document.getElementById('p-text');
            
            if (p.owner === activeSession.id) {
                text.innerHTML = "<b>STATUS:</b> ACTIVE<br><b>LOCATION:</b> " + activeSession.title;
            } else {
                text.innerHTML = "<b>STATUS:</b> PROTECTED<br><b>DATA:</b> ACCESS_RESTRICTED";
            }
            
            // Скролл вниз к блоку информации
            const scrollBox = document.getElementById('radar-scroll');
            scrollBox.scrollTo({
                top: 600,
                behavior: 'smooth'
            });
        };
        
        nodeContainer.appendChild(dot);
    });
}

/* --- САЙДБАР --- */
function toggleSidebar(state) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('side-overlay');
    
    if (state === true) {
        sidebar.classList.add('open');
        overlay.style.display = 'block';
    } else {
        sidebar.classList.remove('open');
        overlay.style.display = 'none';
    }
}

/* --- ТЕРМИНАЛ --- */
function handleTerminalCommand(e) {
    if (e.key === 'Enter') {
        const out = document.getElementById('terminal-out');
        const inp = document.getElementById('terminal-input');
        
        const userLine = document.createElement('div');
        userLine.textContent = "> root@glomg:~# " + inp.value;
        out.appendChild(userLine);
        
        const sysLine = document.createElement('div');
        sysLine.style.color = "#666";
        sysLine.textContent = "Processing '" + inp.value + "'... Error: Command not found.";
        out.appendChild(sysLine);
        
        inp.value = "";
        out.scrollTop = out.scrollHeight;
    }
}

/* --- ТАЙМЕРЫ --- */
setInterval(function() {
    const time = new Date().toLocaleTimeString();
    if (document.getElementById('clock')) {
        document.getElementById('clock').textContent = time;
    }
    if (document.getElementById('radar-clock')) {
        document.getElementById('radar-clock').textContent = time;
    }
}, 1000);

/* --- ЗАПУСК ИНТРО --- */
window.onload = function() {
    const intro = document.getElementById('intro-ascii');
    const msg = "G.L.O.M.G. CORE v29.5\nLINKING_TO_DATABASE...\nSECURITY_READY.";
    let i = 0;
    
    const type = setInterval(function() {
        intro.textContent += msg[i];
        i++;
        if (i >= msg.length) {
            clearInterval(type);
            document.getElementById('intro-logo').classList.remove('hidden');
            setTimeout(function() {
                transitionToScreen('scr-login');
            }, 2500);
        }
    }, 50);
};
