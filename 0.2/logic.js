// ====== ЧАСТЬ 1: РАСШИРЕННАЯ БАЗА ДАННЫХ ПРЕДМЕТОВ, МОБОВ И НАГРАД ======
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

// МАССИВ ДЛЯ ХРАНЕНИЯ ВСЕХ СГЕНЕРИРОВАННЫХ ГЛАВ ЗА СЕССИЮ (Для index.snbt)
let allGeneratedChapters = [];

let currentType = '';
let questChain = [];
let chapterUID = generateUID(); 

// Добавляем текущую стартовую главу в список отслеживания
if (!allGeneratedChapters.includes(chapterUID)) {
    allGeneratedChapters.push(chapterUID);
}

window.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('displayFolderID');
    if(el) el.innerText = chapterUID;
    updateRewardsSelect(); // Автоматически наполняем список наград при старте
});

function rerollChapterUID() {
    if(confirm("Сгенерировать новый ID папки для СЛЕДУЮЩЕЙ главы? Текущая цепочка квестов на экране сбросится!")) {
        chapterUID = generateUID();
        
        // Добавляем новый ID в глобальный список для index.snbt
        if (!allGeneratedChapters.includes(chapterUID)) {
            allGeneratedChapters.push(chapterUID);
        }
        
        const el = document.getElementById('displayFolderID');
        if(el) el.innerText = chapterUID;
        
        // Очищаем холст для новой главы
        questChain = [];
        const box = document.getElementById('chainBox');
        if(box) box.style.display = 'none';
        document.getElementById('questList').innerHTML = '';
        document.getElementById('alertContainer').innerHTML = '';
    }
}

