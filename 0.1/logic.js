// Полная база данных по биомам и занятиям со всеми модами
const db = {
    mine: [
        { id: "minecraft:coal_ore", type: "item", name: "⛏️ Добыть каменный уголь (руда)" },
        { id: "minecraft:iron_ore", type: "item", name: "⛏️ Добыть железную руду" },
        { id: "minecraft:diamond_ore", type: "item", name: "💎 Найти алмазную руду" },
        { id: "minecraft:lava_bucket", type: "item", name: "🌋 Набрать ведро лавы" },
        { id: "minecraft:obsidian", type: "item", name: "🧱 Добыть обсидиан" },
        { id: "minecraft:minecart", type: "item", name: "🛒 Найти или скрафтить вагонетку" },
        { id: "minecraft:cave_spider", type: "kill", name: "🕷️ Охота: Победить пещерного паука" }
    ],
    kill: [
        { id: "minecraft:zombie", type: "kill", name: "🧟 Победить Зомби" },
        { id: "minecraft:skeleton", type: "kill", name: "💀 Уничтожить Скелета" },
        { id: "minecraft:creeper", type: "kill", name: "💥 Взорвать или победить Крипера" },
        { id: "minecraft:spider", type: "kill", name: "🕷️ Победить обычного Паука" }
    ],
    animals: [
        { id: "minecraft:cow", type: "kill", name: "🐄 Найти Корову" },
        { id: "minecraft:pig", type: "kill", name: "🐷 Найти Свинью" },
        { id: "minecraft:sheep", type: "kill", name: "🐑 Найти Овцу" },
        { id: "minecraft:squid", type: "kill", name: "🦑 Охота в воде: Победить Спрута" }
    ],
    cook: [
        { id: "minecraft:cake", type: "item", name: "🎂 Приготовить праздничный Тортик" },
        { id: "minecraft:cooked_beef", type: "item", name: "🥩 Зажарить стейк из говядины" },
        { id: "minecraft:baked_potato", type: "item", name: "🥔 Запечь картофель в печке" },
        { id: "minecraft:wheat", type: "item", name: "🌾 Вырастить и собрать урожай пшеницы" }
    ],
    gear: [
        { id: "minecraft:shield", type: "item", name: "🛡️ Скрафтить защитный Щит" },
        { id: "minecraft:iron_chestplate", type: "item", name: "👕 Сделать железный нагрудник" },
        { id: "minecraft:iron_sword", type: "item", name: "⚔️ Выковать железный меч" },
        { id: "minecraft:bow", type: "item", name: "🏹 Создать дальнобойный Лук" },
        { id: "minecraft:arrow", type: "item", name: "🎯 Наделать стрел для лука" }
    ],
    dims: [
        { id: "minecraft:wither_skeleton", type: "kill", name: "🖤 Нижний мир: Охота на Скелета-иссушителя" },
        { id: "minecraft:ghast", type: "kill", name: "👻 Нижний мир: Победить летающего Гаста" },
        { id: "minecraft:quartz", type: "item", name: "💎 Нижний мир: Добыть кварцевую руду" },
        { id: "minecraft:enderman", type: "kill", name: "🔮 Эндер-мир: Победить Странника Края" }
    ],
    trade: [
        { id: "minecraft:emerald", type: "item", name: "💚 Найти или заработать Изумруд" },
        { id: "minecraft:villager", type: "stat", name: "👨 Торговля: Заключить сделку с жителем" },
        { id: "minecraft:bed", type: "item", name: "🛏️ Скрафтить кровать для отдыха в деревне" }
    ]
};

let currentType = '';
let questChain = [];
const chapterUID = generateUID(); 

