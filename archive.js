const DB_DATA = [
    { id: "LOG_882", title: "Project 'Prisma' Status", lvl: 3, text: "Эксперимент по нейронной модуляции завершен. Результаты стабильны." },
    { id: "LOG_890", title: "Operator_MorisReal_Bio", lvl: 6, text: "Главный администратор узла. Статус: Вне подозрений. Приоритет доступа: Омега." },
    { id: "LOG_912", title: "Sector 7 Incident", lvl: 5, text: "Обнаружен разлом в защитном контуре. Протокол зачистки активирован." },
    { id: "LOG_950", title: "G.L.O.M.G. Core Update", lvl: 4, text: "Ядро обновлено до V32.8. Все системы синхронизированы." }
];

function initArchive() {
    const list = document.getElementById('archive-list');
    const user = JSON.parse(localStorage.getItem('ong_user')) || { lvl: 0 };
    
    list.innerHTML = DB_DATA.map(item => {
        const isLocked = user.lvl < item.lvl;
        return `
            <div class="archive-item ${isLocked ? 'locked' : ''}">
                <div class="archive-item-header" onclick="${isLocked ? '' : 'expandItem(this)'}">
                    <span>[${item.id}] ${item.title}</span>
                    <span class="lock-status">${isLocked ? 'ACCESS_DENIED' : 'DECRYPTED'}</span>
                </div>
                <div class="archive-item-content">
                    <p>${item.text}</p>
                    <div class="content-footer">STAMP: ${new Date().toLocaleDateString()}</div>
                </div>
            </div>
        `;
    }).join('');
}

function expandItem(el) {
    const parent = el.parentElement;
    parent.classList.toggle('open');
}

// Фоновая матрица (для единства стиля)
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

window.onload = () => {
    initMatrix();
    initArchive();
};
