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
        } else {
            // Сброс при ошибке
            currentUser = null;
            document.querySelector('.prompt').innerText = "ID:> ";
            e.target.value = ""; e.target.type = "text";
        }
    }
});
// [/JS_ID: CORE_LOGIC]


// [JS_ID: NEW_FUNCTIONS_ZONE]

// Сюда будем добавлять функции для Почты, Радара и т.д.

// [/JS_ID: NEW_FUNCTIONS_ZONE]
