const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const circles = [];

let isDrawing = false;
let startX, startY;

function drawCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    const color = getRandomColor();
    ctx.fillStyle = color;
    ctx.fill();
    return { x, y, radius, color };
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function hitTest(x, y) {
    for (const circle of circles) {
        const dx = x - circle.x;
        const dy = y - circle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= circle.radius) {
            return circle;
        }
    }
    return null;
}

canvas.addEventListener('mousedown', (e) => {
    if (e.detail === 2) { // Check if it's a double click
        const x = e.clientX;
        const y = e.clientY;
        const circle = hitTest(x, y);
        if (circle) {
            const index = circles.indexOf(circle);
            circles.splice(index, 1);
            redraw();
        }
    } else {
        const x = e.clientX;
        const y = e.clientY;
        const radius = 10;
        startX = x;
        startY = y;
        isDrawing = true;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const x = e.clientX;
    const y = e.clientY;
    redraw();
    drawCircle(startX, startY, Math.sqrt((x - startX) ** 2 + (y - startY) ** 2));
});

canvas.addEventListener('mouseup', () => {
    if (!isDrawing) return;
    isDrawing = false;
    const x = event.clientX;
    const y = event.clientY;
    const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
    circles.push(drawCircle(startX, startY, radius));
});

canvas.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const circle = hitTest(x, y);
    if (circle) {
        document.body.style.cursor = 'pointer';
        document.getElementById('hitStatus').textContent = 'Hit';
    } else {
        document.body.style.cursor = 'default';
        document.getElementById('hitStatus').textContent = 'Miss';
    }
});

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
    });
}

document.getElementById('resetBtn').addEventListener('click', () => {
    circles.length = 0;
    redraw();
});
