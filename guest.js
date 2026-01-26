const NEWS_LIST = [
    "Ядро V32.8 запущено успешно. Стабильность: 99.9%",
    "Сектор 7: Повышенная активность нейронных сетей.",
    "MorisReal подтвердил статус администратора узла.",
    "Обнаружен неопознанный пакет данных в архиве.",
    "Внимание: Ожидается плановое обновление протоколов."
];

const consoleBox = document.getElementById('guest-console');
const newsBox = document.getElementById('news-feed');

// Рендер новостей
function renderNews() {
    newsBox.innerHTML = NEWS_LIST.map(n => `
        <div class="news-item">>> ${n}</div>
    `).join('');
}

// Эмуляция логов консоли
function startGuestConsole() {
    setInterval(() => {
        const line = document.createElement('div');
        line.style.fontSize = "0.75rem";
        line.innerText = `> FETCHING_PUBLIC_DATA_NODE_${Math.floor(Math.random()*999)}... OK`;
        consoleBox.prepend(line);
        
        if(consoleBox.childNodes.length > 12) {
            consoleBox.removeChild(consoleBox.lastChild);
        }
    }, 1200);
}

// Матричный фон (копия для автономности страницы)
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
    renderNews();
    startGuestConsole();
};
