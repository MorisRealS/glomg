const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: "A1", token: "KID" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: "B3", token: "DYK" },
    "msk4ne_":  { name: "MSK4NE", pass: "3333", level: "S-Class", token: "MSK" },
    "sumber":   { name: "Sumber", pass: "0000", level: "Admin", token: "SBR" },
    "morisreal": { name: "МОРИС", pass: "123", level: "L4", token: "MRS" }
};

let step = "ID";
let tempUser = null;

const output = document.getElementById('output');
const cmdInput = document.getElementById('cmd');

function print(text) {
    const div = document.createElement('div');
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

// ЛОГИКА ВХОДА (ИСПРАВЛЕН ПРОМПТ)
cmdInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const val = cmdInput.value.trim().toLowerCase();
        print("> " + val); // Убрал root@glomg

        if (step === "ID") {
            if (PROFILES[val]) {
                tempUser = PROFILES[val];
                print("ID ACCEPTED. Введите пароль...");
                cmdInput.type = "password";
                step = "PASSWORD";
            } else {
                print("ERROR: Unknown ID.");
            }
        } 
        else if (step === "PASSWORD") {
            if (val === tempUser.pass) {
                print("ACCESS GRANTED.");
                // Загружаем данные в модалку
                document.getElementById('p-name-val').innerText = tempUser.name;
                document.getElementById('p-lvl-val').innerText = tempUser.level;
                document.getElementById('p-token-val').innerText = tempUser.token || "UNK";
                
                setTimeout(() => transitionToScreen('scr-dash'), 500);
            } else {
                print("DENIED. System lockout...");
                setTimeout(() => location.reload(), 1500);
            }
        }
        cmdInput.value = "";
    }
});

function transitionToScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function toggleSidebar(state) {
    const side = document.getElementById('sidebar');
    const over = document.getElementById('side-overlay');
    side.classList.toggle('open', state);
    over.style.display = state ? 'block' : 'none';
}

function openProfile() {
    document.getElementById('modal-profile').classList.remove('hidden');
    toggleSidebar(false);
}

function closeProfile() {
    document.getElementById('modal-profile').classList.add('hidden');
}

// Твои часы
setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);

// Инициализация (Твое интро)
window.onload = () => {
    setTimeout(() => {
        document.getElementById('scr-intro').classList.add('hidden');
        document.getElementById('scr-login').classList.remove('hidden');
    }, 2000);
};
