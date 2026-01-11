const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// ===============================
// CANVAS SETUP (hi-DPI safe)
// ===============================
let WIDTH, HEIGHT, dpr;
let radius, majorRadius, minorRadius;


dpr = window.devicePixelRatio || 1;

canvas.width = WIDTH * dpr;
canvas.height = HEIGHT * dpr;
canvas.style.width = WIDTH + 'px';
canvas.style.height = HEIGHT + 'px';

ctx.scale(dpr, dpr);

// PARAMETERS
const particles = 700;

const minDim = Math.min(WIDTH, HEIGHT);

radius = minDim * 0.28;
majorRadius = minDim * 0.32;
minorRadius = minDim * 0.12;

// const radius = 200;
// const majorRadius = 220;
// const minorRadius = 80;

const baseAngle = 137.5 * Math.PI / 180;

let rotation = 0;
let frame = 0;
const FPS = 60;

function resize() {
    dpr = window.devicePixelRatio || 1;
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    canvas.style.width = WIDTH + 'px';
    canvas.style.height = HEIGHT + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const minDim = Math.min(WIDTH, HEIGHT);
    radius = minDim * 0.28;
    majorRadius = minDim * 0.32;
    minorRadius = minDim * 0.12;
}

resize();
window.addEventListener('resize', resize);


function smoothstep(edge0, edge1, x) {
  x = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return x * x * (3 - 2 * x);
}

// ANIMATION LOOP
function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.save();
    ctx.translate(WIDTH / 2, HEIGHT / 2);

    const time = frame / FPS;

    // ---- morph loop ----
    // Sphere → Torus → Sphere
    const LOOP = 8; // seconds
    const t = (time % LOOP) / LOOP;

    let morph;

    if (t < 0.25) {
        morph = 0;
    } else if (t < 0.5) {
        morph = smoothstep(0.25, 0.5, t);
    } else if (t < 0.75) {
        morph = 1;
    } else {
        morph = 1 - smoothstep(0.75, 1.0, t);
    }


    for (let i = 0; i < particles; i++) {

    // SPHERE POSITION
    const y = 1 - (i / (particles - 1)) * 2;
    const sphereRadius = Math.sqrt(1 - y * y);

    const theta = i * baseAngle + rotation;

    const sx = Math.cos(theta) * sphereRadius * radius;
    const sy = y * radius;
    const sz = Math.sin(theta) * sphereRadius * radius;

    
    // TORUS POSITION
    // Torus motion parameters
    const torusFlow = time * 1.2;
    const torusTwist = Math.sin(time * 0.8) * 0.4;

    const u = i * baseAngle + torusFlow;
    const v = i * 0.15 + torusTwist;

    const tx = (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u);
    const ty = minorRadius * Math.sin(v) * 2;
    const tz = (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u);


    // SHAPE MORPH 
    const x = sx * (1 - morph) + tx * morph;
    const yPos = sy * (1 - morph) + ty * morph;
    const z = sz * (1 - morph) + tz * morph;


    // PERSPECTIVE PROJECTION
    const perspective = 600 / (600 + z);
    const renderX = x * perspective;
    const renderY = yPos * perspective;


    // VISUAL STYLE
    const size = 2.2 * perspective;
    const opacity = Math.min(1, perspective);

    ctx.fillStyle = `rgba(255,255,255,${opacity})`;
    ctx.beginPath();
    ctx.arc(renderX, renderY, size, 0, Math.PI * 2);
    ctx.fill();
    }

    rotation += 0.01;
    frame++;

    ctx.restore();
    requestAnimationFrame(draw);
}

draw();