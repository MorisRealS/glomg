const TARGETS = [
    { id: 1, name: "CORE_STATION", x: 50, y: 50, dist: 0, threat: "SAFE", info: "Центральный узел O.N.G. Сектор MorisReal." },
    { id: 2, name: "LAB_ALPHA", x: 25, y: 30, dist: 4.2, threat: "LOW", info: "Исследовательский комплекс. Работа с нейросетями." },
    { id: 3, name: "ANOMALY_7", x: 80, y: 20, dist: 12.8, threat: "HIGH", info: "Неопознанный сигнал. Рекомендуется осторожность." },
    { id: 4, name: "S_STORAGE", x: 15, y: 75, dist: 8.5, threat: "SAFE", info: "Архивное хранилище данных Сектора 4." }
];

function initRadar() {
    const container = document.getElementById('radar-nodes');
    
    TARGETS.forEach(target => {
        const node = document.createElement('div');
        node.className = 'node pulse';
        node.style.left = target.x + '%';
        node.style.top = target.y + '%';
        
        // Клик по точке
        node.onclick = () => {
            showTargetInfo(target);
        };
        
        container.appendChild(node);
    });
}

function showTargetInfo(target) {
    const title = document.getElementById('rad-title');
    const text = document.getElementById('rad-text');
    const stats = document.getElementById('target-stats');
    
    title.innerText = `> ${target.name}`;
    title.style.color = target.threat === "HIGH" ? "#ff2233" : "#a855f7";
    text.innerText = target.info;
    
    stats.classList.remove('hidden');
    document.getElementById('stat-dist').innerText = target.dist;
    document.getElementById('stat-threat').innerText = target.threat;

    // Плавный скролл к инфо, если экран маленький
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// Матрица (для единства стиля)
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
    initRadar();
};
