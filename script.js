const PROFILES = {
    "morisreal": { name: "MorisReal", pass: "admin", lvl: 6, uuid: "X-882-GLOMG" },
    "sumber":    { name: "Sumber", pass: "0000", lvl: 5, uuid: "X-104-GLOMG" }
};

let step = "ID", tempUser = null, myMessages = [], fullArchive = [];
const socket = typeof io !== 'undefined' ? io() : null;

// Побуквенный текст (Пункт 14)
function typeWriter(text, elementId, speed = 40) {
    const el = document.getElementById(elementId);
    if(!el) return;
    el.innerHTML = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Закрытие панелей кликом в пустоту (Пункт 12)
function closeSidePanels() {
    toggleSidebar(false);
    document.getElementById('scr-notif').classList.add('hidden');
    document.getElementById('scr-profile-modal').classList.add('hidden');
}

function closeModalByClick(e, id) {
    if (e.target.id === id) {
        document.getElementById(id).classList.add('hidden');
        if(id === 'sidebar') toggleSidebar(false);
    }
}

// Уведомления и Профиль
function toggleNotifPanel() { 
    document.getElementById('scr-notif').classList.toggle('hidden');
    document.getElementById('notif-dot').classList.add('hidden');
}

function toggleProfileModal() {
    document.getElementById('scr-profile-modal').classList.toggle('hidden');
}

// Почта (Пункт 6)
function toggleSendForm() {
    const box = document.getElementById('send-block');
    box.classList.toggle('send-form-hidden');
    box.classList.toggle('send-form-visible');
}

// Аккордеон (Пункт 9, 10)
function toggleAccordion(id) {
    const el = document.getElementById(id);
    if(el) el.classList.toggle('open');
}

if (socket) {
    socket.on('load_mail', (msgs) => { 
        myMessages = msgs; 
        renderMail(); 
    });
    socket.on('new_mail', (msg) => { 
        myMessages.push(msg); 
        renderMail(); 
        document.getElementById('notif-dot').classList.remove('hidden');
        const nList = document.getElementById('notif-list-container');
        nList.innerHTML = `<div class="notif-item">📬 Сообщение от: ${msg.from}</div>` + nList.innerHTML;
    });

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
    container.innerHTML = fullArchive.map((item, index) => `
        <div class="archive-item-v2">
            <div onclick="toggleAccordion('arch-body-${index}')" class="archive-header">
                <span>[+] ТЕМА: ${item.title}</span>
                <span class="arch-time">${item.timestamp}</span>
            </div>
            <div id="arch-body-${index}" class="accordion-content">
                <div class="arch-inner">${item.content}</div>
            </div>
        </div>
    `).reverse().join('');
}

function renderMail() {
    const list = document.getElementById('mail-list');
    const count = document.getElementById('mail-count');
    if(list && count) {
        count.innerText = myMessages.length;
        list.innerHTML = myMessages.map(m => `
            <div class="mail-entry">
                <div class="mail-head">ОТ: ${m.from} | ${m.date}</div>
                <div class="mail-body-text">${m.text}</div>
            </div>
        `).reverse().join('');
    }
}

function sendMailAction() {
    const target = document.getElementById('mail-target-select').value;
    const subj = document.getElementById('mail-subject').value;
    const body = document.getElementById('mail-body').value;
    if(!body) return alert("Введите сообщение!");

    const payload = { to: target, subj: subj, body: body, from: tempUser.name };
    if(socket) socket.emit('send_mail_from_web', payload);
    
    document.getElementById('mail-subject').value = "";
    document.getElementById('mail-body').value = "";
    toggleSendForm();
}

function startTransition(id) {
    const fade = document.getElementById('fade-overlay');
    fade.classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        fade.classList.remove('active');
        if(id === 'scr-dash') {
            typeWriter(`> СИСТЕМА: С возвращением, оператор ${tempUser.name}. Узлы активны.`, 'typewriter-text');
        }
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
    document.getElementById('dos-uuid').innerText = user.uuid;
    document.getElementById('dos-lvl').innerText = user.lvl;
    document.getElementById('mail-my-nick').innerText = user.name;
    document.getElementById('mail-my-uuid').innerText = user.uuid;
    if(socket) socket.emit('auth', user.name);
}

function toggleGuest() { 
    startTransition('scr-guest');
}

function toggleSidebar(s) { 
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('side-overlay');
    sidebar.classList.toggle('open', s); 
    if(s) overlay.classList.add('open');
    else overlay.classList.remove('open');
}

function logout() { location.reload(); }

window.onload = () => {
    setInterval(() => {
        const clk = document.querySelectorAll('#clock');
        clk.forEach(c => c.innerText = new Date().toLocaleTimeString());
    }, 1000);
};
