const FILES = [
    { id: "LOG_001", title: "Протокол 'Prisma'", lvl: 3, content: "Эксперимент по созданию нейронного щита завершен успешно. Эффективность: 88%." },
    { id: "LOG_042", title: "Инцидент в Секторе 7", lvl: 5, content: "Зафиксирован несанкционированный доступ. Источник: [ДАННЫЕ УДАЛЕНЫ]. Режим охраны усилен." },
    { id: "LOG_099", title: "Личное дело: MorisReal", lvl: 6, content: "Статус: Главный Администратор. Полный доступ ко всем подсистемам ядра O.N.G." },
    { id: "LOG_105", title: "Проект 'G.L.O.M.G.'", lvl: 4, content: "Глобальная Локальная Операционная Мониторинговая Группа. Текущая фаза: Стабилизация." }
];

function renderArchive() {
    const list = document.getElementById('archive-list');
    const userData = JSON.parse(localStorage.getItem('ong_user')) || { lvl: 0 };

    list.innerHTML = FILES.map(file => {
        const isLocked = userData.lvl < file.lvl;
        
        return `
            <div class="db-log-item ${isLocked ? 'locked' : ''}">
                <div class="db-log-header" onclick="${isLocked ? '' : 'toggleLog(this)'}">
                    <span class="file-id">[ ${file.id} ]</span>
                    <span class="file-title">${file.title}</span>
                    <span class="file-status">${isLocked ? 'LOCKED (LVL ' + file.lvl + ')' : 'OPEN'}</span>
                </div>
                <div class="db-log-content">
                    <div class="purple-fading-line"></div>
                    <p>${file.content}</p>
                </div>
            </div>
        `;
    }).join('');
}

function toggleLog(element) {
    element.parentElement.classList.toggle('open');
}

// Матричный фон для единства стиля
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
    renderArchive();
};
