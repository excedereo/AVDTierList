
document.addEventListener('DOMContentLoaded', function() {
    Object.entries(unitStats).forEach(([unitKey, unit]) => {
        const [aoeType, aoeValue] = unit.aoe.split(' ').length > 1
            ? [unit.aoe.split(' ')[1].toLowerCase(), parseFloat(unit.aoe.split(' ')[0])]
            : [unit.aoe.toLowerCase(), 0];
        unit.pps = window.PPSCalculator(unit.range, aoeType, aoeValue, unit.damage, unit.spa);
    });

    // Функция для определения рейтинга юнита на основе его характеристик
    let sortType = 'dps';

    function getUnitTier(unit) {
        const dps = unit.damage / unit.spa;
        if (dps > 10000 || unit.damage > 50000) return 'S';
        if (dps > 5000 || unit.damage > 20000) return 'A';
        if (dps > 2000 || unit.damage > 10000) return 'B';
        return 'C';
    }

    function displayUnits() {
        document.getElementById('tier-S').innerHTML = '';
        document.getElementById('tier-A').innerHTML = '';
        document.getElementById('tier-B').innerHTML = '';
        document.getElementById('tier-C').innerHTML = '';
        const sTier = document.createElement('div');
        const aTier = document.createElement('div');
        const bTier = document.createElement('div');
        const cTier = document.createElement('div');
        sTier.className = 'unit-names';
        aTier.className = 'unit-names';
        bTier.className = 'unit-names';
        cTier.className = 'unit-names';

        const sortedUnits = Object.entries(unitStats).sort((a, b) => {
            const unitA = a[1];
            const unitB = b[1];
            if (sortType === 'dps') {
                return (unitB.damage / unitB.spa) - (unitA.damage / unitA.spa);
            } else if (sortType === 'spa') {
                return unitB.spa - unitA.spa;
            } else if (sortType === 'pps') {
                return unitB.pps - unitA.pps; // Use stored PPS value
            }
        });

        // Изменено: используем unitKey для генерации пути к изображению
        sortedUnits.forEach(([unitKey, unit]) => {
            const tier = getUnitTier(unit);
            const headElement = document.createElement('div');
            const nameElement = document.createElement('div');
            const unitElement = document.createElement('div');
            const imgElement = document.createElement('img');


            headElement.className = 'unit-container';
            unitElement.className = 'unit-name';
            imgElement.className = 'unit-image';
            nameElement.className = 'unit-text';


            nameElement.textContent = unit.displayName;
            imgElement.src = `images/units/${unitKey}.webp`;
            imgElement.onerror = () => { imgElement.src = 'images/default.jpg'; };

            let borderElementColor
            switch (unit.element){
                case ("spark"):
                    unitElement.style.borderLeftColor = "#00ebfa"; borderElementColor = "#00ebfa"; break;

                case ("nature"):
                    unitElement.style.borderLeftColor = "#00ff6f"; borderElementColor ="#00ff6f";break;
                case ("water"):
                    unitElement.style.borderLeftColor = "#1d5cf6"; borderElementColor ="#1d5cf6";break;
                case ("fire"):
                    unitElement.style.borderLeftColor = "#ff9f29"; borderElementColor ="#ff9f29";break;
                case ("holy"):
                    unitElement.style.borderLeftColor = "#fffcaa"; borderElementColor ="#fffcaa";break;
                case ("passion"):
                    unitElement.style.borderLeftColor = "#fcbde2"; borderElementColor ="#fcbde2";break;
                case ("curse"):
                    unitElement.style.borderLeftColor = "#580089"; borderElementColor ="#580089";break;
                case ("blast"):
                    unitElement.style.borderLeftColor = "#f0f0f0"; borderElementColor ="#f0f0f0";break;
                case ("cosmic"):
                    unitElement.style.borderLeftColor = "#af72fb"; borderElementColor ="#af72fb";break;
                case ("unbound"):
                    unitElement.style.borderLeftColor = "#bf0012"; borderElementColor ="#bf0012";break;
                case ("unknown"):
                    unitElement.style.borderLeftColor = "#010200"; borderElementColor = "#010200";break;
            }

            switch (unit.element2){
                case ("spark"):
                    unitElement.style.borderImage = `linear-gradient(to bottom,${borderElementColor} 45%,#00ebfa 55%) 1`;break;
                case ("nature"):
                    unitElement.style.borderImage = `linear-gradient(to bottom,${borderElementColor} 45%,#00ff6f 55%) 1`;break;
                case ("water"):
                    unitElement.style.borderImage = `linear-gradient(to bottom,${borderElementColor} 45%,#1d5cf6 55%) 1`;break;
                case ("fire"):
                    unitElement.style.borderImage = `linear-gradient(to bottom,${borderElementColor} 45%,#ff9f29 55%) 1`;break;
                case ("holy"):
                    unitElement.style.borderImage = `linear-gradient(to bottom,${borderElementColor} 45%,#fffcaa 55%) 1`;break;
                case ("passion"):
                    unitElement.style.borderImage = `linear-gradient(to bottom,${borderElementColor} 45%,#fcbde2 55%) 1`;break;
                case ("curse"):
                    unitElement.style.borderImage = `linear-gradient(to bottom,${borderElementColor} 45%,#580089 55%) 1`;break;
                case ("blast"):
                    unitElement.style.borderImage = `linear-gradient(to bottom,${borderElementColor} 45%,#f0f0f0 55%) 1`;break;
                case ("cosmic"):
                    unitElement.style.borderImage = `linear-gradient(to bottom,${borderElementColor} 45%,#af72fb 55%) 1`;break;
                case ("unbound"):
                    unitElement.style.borderImage = `linear-gradient(to bottom,${borderElementColor} 45%,#bf0012 55%) 1`;break;
                case ("unknown"):
                    unitElement.style.borderImage = `linear-gradient(to bottom,${borderElementColor} 45%,#010200 55%) 1`;break;
            }
// Парсим aoe
            const [aoeType, aoeValue] = unit.aoe.split(' ').length > 1
                ? [unit.aoe.split(' ')[1].toLowerCase(), parseFloat(unit.aoe.split(' ')[0])]
                : [unit.aoe.toLowerCase(), 0];

            // Вычисляем PPS
            const pps = window.PPSCalculator(unit.range, aoeType, aoeValue, unit.damage, unit.spa);
            let dpsHtml
            if (unit.abilitydps){
                dpsHtml = `
                <div class="single-stat">
                    <img class="stats-icons" src="images/stats/dps.webp">${(Math.round(unit.damage/unit.spa)).toLocaleString('de-DE')}
                </div>
                <div class="single-stat">
                    <img class="stats-icons" src="images/stats/adps.webp">${(Math.round( unit.abilitydps)).toLocaleString('de-DE')}
                </div>
                `
            } else {
                dpsHtml = `
                <div class="single-stat">
                    <img class="stats-icons" src="images/stats/dps.webp">${(Math.round(unit.damage/unit.spa)).toLocaleString('de-DE')}
                </div>
                `
            }

            const statsElementDamage = document.createElement('div'); // Новый элемент для характеристик
            statsElementDamage.className = 'unit-stats'; // Класс для стилизации характеристик
            statsElementDamage.innerHTML = `
                <div class="single-stat">
                    <img class="stats-icons" src="images/stats/Damage.webp">${unit.damage.toLocaleString('de-DE')}
                </div>
                <div class="single-stat">
                    <img class="stats-icons" src="images/stats/SPA.webp">${unit.spa}
                </div>
                ${dpsHtml}
            `;



            const statsElementRange = document.createElement('div'); // Новый элемент для характеристик
            statsElementRange.className = 'unit-stats'; // Класс для стилизации характеристик
            statsElementRange.innerHTML = `
                <div class="single-stat">
                    <img class="stats-icons" src="images/stats/Range.webp">${unit.range}
                </div>
                <div class="single-stat">
                    ${unit.aoe}
                </div>
                <div class="single-stat">
                    <img class="stats-icons" src="images/stats/pps.webp">${(pps.toLocaleString('de-DE'))}
                </div>
            `;

            let difficultyLetter
            let difficultyColor
            if (unit.difficulty < 35){
                difficultyLetter = 'easy';
                difficultyColor = 'linear-gradient(to left, #64ddae, #429172);'}
            else if (35 <= unit.difficulty && unit.difficulty < 70) {
                difficultyLetter = 'medium'
                difficultyColor = 'linear-gradient(to left, #f2c55c, #c49f4a);'}
            else {
                difficultyLetter = 'hard'
                difficultyColor = 'linear-gradient(to left, #e84a4c, #c73e40);' }
            const statsThirdCase = document.createElement('div')
            statsThirdCase.className = "unit-stats"
            statsThirdCase.style.width = "210px";
            statsThirdCase.innerHTML = `
            <div style="width: 100%; text-align: start; top: 92px; left: 5px; position: relative;">Difficulty:</div>
            <div class="unit-difficulty"> 
                <div class="unit-difficulty-progress" style="width: ${unit.difficulty*2}px; background-image: ${difficultyColor}"></div>
                <div class="unit-difficulty-progress-text" >${difficultyLetter}</div>
            </div>
            `


            unitElement.appendChild(imgElement);
            unitElement.appendChild(nameElement);
            headElement.appendChild(unitElement);
            headElement.appendChild(statsElementDamage);
            headElement.appendChild(statsElementRange);
            headElement.appendChild(statsThirdCase)
            if (tier === 'S') sTier.appendChild(headElement);
            else if (tier === 'A') aTier.appendChild(headElement);
            else if (tier === 'B') bTier.appendChild(headElement);
            else cTier.appendChild(headElement);
        });

        document.getElementById('tier-S').appendChild(sTier);
        document.getElementById('tier-A').appendChild(aTier);
        document.getElementById('tier-B').appendChild(bTier);
        document.getElementById('tier-C').appendChild(cTier);
    }




    function winnerDisplay() {
        const winnerInCategory = document.querySelector(".unit-name")
        winnerInCategory.style.backgroundImage = "linear-gradient(to bottom right, #cfa642, #ffe148, #c39831)";
        const winnerHelp = document.createElement("div")
        winnerHelp.className = ("winner-back");
        winnerInCategory.appendChild(winnerHelp);
    }
    function displayALl() {
        displayUnits()
        winnerDisplay()
    }
// Обновление активной кнопки
    function updateActiveButton() {
        document.getElementById('sort-dps').classList.toggle('active', sortType === 'dps');
        document.getElementById('sort-spa').classList.toggle('active', sortType === 'spa');
    }

// Обработчики для кнопок
    document.getElementById('sort-dps').addEventListener('click', () => {
        sortType = 'dps';
        updateActiveButton();
        displayALl();
    });
    document.getElementById('sort-spa').addEventListener('click', () => {
        sortType = 'spa';
        updateActiveButton();
        displayALl();
    });
    document.getElementById('sort-pps').addEventListener('click', () => { // Новый обработчик
        sortType = 'pps';
        updateActiveButton();
        displayALl();
    });
    displayALl();

});