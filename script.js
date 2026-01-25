const PROFILES = {
    "morisreal": { pass: "1111", name: "MORIS REAL" },
    "kiddy": { pass: "2222", name: "KIDDY" },
    "dykzxz": { pass: "3333", name: "DYKZXZ" },
    "msk4ne_": { pass: "4444", name: "MSK4NE" }
};

const voltaLogo = `
 ██████╗ ██╗      ██████╗ ███╗   ███╗ ██████╗ 
██╔════╝ ██║     ██╔════╝ ████╗ ████║██╔════╝ 
██║  ███╗██║     ██║  ███╗██╔████╔██║██║  ███╗
██║   ██║██║     ██║   ██║██║╚██╔╝██║██║   ██║
╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ `;

async function boot() {
    const logoEl = document.getElementById('big-logo');
    for (let char of voltaLogo) {
        logoEl.textContent += char;
        await new Promise(r => setTimeout(r, 2));
    }
    await new Promise(r => setTimeout(r, 2000));
    openWindow('login-screen');
}

function openWindow(id) {
    document.getElementById('fade-overlay').classList.add('fade-active');
    document.getElementById('side-panel').classList.remove('active');
    document.getElementById('panel-blur-overlay').style.display = "none";

    setTimeout(() => {
        // Прячем абсолютно все экраны
        document.querySelectorAll('.screen, #intro-screen').forEach(s => s.classList.add('hidden'));
        
        // Показываем нужный
        const nextWindow = document.getElementById(id);
        nextWindow.classList.remove('hidden');
        
        document.getElementById('fade-overlay').classList.remove('fade-active');

        // ПРИНУДИТЕЛЬНЫЙ ФОКУС
        if (id === 'login-screen') {
            startLoginAuth();
        } else if (id === 'full-console-screen') {
            document.getElementById('main-console-input').focus();
        }
    }, 600);
}

// Авторизация
const cmdInput = document.getElementById('cmd');
let stage = "ID", activeUser = null;

async function startLoginAuth() {
    const out = document.getElementById('auth-output');
    out.innerHTML = "";
    const lines = ["> ONG_CORE_SYSTEM v.4.0.1", "> ВВЕДИТЕ ВАШ ИДЕНТИФИКАТОР:"];
    for (let l of lines) {
        let d = document.createElement('div');
        out.appendChild(d);
        for(let c of l) { d.textContent += c; await new Promise(r => setTimeout(r, 20)); }
    }
    document.getElementById('input-line').classList.remove('hidden');
    cmdInput.focus();
}

cmdInput.onkeydown = (e) => {
    if (e.key === "Enter") {
        let val = cmdInput.value.trim().toLowerCase();
        cmdInput.value = "";
        
        if (stage === "ID") {
            if (PROFILES[val]) {
                activeUser = PROFILES[val];
                stage = "PASS";
                printLine(`> ИДЕНТИФИЦИРОВАН: ${val.toUpperCase()}. ВВЕДИТЕ ПАРОЛЬ:`);
            }
        } else if (stage === "PASS") {
            if (val === activeUser.pass) {
                document.getElementById('user-display').textContent = activeUser.name;
                openWindow('main-dashboard');
            } else {
                location.reload();
            }
        }
    }
}

function printLine(t) {
    const d = document.createElement('div');
    d.textContent = t;
    document.getElementById('auth-output').appendChild(d);
}

// Полноэкранная консоль
const mainIn = document.getElementById('main-console-input');
const mainOut = document.getElementById('main-console-output');

mainIn.onkeydown = (e) => {
    if (e.key === "Enter") {
        let val = mainIn.value.trim().toLowerCase();
        mainIn.value = "";
        if (val === "exit") {
            openWindow('main-dashboard');
        } else {
            const d = document.createElement('div');
            d.textContent = `SYSTEM@ONG:~$ ${val} - КОМАНДА В ОБРАБОТКЕ.`;
            mainOut.appendChild(d);
        }
    }
}

// Сайдбар
document.getElementById('menu-trigger').onclick = () => {
    const p = document.getElementById('side-panel');
    p.classList.toggle('active');
    document.getElementById('panel-blur-overlay').style.display = p.classList.contains('active') ? "block" : "none";
};

window.onload = boot;
