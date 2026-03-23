const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

const STAR_COUNT = 300;

let stars = [];
let width, height;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

function createStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: randomBetween(0.3, 1.6),
        opacity: randomBetween(0.3, 1),
        twinkleSpeed: randomBetween(0.005, 0.02),
        twinkleDir: Math.random() < 0.5 ? 1 : -1,
    }));
}

function drawStars() {
    stars.forEach(s => {
        // Twinkle
        s.opacity += s.twinkleSpeed * s.twinkleDir;
        if (s.opacity >= 1)  { s.opacity = 1;   s.twinkleDir = -1; }
        if (s.opacity <= 0.1){ s.opacity = 0.1; s.twinkleDir =  1; }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 215, 255, ${s.opacity})`;
        ctx.fill();
    });
}

function loop() {
    ctx.clearRect(0, 0, width, height);
    drawStars();
    requestAnimationFrame(loop);
}

// ── Panel navigation ──────────────────────────
const hero = document.getElementById('hero');

function openPanel(id) {
    // Hide hero
    hero.classList.add('hidden');

    // Close any open panel first
    document.querySelectorAll('.panel.visible').forEach(p => p.classList.remove('visible'));

    const panel = document.getElementById('panel-' + id);
    if (panel) {
        // Small delay so the hero fade-out starts first
        setTimeout(() => panel.classList.add('visible'), 80);
    }
}

function closePanel() {
    document.querySelectorAll('.panel.visible').forEach(p => p.classList.remove('visible'));
    hero.classList.remove('hidden');
}

document.querySelectorAll('.links a[data-panel]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        openPanel(link.dataset.panel);
    });
});

document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', closePanel);
});

// ── Starfield ─────────────────────────────────
window.addEventListener('resize', () => {
    resize();
    createStars();
});

resize();
createStars();
loop();