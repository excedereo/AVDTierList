function PPSCalculator(range, aoe, aoe_dop, damage, speed) {
    // Твой код функции без изменений
    const WIDTH = 1000;
    const HEIGHT = 600;
    const LINE_Y = HEIGHT / 2;
    const CELL_SIZE = 1;

    function pointInSector(px, py, cx, cy, radius, angleDeg, fovDeg) {
        const dx = px - cx;
        const dy = py - cy;
        if (dx * dx + dy * dy > radius * radius) return false;
        let pointAngle = (Math.atan2(dy, dx) * 180 / Math.PI) % 360;
        if (pointAngle < 0) pointAngle += 360;
        const left = (angleDeg - fovDeg / 2) % 360;
        const right = (angleDeg + fovDeg / 2) % 360;
        return left <= right ? pointAngle >= left && pointAngle <= right : pointAngle >= left || pointAngle <= right;
    }

    function optimize(radius, fov) {
        let best = { count: -1, y: null, angle: null };
        const centerX = WIDTH / 2;
        for (let y = LINE_Y; y <= HEIGHT; y++) {
            for (let angle of [0, 90, 180, 270]) {
                let count = 0;
                for (let cx = 0; cx <= WIDTH; cx += CELL_SIZE) {
                    if (pointInSector(cx, LINE_Y, centerX, y, radius, angle, fov)) count++;
                }
                if (count > best.count) {
                    best = { count, y, angle };
                }
            }
        }
        return best;
    }

    let sumCount;
    switch (aoe.toLowerCase()) {
        case 'full':
            sumCount = range * 2;
            break;
        case 'circle':
            sumCount = aoe_dop;
            break;
        case 'splash':
        case 'stadium':
            sumCount = aoe_dop;
            break;
        case 'cone':
            const { count } = optimize(range, aoe_dop);
            sumCount = count - 1;
            break;
        case 'line':
            sumCount = range;
            break;
        case 'single':
            sumCount = 1;
            break;
        default:
            sumCount = 1;
    }

    return Math.round((damage / speed) * sumCount);
}

// Делаем функцию глобальной
window.PPSCalculator = PPSCalculator;