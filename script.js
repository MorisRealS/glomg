const PROFILES = {
    "kiddy": { pass: "1111", name: "KIDDY" },
    "dykzxz": { pass: "2222", name: "DYKZXZ" },
    "msk4ne_": { pass: "3333", name: "MSK4NE" }
};

const output = document.getElementById('output');
const cmdInput = document.getElementById('cmd');
const glitchLayer = document.getElementById('glitch-layer');

// 1. Плавное появление (Пафосный вход)
window.onload = () => {
    setTimeout(() => {
        document.querySelector('.terminal-wrapper').style.opacity = "1";
        runBootSequence();
    }, 1000);
};

// 2. Эффект глитча каждые 5-7 секунд
setInterval(() => {
    glitchLayer.classList.add('glitch-active');
    setTimeout(() => glitchLayer.classList.remove('glitch-active'), 300);
}, 6000);

// 3. Бегущие строки (Buckshot Roulette Style)
async function runBootSequence() {
    const lines = [
        "ONG_CORE V.3.1.24 INITIALIZING...",
        "CHECKING VOLTA_DRIVE... OK",
        "ESTABLISHING SECURE CONNECTION...",
        "DECRYPTING SEGMENTS...",
        "READY. ENTER IDENTIFIER."
    ];
    
    for (let line of lines) {
        let div = document.createElement('div');
        div.className = "line";
        div.textContent = "> " + line;
        output.appendChild(div);
        await new Promise(r => setTimeout(r, 400)); // Задержка строк
    }
    document.getElementById('input-line').classList.remove('hidden');
    cmdInput.focus();
}

// 4. Логика входа
let authStep = "ID";
let currentUser = null;

cmdInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const val = cmdInput.value.trim().toLowerCase();
        cmdInput.value = "";

        if (authStep === "ID") {
            if (PROFILES[val]) {
                currentUser = PROFILES[val];
                print(`> ID ACCEPTED: ${val.toUpperCase()}`);
                print("> ENTER PASSCODE:");
                cmdInput.type = "password";
                authStep = "PASS";
            }
        } else if (authStep === "PASS") {
            if (val === currentUser.pass) {
                print("> ACCESS GRANTED.");
                transitionToDashboard();
            }
        }
    }
});

function print(text) {
    const d = document.createElement('div');
    d.className = "line";
    d.textContent = text;
    output.appendChild(d);
}

// 5. Переход (Глюк полосами)
function transitionToDashboard() {
    glitchLayer.style.background = "white"; // Вспышка
    setTimeout(() => {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('halftone-layer').classList.add('hidden');
        document.getElementById('main-dashboard').classList.remove('hidden');
        document.getElementById('user-name-display').textContent = currentUser.name;
    }, 200);
}

// 6. Управление плашкой
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('profile-sidebar');
const darken = document.getElementById('overlay-darken');

menuBtn.onclick = () => {
    sidebar.classList.add('open');
    darken.style.display = 'block';
};

darken.onclick = () => {
    sidebar.classList.remove('open');
    darken.style.display = 'none';
};
