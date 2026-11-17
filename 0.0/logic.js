const db = {
    mine: [
        { id: "minecraft:coal_ore", name: "Каменный уголь (руда)" },
        { id: "minecraft:iron_ore", name: "Железная руда" },
        { id: "minecraft:diamond_ore", name: "Алмазная руда" },
        { id: "rucraft:brickwhitenew", name: "🧱 Белый кирпич (RuCraft)" },
        { id: "rucraft:brickwhitecolor_2", name: "🧱 Белый цветной кирпич 2" }
    ],
    kill: [
        { id: "minecraft:zombie", name: "🧟 Зомби" },
        { id: "minecraft:skeleton", name: "💀 Скелет" },
        { id: "minecraft:creeper", name: "💥 Крипер" },
        { id: "minecraft:spider", name: "🕷️ Паук" },
        { id: "minecraft:wither_skeleton", name: "🖤 Скелет-иссушитель" }
    ],
    craft: [
        { id: "minecraft:iron_pickaxe", name: "Железная кирка" },
        { id: "minecraft:diamond_sword", name: "Алмазный меч" },
        { id: "minecraft:furnace", name: "Печь" }
    ],
    tame: [
        { id: "minecraft:wolf", name: "Волк (Собака)" },
        { id: "minecraft:cat", name: "Кот" },
        { id: "minecraft:horse", name: "Лошадь" }
    ]
};

let currentType = '';
let questChain = [];
// Один UID для папки генерируется при обновлении страницы
const chapterUID = generateUID(); 

function openSettings(type, element, titleText) {
    currentType = type;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (element) element.classList.add('active');

    document.getElementById('actionTitle').innerText = titleText;
    const targetSelect = document.getElementById('qTarget');
    targetSelect.innerHTML = '';
    
    let labelText = "2. Выберите цель:";
    if(type === 'mine') labelText = "2. Какую руду или блок нужно добыть?";
    if(type === 'kill') labelText = "2. Какого монстра нужно победить?";
    if(type === 'craft') labelText = "2. Какой предмет нужно скрафтить?";
    if(type === 'tame') labelText = "2. Какое животное нужно приручить?";
    document.getElementById('targetLabel').innerText = labelText;

    if (db[type]) {
        db[type].forEach(item => {
            let opt = document.createElement('option');
            opt.value = item.id;
            opt.innerText = item.name;
            targetSelect.appendChild(opt);
        });
    }
    document.getElementById('settingsPanel').style.display = 'block';
}

function generateUID() {
    return Array.from({length: 8}, () => Math.floor(Math.random()*16).toString(16).toUpperCase()).join('').toLowerCase();
}

function addQuestToChain() {
    const title = document.getElementById('qTitle').value || "Без названия";
    const targetSelect = document.getElementById('qTarget');
    const targetID = targetSelect.value;
    const targetName = targetSelect.options[targetSelect.selectedIndex].text;
    const rewardID = document.getElementById('qReward').value;
    const rewardCount = parseInt(document.getElementById('qRewardCount').value) || 1;
    const depType = document.getElementById('qDependency').value;
    const questUID = generateUID();
    
    let autoDesc = "";
    let taskType = "item";
    if(currentType === 'mine') autoDesc = `Отправляйся в шахты и добудь: ${targetName}!`;
    if(currentType === 'craft') autoDesc = `Используй верстак, чтобы создать: ${targetName}.`;
    if(currentType === 'kill') { autoDesc = `Опасность! Найди и уничтожь: ${targetName}.`; taskType = "kill"; }
    if(currentType === 'tame') { autoDesc = `Прояви заботу и приручи существо: ${targetName}.`; taskType = "stat"; }

    let questData = {
        uid: questUID,
        title: title,
        desc: autoDesc,
        taskType: taskType,
        targetID: targetID,
        rewardID: rewardID,
        rewardCount: rewardCount,
        dependency: (depType === 'previous' && questChain.length > 0) ? questChain[questChain.length - 1].uid : null
    };

    questChain.push(questData);
    updateChainUI();
    
    // Очищаем поле ввода названия, чтобы было удобно вводить следующее
    document.getElementById('qTitle').value = "";
}

