const PROFILES = {
    "morisreal": { name: "MorisReal", pass: "admin", lvl: 6 },
    "sumber":    { name: "Sumber", pass: "0000", lvl: 5 },
    "dykzxz":    { name: "Dykzxz", pass: "2222", lvl: 3 }
};

let step = "ID";
let tempUser = null;

// ФУНКЦИЯ ПЛАВНОГО ПЕРЕХОДА
function transition(callback) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active'); // Затемняем
    setTimeout(() => {
        callback(); // Меняем экран
        setTimeout(() => fade.classList.remove('active'), 200); // Проявляем
    }, 600);
}

// ЛОГИКА ТЕРМИНАЛА
document.getElementById('cmd').addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const val = e.target.value.trim().toLowerCase();
        e.target.value = "";
        const out = document.getElementById('output');

        if (step === "ID") {
            if (val === "guest") {
                document.getElementById('guest-news').classList.remove('hidden');
                out.innerHTML += "<div>> GUEST_ACCESS_GRANTED</div>";
                return;
            }
            if (PROFILES[val]) {
                tempUser = PROFILES[val];
                step = "PASSWORD";
                document.querySelector('.prompt').innerText = "PASS:> ";
                e.target.type = "password";
                out.innerHTML += `<div>> USER: ${tempUser.name} IDENTIFIED.</div>`;
            } else {
                out.innerHTML += `<div style="color:red">> ERROR: UNKNOWN_ID</div>`;
            }
        } else if (step === "PASSWORD") {
            if (val === tempUser.pass) {
                transition(() => {
                    localStorage.setItem('ong_user', JSON.stringify(tempUser));
                    showDashboard(tempUser);
                });
            } else {
                out.innerHTML += `<div style="color:red">> WRONG_PASSWORD. RESETTING...</div>`;
                setTimeout(() => location.reload(), 1000);
            }
        }
    }
});

function showDashboard(user) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-dashboard').classList.remove('hidden');
    document.getElementById('user-name-display').innerText = user.name;
    if(user.lvl === 6) document.getElementById('user-name-display').style.color = "#ff2233";
}

// САЙДБАР
function toggleSidebar(state) {
    document.getElementById('sidebar').classList.toggle('open', state);
    document.getElementById('side-overlay').style.display = state ? 'block' : 'none';
}

function logout() {
    transition(() => {
        localStorage.removeItem('ong_user');
        location.reload();
    });
}

// ЗАГРУЗКА
window.onload = () => {
    const saved = localStorage.getItem('ong_user');
    if (saved) {
        showDashboard(JSON.parse(saved));
        document.getElementById('scr-intro').classList.add('hidden');
    } else {
        setTimeout(() => {
            document.getElementById('intro-ascii').classList.add('hidden');
            document.getElementById('intro-logo').classList.remove('hidden');
            setTimeout(() => {
                transition(() => {
                    document.getElementById('scr-intro').classList.add('hidden');
                    document.getElementById('login-screen').classList.remove('hidden');
                });
            }, 3000);
        }, 1500);
    }
    initMatrix();
};

// МАТРИЦА (Упрощенная)
function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
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
