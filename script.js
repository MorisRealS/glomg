const PROFILES = {
    "morisreal": { name: "MorisReal", pass: "admin", lvl: 6 },
    "dykzxz":    { name: "Dykzxz", pass: "2222", lvl: 3 },
    "sumber":    { name: "Sumber", pass: "0000", lvl: 5 }
};

let step = "ID";
let tempUser = null;
const socket = typeof io !== 'undefined' ? io() : null;

if (socket) {
    socket.on('tg_msg', (data) => {
        alert("🚨 СООБЩЕНИЕ ИЗ ТЕЛЕГРАМА: " + data.text);
    });
    socket.on('alarm', () => {
        document.body.classList.add('alarm-red');
        alert("!!! КРИТИЧЕСКАЯ ТРЕВОГА !!!");
    });
}

function startTransition(targetId) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(targetId).classList.remove('hidden');
        fade.classList.remove('active');
    }, 500);
}

document.getElementById('cmd').addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const val = e.target.value.trim().toLowerCase();
        e.target.value = "";
        if (step === "ID" && PROFILES[val]) {
            tempUser = PROFILES[val];
            step = "PASS";
            document.querySelector('.prompt').innerText = "PASS:> ";
            e.target.type = "password";
        } else if (step === "PASS" && val === tempUser.pass) {
            loginSuccess(tempUser);
        }
    }
});

function loginSuccess(user) {
    startTransition('scr-dash');
    document.getElementById('user-name-display').innerText = user.name;
    document.getElementById('p-name').innerText = user.name;
    document.getElementById('p-lvl').innerText = user.lvl;
    if(socket) socket.emit('auth', user.name);
}

function toggleGuest() { document.getElementById('guest-box').classList.toggle('hidden'); }
function toggleSidebar(s) { document.getElementById('sidebar').classList.toggle('open', s); }
function logout() { location.reload(); }

window.onload = () => {
    initMatrix();
    setInterval(() => {
        const clk = document.getElementById('clock');
        if(clk) clk.innerText = new Date().toLocaleTimeString();
    }, 1000);
};

function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const drops = Array(Math.floor(canvas.width/14)).fill(1);
    setInterval(() => {
        ctx.fillStyle = "rgba(5, 2, 8, 0.1)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#a855f7"; 
        drops.forEach((y, i) => {
            ctx.fillText(Math.floor(Math.random()*2), i*14, y*14);
            if(y*14 > canvas.height && Math.random() > 0.98) drops[i] = 0;
            drops[i]++;
        });
    }, 50);
}