// ФУНКЦИЯ ДЛЯ ГЕНЕРАЦИИ БОГАТОГО СПИСКА НАГРАД (Решает Полет №3)
function updateRewardsSelect() {
    const rewardSelect = document.getElementById('qReward');
    if(!rewardSelect) return;
    
    // Очищаем старый скудный список
    rewardSelect.innerHTML = '';
    
    // Большой пак крутых наград, разделенный по категориям
    const rewardsPack = [
        { group: "Монеты и Валюта", items: [
            { id: "coinmod:silvercoin", name: "🪙 Серебряная монета (CoinMod)" },
            { id: "coinmod:goldcoin", name: "👑 Золотая монета (CoinMod)" },
            { id: "minecraft:emerald", name: "💚 Изумруд" },
            { id: "minecraft:emerald_block", name: "🟩 Изумрудный блок (Для богачей)" }
        ]},
        { group: "Ценные Ресурсы", items: [
            { id: "minecraft:iron_ingot", name: "🪙 Железный слиток" },
            { id: "minecraft:gold_ingot", name: "🟡 Золотой слиток" },
            { id: "minecraft:diamond", name: "💎 Алмаз" },
            { id: "minecraft:iron_block", name: "⛓️ Железный блок" },
            { id: "minecraft:gold_block", name: "🟡 Золотой блок" },
            { id: "minecraft:diamond_block", name: "💎 Алмазный блок" }
        ]},
        { group: "Еда и Выживание", items: [
            { id: "minecraft:cooked_beef", name: "🥩 Жареный стейк (4 шт)" },
            { id: "minecraft:golden_apple", name: "🍎 Золотое яблоко" },
            { id: "minecraft:golden_apple:1", name: "💜 Зачарованное яблоко Нотча" },
            { id: "minecraft:cake", name: "🎂 Целый торт" }
        ]},
        { group: "Редкие Сокровища", items: [
            { id: "ftbquests:lootcrate", name: "📦 Случайный сундук с лутом (Lootcrate)" },
            { id: "minecraft:experience_bottle", name: "🧪 Флакон с опытом" },
            { id: "minecraft:totem_of_undying", name: "🦅 Тотем бессмертия" },
            { id: "minecraft:golden_carrot", name: "🥕 Золотая морковь" }
        ]}
    ];
    
    rewardsPack.forEach(group => {
        let optGroup = document.createElement('optgroup');
        optGroup.label = group.group;
        group.items.forEach(item => {
            let opt = document.createElement('option');
            opt.value = item.id;
            opt.innerText = item.name;
            optGroup.appendChild(opt);
        });
        rewardSelect.appendChild(optGroup);
    });
}
// ====== ЧАСТЬ 2: УПРАВЛЕНИЕ, ИСПРАВЛЕНИЕ ИКОНОК И АВТО-ВЫГРУЗКА INDEX.SNBT ======
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
    const targetCount = parseInt(document.getElementById('qTargetCount').value) || 1;

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
        targetCount: targetCount,
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
        let countText = q.taskType === "kill" ? " мобов" : " шт.";
        list.innerHTML += `<div class="quest-item"><span>№${idx+1}. <b>${q.title}</b> (${q.desc}) — Требуется: ${q.targetCount}${countText}</span> <span style="color:#888;">Файл: ${q.uid}.snbt</span></div>`;
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
    
    // 1. СКАЧИВАЕМ CHAPTER.SNBT СРАЗУ ВНУТРИ ПРАВИЛЬНОЙ ПАПКИ ГЛАВЫ!
    let chapterSnbt = "{\n" +
        "\ttitle: \"" + chTitle + "\",\n" +
        "\ticon: \"minecraft:map\",\n" +
        "\talways_invisible: false,\n" +
        "\tgroup: 0,\n" +
        "\tdefault_quest_shape: \"\"\n" +
        "}";
    
    // ХАК ДЛЯ БРАУЗЕРА: Указываем ID папки прямо в названии файла через слэш!
    downloadFileDirect(chapterSnbt, chapterUID + "/chapter.snbt");

    // 2. СКАЧИВАЕМ ВСЕ ФАЙЛЫ КВЕСТОВ ТОЖЕ ВНУТРИ ЭТОЙ ПАПКИ!
    let currentX = 0.0;
    questChain.forEach((q, index) => {
        const taskUID = generateUID();
        const rewardUID = generateUID();

        let qContent = "{\n" +
            "\tx: " + currentX.toFixed(1) + "d,\n" +
            "\ty: -59.5d,\n";

        if(q.dependency) {
            qContent += "\tdependencies: [\n\t\t\"" + q.dependency + "\"\n\t],\n";
        }

        if(q.taskType === "kill") {
            let weaponIcon = q.targetID.includes("wither") ? "minecraft:diamond_sword" : "minecraft:iron_sword";
            qContent += "\ttasks: [{\n" +
                "\t\tuid: \"" + taskUID + "\",\n" +
                "\t\ttype: \"kill\",\n" +
                "\t\ticon: \"" + weaponIcon + "\",\n" +
                "\t\tentity: \"" + q.targetID + "\",\n" +
                "\t\tvalue: " + q.targetCount + "L\n" +
                "\t}],\n";
        } else {
            qContent += "\ttasks: [{\n" +
                "\t\tuid: \"" + taskUID + "\",\n" +
                "\t\ttype: \"item\",\n" +
                "\t\titems: [{\n" +
                "\t\t\titem: \"" + q.targetID + "\",\n" +
                "\t\t\tcount: " + q.targetCount + "L\n" +
                "\t\t}]\n" +
                "\t}],\n";
        }

        qContent += "\trewards: [{\n" +
            "\t\tuid: \"" + rewardUID + "\",\n" +
            "\t\ttype: \"item\",\n" +
            "\t\titem: \"" + q.rewardID + "\",\n" +
            "\t\tcount: " + q.rewardCount + "\n" +
            "\t}],\n" +
            "}";

        // Скачиваем квест внутрь подпапки главы!
        setTimeout(() => {
            downloadFileDirect(qContent, chapterUID + "/" + q.uid + ".snbt");
        }, (index + 1) * 150);

        currentX += 1.5;
    });

    // 3. СКАЧИВАЕМ INDEX.SNBT ОТДЕЛЬНЫМ ФАЙЛОМ РЯДОМ (НЕ В ПАПКЕ!)
    let formattedChapters = allGeneratedChapters.map(id => "\t\t\"" + id + "\"").join(",\n");
    
    let indexSnbtContent = "{\n" +
        "\tindex: [\n" +
        formattedChapters + "\n" +
        "\t]\n" +
        "}";
        
    setTimeout(() => {
        downloadFileDirect(indexSnbtContent, "index.snbt");
    }, (questChain.length + 1) * 160);

    // УПРОЩЕННАЯ ИНСТРУКЦИЯ ДЛЯ ДЕТЕЙ (ВСЕГО 2 ДЕЙСТВИЯ!)
    const alertBox = document.getElementById('alertContainer');
    if (alertBox) {
        alertBox.innerHTML = "<div style='background:#222c24; border:1px solid #3f6b47; padding:15px; margin-top:20px; border-radius:6px; font-family:monospace; font-size:13px; color:#bdf0c4; line-height:1.6;'>" +
            "🎉 <b>СБОРКА ЗАВЕРШЕНА! ВЫГРУЖЕНО ВСЕГО ДВА ОБЪЕКТА:</b> 🎉<br><br>" +
            "1️⃣ Перенеси скачанный файл <b>index.snbt</b> прямо в папку <b style='color:#fff;'>config/ftbquests/normal/</b> с заменой.<br>" +
            "2️⃣ Перенеси скачанную папку <b style='color:#52a869; font-weight:bold;'>" + chapterUID + "</b> целиком внутрь папки <b style='color:#fff;'>normal/chapters/</b>.<br><br>" +
            "✨ Ничего редактировать руками больше не нужно! Запускай Майнкрафт! ✨" +
            "</div>";
    }
}
