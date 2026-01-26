const NEWS_LIST = [
    "Ядро V32.8 запущено успешно.",
    "Сектор 7: Обнаружены помехи сигнала.",
    "MorisReal: Права администратора подтверждены.",
    "ВНИМАНИЕ: Критическая ошибка загрузки модуля 'ARCHIVE' для гостя."
];

// Генерация шума
function initNoise() {
    const canvas = document.getElementById('noise-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function noise() {
        const idata = ctx.createImageData(canvas.width, canvas.height);
        const buffer = new Uint32Array(idata.data.buffer);
        for (let i = 0; i < buffer.length; i++) {
            if (Math.random() < 0.5) buffer[i] = 0xffffffff;
        }
        ctx.putImageData(idata, 0, 0);
        requestAnimationFrame(noise);
    }
    noise();
}

function startConsole() {
    const box = document.getElementById('guest-console');
    setInterval(() => {
        const l = document.createElement('div');
        l.innerText = `> ERR_SIGNAL_LOST_NODE_${Math.floor(Math.random()*99)}... RECONNECTING`;
        l.style.color = Math.random() > 0.8 ? "#ff2233" : "var(--purple)";
        box.prepend(l);
        if(box.childNodes.length > 15) box.removeChild(box.lastChild);
    }, 800);
}

window.onload = () => {
    initNoise();
    startConsole();
    document.getElementById('news-feed').innerHTML = NEWS_LIST.map(n => `<div class="news-item">>> ${n}</div>`).join('');
};
