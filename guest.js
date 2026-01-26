const NEWS = ["Ядро V32.8 активно.", "MorisReal: Доступ разрешен.", "Сектор 7 под наблюдением."];

function initVhsNoise() {
    const canvas = document.getElementById('noise-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;

    function noise() {
        const idata = ctx.createImageData(canvas.width, canvas.height);
        const buffer = new Uint32Array(idata.data.buffer);
        for (let i = 0; i < buffer.length; i++) {
            if (Math.random() < 0.15) buffer[i] = Math.random() < 0.5 ? 0xff222222 : 0xff111111;
        }
        ctx.putImageData(idata, 0, 0);
        requestAnimationFrame(noise);
    }
    noise();
}

window.onload = () => {
    initVhsNoise();
    document.getElementById('news-feed').innerHTML = NEWS.map(n => `<div class="news-item">>> ${n}</div>`).join('');
    const box = document.getElementById('guest-console');
    setInterval(() => {
        const l = document.createElement('div');
        l.innerText = `> SIGNAL_DATA_NODE_${Math.floor(Math.random()*99)}... OK`;
        box.prepend(l);
        if(box.childNodes.length > 10) box.removeChild(box.lastChild);
    }, 1000);
};
