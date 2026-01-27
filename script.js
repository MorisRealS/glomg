const PROFILES = {
    "morisreal": { name: "MorisReal", pass: "admin", lvl: 6, uuid: "X-882-GLOMG" },
    "sumber":    { name: "Sumber", pass: "0000", lvl: 5, uuid: "X-104-GLOMG" }
};

let currentUser = null;
const socket = io();

// Плавный переход между экранами
function goTo(screenId) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(screenId).classList.remove('hidden');
        fade.classList.remove('active');
    }, 500);
}

// Побуквенная печать
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

// Закрытие панелей
function closeAllPanels() {
    document.getElementById('side-overlay').classList.remove('open');
}

// Логика ввода (ID и PASS)
document.getElementById('cmd').addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        const val = e.target.value.toLowerCase();
        if(!currentUser && PROFILES[val]) {
            currentUser = PROFILES[val];
            document.querySelector('.prompt').innerText = "PASS:> ";
            e.target.value = ""; e.target.type = "password";
        } else if(currentUser && val === currentUser.pass) {
            goTo('scr-dash');
            socket.emit('auth', currentUser.name);
        }
    }
});


// ТУТ БУДУТ НОВЫЕ ФУНКЦИИ (ОТПРАВКА ПОЧТЫ, РАДАР)
