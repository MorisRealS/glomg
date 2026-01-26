const PROFILES = {
    "morisreal": { name: "MorisReal", pass: "admin", lvl: 6 },
    "sumber":    { name: "Sumber", pass: "0000", lvl: 5 }
};

let step = "ID", tempUser = null, myMessages = [], fullArchive = [];
const socket = typeof io !== 'undefined' ? io() : null;

if (socket) {
    socket.on('connect', () => console.log("Соединение с CORE установлено"));

    // Почта
    socket.on('load_mail', (msgs) => { 
        myMessages = msgs; 
        renderMail(); 
    });
    socket.on('new_mail', (msg) => { 
        myMessages.push(msg); 
        renderMail(); 
        alert("📬 ПОЛУЧЕНО СООБЩЕНИЕ В ПОЧТУ"); 
    });

    // Архив
    socket.on('init_archive', (data) => { 
        fullArchive = data; 
        renderArchive(); 
    });
    socket.on('new_archive_data', (entry) => { 
        fullArchive.push(entry); 
        renderArchive(); 
    });
}

function renderArchive() {
    const container = document.getElementById('archive-list');
    if (!container) return;
    
    if (fullArchive.length === 0) {
        container.innerHTML = '<p style="opacity:0.3">[ АРХИВ ПУСТ ]</p>';
        return;
    }

    container.innerHTML = fullArchive.map((item, index) => `
        <div style="border: 1px solid #a855f7; margin-bottom: 10px; background: rgba(20, 10, 30, 0.8); text-align: left;">
            <div onclick="toggleArchiveItem(${index})" style="padding: 12px; cursor: pointer; display: flex; justify-content: space-between; background: rgba(168, 85, 247, 0.15);">
                <span style="color: #a855f7; font-weight: bold;">[+] ТЕМА: ${item.title}</span>
                <span style="font-size: 10px; opacity: 0.5;">${item.timestamp}</span>
            </div>
            <div id="arch-body-${index}" style="display: none; padding: 15px; border-top: 1px dashed #a855f7; color: #eee; line-height: 1.5; font-size: 14px;">
                ${item.content}
            </div>
        </div>
    `).reverse().join('');
}

function toggleArchiveItem(index) {
    const el = document.getElementById(`arch-body-${index}`);
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function renderMail() {
    const list = document.getElementById('mail-list');
    const count = document.getElementById('mail-count');
    if(list && count) {
        count.innerText = myMessages.length;
        list.innerHTML = myMessages.map(m => `
            <div style="border: 1px solid #0f4; padding: 10px; margin-bottom: 5px; text-align: left; background: rgba(0,255,70,0.05);">
                <div style="font-size: 9px; color: #0f4; margin-bottom: 4px;">ОТ: ${m.from} | ${m.date}</div>
                <div style="color: #fff;">${m.text}</div>
            </div>
        `).reverse().join('');
    }
}

function startTransition(id) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        fade.classList.remove('active');
        if(id === 'scr-archive') renderArchive();
        if(id === 'scr-mail') renderMail();
    }, 500);
}

document.getElementById('cmd').addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const val = e.target.value.trim().toLowerCase();
        e.target.value = "";
        if (step === "ID" && PROFILES[val]) {
            tempUser = PROFILES[val]; step = "PASS";
            document.querySelector('.prompt').innerText = "PASS:> "; e.target.type = "password";
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
    setInterval(() => {
        const clk = document.getElementById('clock');
        if(clk) clk.innerText = new Date().toLocaleTimeString();
    }, 1000);
};
