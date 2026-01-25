const PROFILES = {
    "morisreal": { pass: "1111", name: "MORIS REAL" },
    "kiddy": { pass: "2222", name: "KIDDY" },
    "dykzxz": { pass: "3333", name: "DYKZXZ" },
    "msk4ne_": { pass: "4444", name: "MSK4NE" }
};

// Логотип в стиле VOLTA (Buckshot Roulette)
const voltaLogo = [
    " ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ ",
    "██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ ",
    "██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗",
    "██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║",
    "╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝",
    " ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ ",
    "      ++ SYSTEM TYPE: VOLTA_OS_v4 ++          "
];

const logoContainer = document.getElementById('logo-container');
const output = document.getElementById('output');
const cmdInput = document.getElementById('cmd');
const glitch = document.getElementById('glitch-layer');

// Посимвольный вывод текста
async function typeText(text, target, speed = 30) {
    const line = document.createElement('div');
    line.className = "line";
    target.appendChild(line);
    for (let char of text) {
        line.textContent += char;
        await new Promise(r => setTimeout(r, speed));
    }
}

async function bootSequence() {
    // Печать логотипа VOLTA
    for (let line of voltaLogo) {
        logoContainer.textContent += line + "\n";
        await new Promise(r => setTimeout(r, 60));
    }
    
    await new Promise(r => setTimeout(r, 800));
    await typeText("> INITIALIZING MEMORY CHECK...", output, 20);
    await typeText("> LOADING ONG_CORE SEGMENTS...", output, 40);
    await typeText("> IDENTIFICATION REQUIRED:", output, 20);
    
    document.getElementById('input-line').classList.remove('hidden');
    cmdInput.focus();
}

// Глитч эффект (тонкая полоса)
setInterval(() => {
    glitch.classList.add('glitch-active');
    setTimeout(() => glitch.classList.remove('glitch-active'), 250);
}, 7000);

let stage = "ID";
let activeUser = null;

cmdInput.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        let val = cmdInput.value.trim().toLowerCase();
        cmdInput.value = "";

        if (stage === "ID") {
            if (PROFILES[val]) {
                activeUser = PROFILES[val];
                await typeText(`> ID [${val.toUpperCase()}] ACCEPTED.`, output, 20);
                await typeText("> ENTER SECURE PASSCODE:", output, 20);
                cmdInput.type = "password";
                stage = "PASS";
            } else {
                await typeText("> ACCESS ERROR: ID NOT RECOGNIZED.", output, 20);
            }
        } else if (stage === "PASS") {
            if (val === activeUser.pass) {
                await typeText("> ACCESS GRANTED. SYNCHRONIZING...", output, 20);
                setTimeout(enterSystem, 1000);
            } else {
                await typeText("> CRITICAL: INCORRECT PASSCODE.", output, 10);
                setTimeout(() => location.reload(), 1200);
            }
        }
    }
});

function enterSystem() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-dashboard').classList.remove('hidden');
    document.getElementById('user-display').textContent = activeUser.name;
    // На второй странице глитч можно сделать реже или мягче
}

// Запуск при загрузке
setTimeout(bootSequence, 1000);

// Меню профиля
const trigger = document.getElementById('menu-trigger');
const panel = document.getElementById('side-panel');
const blur = document.getElementById('panel-blur');

trigger.onclick = () => {
    panel.classList.toggle('active');
    blur.style.display = panel.classList.contains('active') ? 'block' : 'none';
};

blur.onclick = () => {
    panel.classList.remove('active');
    blur.style.display = 'none';
};
