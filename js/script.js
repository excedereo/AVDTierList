
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


            nameElement.textContent = unit.displayName;
            imgElement.src = `images/units/${unitKey}.webp`;
            imgElement.onerror = () => { imgElement.src = 'images/default.jpg'; };

// Парсим aoe
            const [aoeType, aoeValue] = unit.aoe.split(' ').length > 1
                ? [unit.aoe.split(' ')[1].toLowerCase(), parseFloat(unit.aoe.split(' ')[0])]
                : [unit.aoe.toLowerCase(), 0];

            // Вычисляем PPS
            const pps = window.PPSCalculator(unit.range, aoeType, aoeValue, unit.damage, unit.spa);


            const statsElementDamage = document.createElement('div'); // Новый элемент для характеристик
            statsElementDamage.className = 'unit-stats'; // Класс для стилизации характеристик
            statsElementDamage.innerHTML = `
                <div class="single-stat">
                    <img class="stats-icons" src="images/stats/damage.webp">${unit.damage.toLocaleString('de-DE')}
                </div>
                <div class="single-stat">
                    <img class="stats-icons" src="images/stats/spa.webp">${unit.spa}
                </div>
                <div class="single-stat">
                    <img class="stats-icons" src="images/stats/dps.webp">${(Math.round(unit.damage/unit.spa)).toLocaleString('de-DE')}
                </div>
            `;

            const statsElementRange = document.createElement('div'); // Новый элемент для характеристик
            statsElementRange.className = 'unit-stats'; // Класс для стилизации характеристик
            statsElementRange.innerHTML = `
                <div class="single-stat">
                    <img class="stats-icons" src="images/stats/range.webp">${unit.range}
                </div>
                <div class="single-stat">
                    ${unit.aoe}
                </div>
                <div class="single-stat">
                    <img class="stats-icons" src="images/stats/pps.webp">${(pps.toLocaleString('de-DE'))}
                </div>
            `;

            unitElement.appendChild(imgElement);
            unitElement.appendChild(nameElement);
            headElement.appendChild(unitElement);
            headElement.appendChild(statsElementDamage);
            headElement.appendChild(statsElementRange);

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





// Обновление активной кнопки
    function updateActiveButton() {
        document.getElementById('sort-dps').classList.toggle('active', sortType === 'dps');
        document.getElementById('sort-spa').classList.toggle('active', sortType === 'spa');
    }

// Обработчики для кнопок
    document.getElementById('sort-dps').addEventListener('click', () => {
        sortType = 'dps';
        updateActiveButton();
        displayUnits();
    });

    document.getElementById('sort-spa').addEventListener('click', () => {
        sortType = 'spa';
        updateActiveButton();
        displayUnits();
    });

    document.addEventListener('DOMContentLoaded', () => {
        displayUnits();
    });

    document.getElementById('sort-pps').addEventListener('click', () => { // Новый обработчик
        sortType = 'pps';
        updateActiveButton();
        displayUnits();
    });
    displayUnits();
});