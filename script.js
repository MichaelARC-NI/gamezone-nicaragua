// ===== PARTICLES ENGINE =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function getAccentColor() {
    const style = getComputedStyle(document.body);
    return style.getPropertyValue('--accent').trim();
}

function createParticle() {
    const accent = getAccentColor();
    const isGem = Math.random() > 0.85;
    return {
        x: Math.random() * canvas.width,
        y: canvas.height + 20,
        size: isGem ? 8 + Math.random() * 12 : 2 + Math.random() * 3,
        speedY: -0.3 - Math.random() * 0.7,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: 0.2 + Math.random() * 0.5,
        rotate: Math.random() * 360,
        rotateSpeed: (Math.random() - 0.5) * 2,
        isGem,
        color: isGem ? accent : `rgba(255,255,255,${0.1 + Math.random() * 0.2})`,
        life: 0,
        maxLife: 300 + Math.random() * 400
    };
}

for (let i = 0; i < 35; i++) {
    const p = createParticle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
}

function drawGem(x, y, size, rotate, color, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotate * Math.PI / 180);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    const s = size / 2;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.7, 0);
    ctx.lineTo(0, s);
    ctx.lineTo(-s * 0.7, 0);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.5);
    ctx.lineTo(s * 0.35, 0);
    ctx.lineTo(0, s * 0.5);
    ctx.lineTo(-s * 0.35, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (Math.random() > 0.6 && particles.length < 70) particles.push(createParticle());
    particles = particles.filter(p => p.life < p.maxLife);
    const accent = getAccentColor();
    particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotate += p.rotateSpeed;
        p.life++;
        const fade = p.life < 60 ? p.life / 60 : 1;
        const fadeOut = p.life > p.maxLife - 60 ? (p.maxLife - p.life) / 60 : 1;
        const op = p.opacity * fade * fadeOut;
        if (p.isGem) {
            p.color = accent;
            drawGem(p.x, p.y, p.size, p.rotate, accent, op);
        } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = op * 0.4;
            ctx.fill();
        }
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== THEME SWITCHER =====
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.body.className = btn.dataset.theme;
    });
});

// ===== TABS SYSTEM =====
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById('section-' + btn.dataset.section).classList.add('active');
    });
});

// ===== DATA & TIENDA CORE =====
const WA = '50583341349';
const fmt = n => n.toLocaleString('es-NI');

function renderCards(containerId, items, icon, badgeLabel) {
    const container = document.getElementById(containerId);
    items.forEach((item, idx) => {
        const isBest = idx === 2 || idx === 3;
        const msg = `Hola Michael, quiero comprar el paquete oficial de ${item.titulo} por C$ ${item.precio} Córdobas para mi ID.`;
        const url = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            ${isBest ? '<div class="card-badge best">⭐ Más Vendido</div>' : `<div class="card-badge">${badgeLabel}</div>`}
            <div>
                <span class="card-icon">${icon}</span>
                <div class="card-title">${item.titulo}</div>
                <div class="card-desc">${item.desc || ''}</div>
            </div>
            <div>
                <div class="price">C$ ${fmt(item.precio)} <small>netos</small></div>
                <a href="${url}" target="_blank" class="btn-buy">Comprar por WhatsApp</a>
            </div>
        `;
        container.appendChild(card);
    });
}

// 💎 1. FREE FIRE (Formato idéntico al original)
const diamantes = [
    { titulo: '100 + 10 Diamantes', desc: 'Bono Garena 10% incluido', precio: 40 },
    { titulo: '310 + 31 Diamantes', desc: 'Bono Garena 10% incluido', precio: 120 },
    { titulo: '520 + 52 Diamantes', desc: 'Bono Garena 10% incluido', precio: 200 },
    { titulo: '1,060 + 106 Diamantes', desc: 'Bono Garena 10% incluido', precio: 400 },
    { titulo: '2,180 + 218 Diamantes', desc: 'Bono Garena 10% incluido', precio: 800 },
    { titulo: '5,600 + 560 Diamantes', desc: 'Bono Garena 10% incluido', precio: 2030 }
];
renderCards('tienda-diamantes', diamantes, '💎', 'Free Fire');

// 🔫 2. FUERZA DELTA (Datos exactos de tu video en Pagostore)
const delta = [
    { titulo: '18 + 2 Delta Coins', desc: 'Bono promocional Pagostore', precio: 20 },
    { titulo: '30 + 3 Delta Coins', desc: 'Bono promocional Pagostore', precio: 35 },
    { titulo: '60 + 6 Delta Coins', desc: 'Bono promocional Pagostore', precio: 65 },
    { titulo: '300 + 52 Delta Coins', desc: 'Bono promocional Pagostore', precio: 300 },
    { titulo: '420 + 87 Delta Coins', desc: 'Bono promocional Pagostore', precio: 420 },
    { titulo: '680 + 146 Delta Coins', desc: 'Bono promocional Pagostore', precio: 680 },
    { titulo: '1,280 + 348 Delta Coins', desc: 'Bono de alta fidelidad', precio: 1250 },
    { titulo: '1,680 + 498 Delta Coins', desc: 'Bono de alta fidelidad', precio: 1650 },
    { titulo: '3,280 + 1,066 Delta Coins', desc: 'Bono Élite verificado', precio: 3100 },
    { titulo: '6,480 + 2,480 Delta Coins', desc: 'Bono Élite verificado', precio: 6100 },
    { titulo: '12,960 + 4,860 Delta Coins', desc: 'Bono Maestro de batalla', precio: 11900 },
    { titulo: '19,440 + 7,290 Delta Coins', desc: 'Gran bono final de video', precio: 17800 }
];
renderCards('tienda-delta', delta, '🔫', 'Fuerza Delta');

// 🏐 3. HAIKYU!! (Datos planos exactos de la segunda parte de tu video)
const haikyu = [
    { titulo: '60 Monedas', desc: 'Paquete básico de apertura', precio: 50 },
    { titulo: '300 Monedas', desc: 'Paquete intermedio de fichaje', precio: 240 },
    { titulo: '980 Monedas', desc: 'Paquete avanzado de club', precio: 750 },
    { titulo: '1,980 Monedas', desc: 'Paquete de Élite deportiva', precio: 1450 },
    { titulo: '3,280 Monedas', desc: 'Paquete de campeonato oficial', precio: 2400 },
    { titulo: '6,480 Monedas', desc: 'Caja Leyenda definitiva', precio: 4600 }
];
renderCards('tienda-haikyu', haikyu, '🏐', 'Haikyu!!');

// ===== ANIMATED COUNTERS =====
function animateCounter(el, target) {
    let current = 0;
    const step = Math.ceil(target / 50);
    const interval = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(interval); }
        el.textContent = current.toLocaleString('es-NI') + '+';
    }, 25);
}

const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            animateCounter(document.getElementById('d-clientes'), 1547);
            animateCounter(document.getElementById('d-entregas'), 3200);
            animateCounter(document.getElementById('d-paquetes'), diamantes.length);
            obs.disconnect();
        }
    });
}, { threshold: 0.3 });
obs.observe(document.getElementById('stats-diamantes'));