function updateChainUI() {
    document.getElementById('chainBox').style.display = 'block';
    const list = document.getElementById('questList');
    list.innerHTML = '';
    questChain.forEach((q, idx) => {
        list.innerHTML += `<div class="quest-item"><span>№${idx+1}. <b>${q.title}</b> (${q.desc})</span> <span style="color:#888;">Файл будет: ${q.uid}.snbt</span></div>`;
    });
    // Очищаем старые уведомления при добавлении новых элементов
    document.getElementById('alertContainer').innerHTML = '';
}

function clearQuestChain() {
    if (confirm("Вы уверены, что хотите стереть текущую цепочку квестов и начать заново?")) {
        questChain = [];
        document.getElementById('chainBox').style.display = 'none';
        document.getElementById('questList').innerHTML = '';
        document.getElementById('alertContainer').innerHTML = '';
    }
}

function downloadFileDirect(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

function downloadAllFiles() {
    if (questChain.length === 0) {
        alert("Добавьте хотя бы одно задание перед скачиванием!");
        return;
    }

    const chapterInput = document.getElementById('chapterTitle');
    const chTitle = chapterInput ? chapterInput.value : "Мои приключения";
    
    // 1. Скачиваем файл описания главы
    let chapterSnbt = `{\n\ttitle: "${chTitle}",\n\ticon: "minecraft:map",\n\talways_invisible: false\n}`;
    downloadFileDirect(chapterSnbt, "chapter.snbt");

    // 2. Скачиваем файлы каждого квеста
    let currentX = 0.0;
    questChain.forEach((q, index) => {
        const taskUID = generateUID();
        const rewardUID = generateUID();

        let qContent = `{\n` +
            `\tx: ${currentX.toFixed(1)}d,\n` +
            `\ty: -55.0d,\n` +
            `\tcan_repeat: true,\n`;

        if(q.dependency) {
            qContent += `\tdependencies: [\n\t\t"${q.dependency}"\n\t],\n`;
        }

        if(q.taskType === "kill") {
            let weaponIcon = q.targetID.includes("wither") ? "minecraft:diamond_sword" : "minecraft:iron_sword";
            qContent += `\ttasks: [{\n` +
                `\t\tuid: "${taskUID}",\n` +
                `\t\ttype: "kill",\n` +
                `\t\ticon: "${weaponIcon}",\n` +
                `\t\tentity: "${q.targetID}",\n` +
                `\t\tvalue: 100L\n` +
                `\t}],\n`;
        } else {
            qContent += `\ttasks: [{\n` +
                `\t\tuid: "${taskUID}",\n` +
                `\t\ttype: "item",\n` +
                `\t\titems: [{\n` +
                `\t\t\titem: "${q.targetID}"\n` +
                `\t\t}]\n` +
                `\t}],\n`;
        }

        qContent += `\trewards: [{\n` +
            `\t\tuid: "${rewardUID}",\n` +
            `\t\ttype: "item",\n` +
            `\t\titem: "${q.rewardID}",\n` +
            `\t\tcount: ${q.rewardCount}\n` +
            `\t}]\n` +
            `}`;

        // Скачивание файлов с задержкой
        setTimeout(() => {
            downloadFileDirect(qContent, `${q.uid}.snbt`);
        }, (index + 1) * 150);

        currentX += 1.5;
    });

    // Выводим инструкцию в специальный контейнер под кнопкой
    const alertBox = document.getElementById('alertContainer');
    if (alertBox) {
        alertBox.innerHTML = `<div style="background:#222c24; border:1px solid #3f6b47; padding:15px; margin-top:20px; border-radius:6px; font-family:monospace; font-size:13px; color:#bdf0c4;">` +
            `✅ Все файлы квестов и файл <b>chapter.snbt</b> скачаны!<br><br>` +
            `1️⃣ Создай в папке <b>chapters</b> новую папку с именем <b style="color:#fff;">${chapterUID}</b>.<br>` +
            `2️⃣ Перенеси ВСЕ скачанные из этой пачки файлы прямо в неё.<br>` +
            `3️⃣ Добавь строчку <b style="color:#fff;">"${chapterUID}",</b> в свой главный файл <b>index.snbt</b>.` +
            `</div>`;
    }
}