function openSettings(type, element, titleText) {
    currentType = type;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (element) element.classList.add('active');

    document.getElementById('actionTitle').innerText = titleText;
    const targetSelect = document.getElementById('qTarget');
    targetSelect.innerHTML = '';
    
    let labelText = "2. Выберите цель для задания:";
    document.getElementById('targetLabel').innerText = labelText;

    if (db[type]) {
        db[type].forEach(item => {
            let opt = document.createElement('option');
            opt.value = item.id;
            opt.setAttribute('data-tasktype', item.type);
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
    
    const selectedOption = targetSelect.options[targetSelect.selectedIndex];
    const taskType = selectedOption.getAttribute('data-tasktype') || "item";

    const rewardID = document.getElementById('qReward').value;
    const rewardCount = parseInt(document.getElementById('qRewardCount').value) || 1;
    const depType = document.getElementById('qDependency').value;
    const questUID = generateUID();
    
    let autoDesc = "";
    if(currentType === 'mine') {
        autoDesc = taskType === "kill" ? "Спускайся в заброшенные шахты и очисти их от пещерных пауков!" : "Пора заняться горным делом! Спустись под землю и раздобудь этот важный ресурс.";
    } else if(currentType === 'kill') {
        autoDesc = "Наступила ночь! Защити свой лагерь и одолей опасного ночного монстра.";
    } else if(currentType === 'animals') {
        autoDesc = "Займись скотоводством и найди полезных животных на равнинах или в океане.";
    } else if(currentType === 'cook') {
        autoDesc = "Пора подкрепиться! Разведи огонь в печи или используй верстак, чтобы приготовить вкусную еду.";
    } else if(currentType === 'gear') {
        autoDesc = "Кузнечное дело мастера боится! Сделай крепкое снаряжение для будущих сражений.";
    } else if(currentType === 'dims') {
        autoDesc = "Ты готов к опасному путешествию? Построй портал и отправляйся на исследование таинственных измерений.";
    } else if(currentType === 'trade') {
        autoDesc = "Добро пожаловать в мир коммерции! Отыщи деревню жителей и добудь изумруды для торговли.";
    }

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
    document.getElementById('qTitle').value = "";
}

function updateChainUI() {
    document.getElementById('chainBox').style.display = 'block';
    const list = document.getElementById('questList');
    list.innerHTML = '';
    questChain.forEach((q, idx) => {
        list.innerHTML += `<div class="quest-item"><span>№${idx+1}. <b>${q.title}</b> (${q.desc})</span> <span style="color:#888;">Файл будет: ${q.uid}.snbt</span></div>`;
    });
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
    
    // Структура chapter.snbt со всеми обязательными скобками и запятыми
    let chapterSnbt = "{\n" +
        "\ttitle: \"" + chTitle + "\",\n" +
        "\ticon: \"minecraft:map\",\n" +
        "\talways_invisible: false,\n" +
        "\tgroup: 0,\n" +
        "\tdefault_quest_shape: \"\"\n" +
        "}";
        
    downloadFileDirect(chapterSnbt, "chapter.snbt");

    // Скачиваем файлы каждого квеста
    let currentX = 0.0;
    questChain.forEach((q, index) => {
        const taskUID = generateUID();
        const rewardUID = generateUID();

        let qContent = "{\n" +
            "\tx: " + currentX.toFixed(1) + "d,\n" +
            "\ty: -59.5d,\n"; // Поставили стандартный Y охоты из игры

        if(q.dependency) {
            qContent += "\tdependencies: [\n\t\t\"" + q.dependency + "\"\n\t],\n";
        }

        // Блок задач (tasks) С ИКОНКОЙ и ОБЯЗАТЕЛЬНОЙ ЗАПЯТОЙ после скобки ]
        if(q.taskType === "kill") {
            let weaponIcon = q.targetID.includes("wither") ? "minecraft:diamond_sword" : "minecraft:iron_sword";
            qContent += "\ttasks: [{\n" +
                "\t\tuid: \"" + taskUID + "\",\n" +
                "\t\ttype: \"kill\",\n" +
                "\t\ticon: \"" + weaponIcon + "\",\n" + // Возвращаем иконку меча, как в игре!
                "\t\tentity: \"" + q.targetID + "\",\n" +
                "\t\tvalue: 100L\n" +
                "\t}],\n"; 
        } else {
            qContent += "\ttasks: [{\n" +
                "\t\tuid: \"" + taskUID + "\",\n" +
                "\t\ttype: \"item\",\n" +
                "\t\titems: [{\n" +
                "\t\t\titem: \"" + q.targetID + "\"\n" +
                "\t\t}]\n" +
                "\t}],\n"; 
        }

        // Блок наград (rewards) С ОБЯЗАТЕЛЬНОЙ ЗАПЯТОЙ после скобки ]
        qContent += "\trewards: [{\n" +
            "\t\tuid: \"" + rewardUID + "\",\n" +
            "\t\ttype: \"item\",\n" +
            "\t\titem: \"" + q.rewardID + "\",\n" +
            "\t\tcount: " + q.rewardCount + "\n" +
            "\t}],\n" + 
            "}";

        setTimeout(() => {
            downloadFileDirect(qContent, q.uid + ".snbt");
        }, (index + 1) * 150);

        currentX += 1.5;
    });

    // Инструкция для вывода под кнопкой скачивания
    const alertBox = document.getElementById('alertContainer');
    if (alertBox) {
        alertBox.innerHTML = "<div style='background:#222c24; border:1px solid #3f6b47; padding:15px; margin-top:20px; border-radius:6px; font-family:monospace; font-size:13px; color:#bdf0c4;'>" +
            "✅ Все файлы квестов и файл <b>chapter.snbt</b> скачаны!<br><br>" +
            "1️⃣ Создай в папке <b>chapters</b> новую папку с именем <b style='color:#fff;'>" + chapterUID + "</b>.<br>" +
            "2️⃣ Перенеси ВСЕ скачанные файлы прямо в эту созданную папку.<br>" +
            "3️⃣ Добавь строчку <b style='color:#fff;'>\"" + chapterUID + "\",</b> в свой главный файл <b>index.snbt</b>." +
            "</div>";
    }
}