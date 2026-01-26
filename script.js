function handleTerminalCommand(e) {
    if (e.key === 'Enter') {
        const out = document.getElementById('terminal-out');
        const inp = e.target;
        const cmd = inp.value;

        // Создаем строку вывода БЕЗ лишнего мусора, только символ >
        const line = document.createElement('div');
        line.innerHTML = `<span style="color:#a855f7">></span> ${cmd}`;
        out.appendChild(line);

        // Логика ответов
        const response = document.createElement('div');
        response.style.color = "#888";
        if(cmd === "help") {
            response.innerHTML = "Available modules: SYSTEM, ARCHIVE, RADAR";
        } else {
            response.innerHTML = `System: command '${cmd}' not found in core modules.`;
        }
        out.appendChild(response);

        inp.value = "";
        out.scrollTop = out.scrollHeight;
    }
}

function openProfile() {
    document.getElementById('modal-profile').classList.remove('hidden');
    toggleSidebar(false);
}

function closeProfile() {
    document.getElementById('modal-profile').classList.add('hidden');
}

// При логине можно обновлять данные профиля
function processLogin() {
    const u = document.getElementById('inp-id').value.toLowerCase();
    // ... твоя логика проверки пароля ...
    if (u === "morisreal") {
        document.getElementById('p-name').innerText = "МОРИС";
        document.getElementById('p-token').innerText = "MRS";
        document.getElementById('p-lvl').innerText = "L6";
        transitionToScreen('scr-dash');
    }
}
