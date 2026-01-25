const PROFILES = {
    "kiddy":    { name: "Kiddy", pass: "1111", level: "A1" },
    "dykzxz":   { name: "Dykzxz", pass: "2222", level: "B3" },
    "msk4ne_":  { name: "MSK4NE", pass: "3333", level: "S-Class" },
    "sumber":   { name: "Sumber", pass: "0000", level: "Admin" },
    "krimpi":   { name: "Krimpi", pass: "5555", level: "Guest" }
};

let step = "ID"; // Состояния: ID, PASSWORD, AUTHORIZED
let tempUser = null;

const output = document.getElementById('output');
const cmdInput = document.getElementById('cmd');
const loginScreen = document.getElementById('login-screen');
const mainDash = document.getElementById('main-dashboard');
const promptText = document.querySelector('.prompt');

function print(text, color = "") {
    const div = document.createElement('div');
    div.className = "line";
    if (color) div.style.color = color;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

cmdInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const val = cmdInput.value.trim().toLowerCase();
        cmdInput.value = "";

        if (step === "ID") {
            if (PROFILES[val]) {
                tempUser = PROFILES[val];
                print(`> ID: ${val}`);
                print("Введите пароль доступа...");
                promptText.textContent = "PASSWORD:> ";
                cmdInput.type = "password";
                step = "PASSWORD";
            } else {
                print(`> Ошибка: Идентификатор '${val}' не найден.`);
            }
        } 
        else if (step === "PASSWORD") {
            if (val === tempUser.pass) {
                print("Доступ разрешен. Синхронизация...");
                step = "AUTHORIZED";
                startTransition();
            } else {
                print("КРИТИЧЕСКАЯ ОШИБКА: Неверный пароль.");
                setTimeout(() => location.reload(), 1500);
            }
        }
    }
});

function startTransition() {
    // Эффект "Глюка" при переходе
    loginScreen.style.filter = "invert(1) hue-rotate(90deg) blur(5px)";
    
    setTimeout(() => {
        loginScreen.classList.add('hidden');
        mainDash.classList.remove('hidden');
        document.getElementById('user-name-display').textContent = tempUser.name;
    }, 800);
}

// Логика меню профиля
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('profile-sidebar');
const darken = document.getElementById('overlay-darken');

menuBtn.onclick = () => {
    sidebar.classList.add('active');
    darken.classList.add('active');
};

darken.onclick = () => {
    sidebar.classList.remove('active');
    darken.classList.remove('active');
};
