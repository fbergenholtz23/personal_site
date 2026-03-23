const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

const STAR_COUNT = 300;
const SHOOTING_STAR_INTERVAL = 3500; // ms between shooting stars

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

// Shooting stars
let shootingStars = [];

function spawnShootingStar() {
    const angle = randomBetween(20, 50) * (Math.PI / 180);
    const speed = randomBetween(6, 14);
    shootingStars.push({
        x: randomBetween(0, width * 0.7),
        y: randomBetween(0, height * 0.4),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: randomBetween(80, 180),
        opacity: 1,
        fade: randomBetween(0.012, 0.025),
    });
}

function drawShootingStars() {
    shootingStars = shootingStars.filter(s => s.opacity > 0);

    shootingStars.forEach(s => {
        const tailX = s.x - s.vx * (s.length / 10);
        const tailY = s.y - s.vy * (s.length / 10);

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(200, 220, 255, 0)`);
        grad.addColorStop(1, `rgba(220, 235, 255, ${s.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        s.x += s.vx;
        s.y += s.vy;
        s.opacity -= s.fade;
    });
}

function loop() {
    ctx.clearRect(0, 0, width, height);
    drawStars();
    drawShootingStars();
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

setInterval(spawnShootingStar, SHOOTING_STAR_INTERVAL);

resize();
createStars();
loop();