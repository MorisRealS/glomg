// --- DATABASE ---
const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: 4, uuid: "1101", rank: "Lead Operator", date: "12.05.2024" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: 4, uuid: "1011", rank: "Security Tech", date: "15.06.2024" },
    "sumber":   { name: "Sumber", pass: "0000", level: 5, uuid: "1110", rank: "Supply Manager", date: "01.01.2025" },
    "morisreal": { name: "МОРИС", pass: "123", level: 6, uuid: "1010", rank: "Director", date: "01.01.2020" }
};

const STAFF_QUOTES = ["Защищайте свои UUID.", "Сектор Призма активен.", "Ядро стабильно.", "Обновление завершено."];
const LOG_LINES = ["> SYNCING...", "> UUID_FOUND", "> NO_ANOMALIES", "> CONNECTION_SECURE", "> STANDBY"];

let currentUser = null;
let currentUserID = "";
let matrixInterval = null;
const sound_type = new Audio('https://www.soundjay.com/communication/sounds/typewriter-key-1.mp3');
sound_type.volume = 0.05;

// --- ПЕРЕХОДЫ (С ФИКСОМ СКРОЛЛА) ---
function startTransition(targetId) {
    const fade = document.getElementById('fade');
    fade.classList.add('glitch-active');
    
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.add('hidden');
            s.scrollTop = 0; // Сбрасываем скролл при переходе
        });
        
        const next = document.getElementById(targetId);
        if(next) next.classList.remove('hidden');

        // Модули экранов
        if(targetId === 'scr-dash' || targetId === 'scr-messages') checkMessages();
        if(targetId === 'scr-guest') startGuestConsole();
        if(targetId === 'scr-login') initMatrix(currentUser?.name === 'МОРИС' ? "#FFD700" : "#A855F7");
        if(targetId === 'scr-sysdata') {
            setInterval(() => {
                let v = Math.floor(Math.random()*30) + 10;
                document.getElementById('bar-cpu').style.width = v + "%";
                document.getElementById('val-cpu').innerText = v + "%";
            }, 2000);
        }

        fade.classList.remove('glitch-active');
    }, 400);
}

// --- ЛОГИН ---
function processLogin() {
    const id = document.getElementById('inp-id').value.toLowerCase().trim();
    const pass = document.getElementById('inp-pass').value.trim();
    const out = document.getElementById('login-output');

    const sc = document.createElement('div'); sc.className = 'login-scanner';
    document.querySelector('.login-frame').appendChild(sc);

    setTimeout(() => {
        sc.remove();
        if (PROFILES[id] && PROFILES[id].pass === pass) {
            currentUser = PROFILES[id];
            currentUserID = id;
            
            // Заполнение профиля (UUID ВЕРНУЛ)
            document.getElementById('p-name-val').innerText = currentUser.name;
            document.getElementById('p-uuid-val').innerText = currentUser.uuid;
            document.getElementById('p-lvl-text-val').innerText = currentUser.level;
            document.getElementById('p-rank-val').innerText = currentUser.rank;
            document.getElementById('p-date-val').innerText = currentUser.date;
            document.getElementById('welcome-user-name').innerText = currentUser.name;
            document.getElementById('staff-message-gen').innerText = STAFF_QUOTES[Math.floor(Math.random()*STAFF_QUOTES.length)];

            startTransition('scr-dash');
        } else {
            out.innerText = "ACCESS_DENIED";
            out.style.color = "red";
        }
    }, 1200);
}

// --- СООБЩЕНИЯ ---
function sendMessage() {
    const to = document.getElementById('msg-recipient').value;
    const text = document.getElementById('msg-text').value;
    if(!text) return;
    let msgs = JSON.parse(localStorage.getItem('ong_msgs') || "[]");
    msgs.push({ from: currentUser.name, to: to, text: text, time: new Date().toLocaleTimeString(), read: false });
    localStorage.setItem('ong_msgs', JSON.stringify(msgs));
    document.getElementById('msg-text').value = "";
    alert("ПАКЕТ ОТПРАВЛЕН");
}

function checkMessages() {
    let msgs = JSON.parse(localStorage.getItem('ong_msgs') || "[]");
    let mine = msgs.filter(m => m.to === currentUserID);
    const alertBox = document.getElementById('msg-alert');
    if(mine.some(m => !m.read)) alertBox.classList.remove('hidden');
    else alertBox.classList.add('hidden');

    const list = document.getElementById('messages-list');
    if(list) {
        list.innerHTML = mine.map(m => `
            <div class="msg-item ${m.read?'':'unread'}">
                <small>[${m.time}] ОТ: ${m.from}</small>
                <p>${m.text}</p>
            </div>
        `).reverse().join('') || "Нет данных.";
        msgs.forEach(m => { if(m.to === currentUserID) m.read = true; });
        localStorage.setItem('ong_msgs', JSON.stringify(msgs));
    }
}

// --- РАДАР ---
function initializeTacticalRadar() {
    startTransition('scr-map');
    const nodes = [
        {id: "ONG_HQ", x: 50, y: 40, info: "ШТАБ ОНГ."},
        {id: "PRISM_SECTOR", x: 70, y: 20, info: "АКТИВНОСТЬ ПРИЗМЫ."}
    ];
    const cont = document.getElementById('radar-nodes');
    cont.innerHTML = '';
    nodes.forEach(n => {
        const d = document.createElement('div');
        d.className = 'node ong';
        d.style.left = n.x + '%'; d.style.top = n.y + '%';
        d.onclick = () => {
            document.getElementById('p-title').innerText = n.id;
            document.getElementById('p-text').innerText = n.info;
            document.getElementById('radar-scroll').scrollTo({ top: 600, behavior: 'smooth' });
        };
        cont.appendChild(d);
    });
}

// --- СИСТЕМНЫЕ ---
function initMatrix(color = "#A855F7") {
    const canvas = document.getElementById('matrix-bg');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const drops = Array(Math.floor(canvas.width / 15)).fill(1);
    if(matrixInterval) clearInterval(matrixInterval);
    matrixInterval = setInterval(() => {
        ctx.fillStyle = "rgba(0,0,0,0.05)"; ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.fillStyle = color; ctx.font = "15px monospace";
        drops.forEach((y, i) => {
            ctx.fillText(Math.floor(Math.random()*2), i*15, y*15);
            if(y*15 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }, 35);
}

function startGuestConsole() {
    const box = document.getElementById('guest-console');
    if(!box || box.innerHTML !== "") return;
    let i = 0;
    setInterval(() => {
        if(document.getElementById('scr-guest').classList.contains('hidden')) return;
        const p = document.createElement('p'); p.innerText = LOG_LINES[i];
        box.insertBefore(p, box.firstChild);
        i = (i + 1) % LOG_LINES.length;
    }, 1500);
}

function playTypingSound() { sound_type.currentTime = 0; sound_type.play().catch(()=>{}); }
function toggleSidebar(s) { document.getElementById('sidebar').classList.toggle('open', s); document.getElementById('side-overlay').style.display = s?'block':'none'; }
function openProfile() { document.getElementById('modal-profile').classList.remove('hidden'); toggleSidebar(false); }
function closeProfile() { document.getElementById('modal-profile').classList.add('hidden'); }

window.onload = () => {
    setTimeout(() => {
        document.getElementById('intro-logo').classList.remove('hidden');
        setTimeout(() => startTransition('scr-login'), 2500);
    }, 1000);
    setInterval(() => {
        const c = document.getElementById('clock');
        if(c) c.innerText = new Date().toLocaleTimeString();
    }, 1000);
};
