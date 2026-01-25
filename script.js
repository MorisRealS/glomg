const PROFILES = {
    "kiddy": { pass: "1111", name: "KIDDY" },
    "dykzxz": { pass: "2222", name: "DYKZXZ" },
    "msk4ne_": { pass: "3333", name: "MSK4NE" },
    "sumber": { pass: "4444", name: "SUMBER" },
    "krimpi": { pass: "5555", name: "KRIMPI" }
};

const output = document.getElementById('output');
const cmdInput = document.getElementById('cmd');
const glitch = document.getElementById('glitch-layer');

// 4. Пафосная загрузка текста
async function startBoot() {
    const lines = [
        "BOOTING ONG_OS...",
        "KERNEL_VOLTA_REV_04 LOADED",
        "CONNECTING TO THE GRID................ DONE",
        "WARNING: SECURE CONNECTION ONLY",
        "PLEASE AUTHORIZE:"
    ];

    for (let line of lines) {
        let p = document.createElement('div');
        p.textContent = "> " + line;
        p.style.marginBottom = "10px";
        output.appendChild(p);
        await new Promise(r => setTimeout(r, 600)); // Задержка между строками
    }
    document.getElementById('input-container').classList.remove('hidden');
    cmdInput.focus();
}

setTimeout(startBoot, 1500); // Запуск после blackout

// Глитч эффект
setInterval(() => {
    glitch.classList.add('glitch-active');
    setTimeout(() => glitch.classList.remove('glitch-active'), 350);
}, 6000);

// Логика консоли
let state = "ID";
let currentUser = null;

cmdInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        let val = cmdInput.value.trim().toLowerCase();
        cmdInput.value = "";

        if (state === "ID") {
            if (PROFILES[val]) {
                currentUser = PROFILES[val];
                print("ID ACCEPTED. ENTER PASSCODE:");
                cmdInput.type = "password";
                state = "PASS";
            } else {
                print("ACCESS DENIED: UNKNOWN ID");
            }
        } else if (state === "PASS") {
            if (val === currentUser.pass) {
                print("SUCCESS. INITIALIZING DASHBOARD...");
                setTimeout(showMain, 1000);
            } else {
                print("CRITICAL ERROR: WRONG PASSWORD");
                setTimeout(() => location.reload(), 1000);
            }
        }
    }
});

function print(t) {
    let p = document.createElement('div');
    p.textContent = ">> " + t;
    output.appendChild(p);
}

// Переход на второе окно
function showMain() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-dashboard').classList.remove('hidden');
    document.getElementById('user-display').textContent = currentUser.name;
    // Убираем точки на второй странице
    document.querySelector('.halftone').style.display = 'none';
}

// 3. Плашка профиля
const menuBtn = document.getElementById('menu-btn');
const sidePanel = document.getElementById('side-panel');
const dark = document.getElementById('dark-overlay');

menuBtn.onclick = () => {
    sidePanel.classList.toggle('active');
    dark.style.display = sidePanel.classList.contains('active') ? 'block' : 'none';
};

dark.onclick = () => {
    sidePanel.classList.remove('active');
    dark.style.display = 'none';
};
