const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width = window.innerWidth;
const canvasHeight = canvas.height = window.innerHeight;

const particles = 500;
const radius = 200;
let rotation = 0;

function draw(){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    for (let i = 0; i < particles; i++){
        const y = 1 - (i / (particles - 1)) * 2;
        const yRadius = Math.sqrt(1 - y * y);
        
        const theta = 137.5 * (Math.PI / 270) * i + rotation;

        const x = Math.cos(theta) * yRadius;
        const z = Math.sin(theta) * yRadius;

        const perspective = 500 / (500 + (z * radius));
        const renderX = x * radius * perspective;
        const renderY = y * radius * perspective;

        const opacity = (z + 1) / 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;

        ctx.beginPath();
        ctx.arc(renderX, renderY, 2 * perspective, 0, Math.PI * 2);
        ctx.fill();
    }

    rotation += 0.01;
    ctx.restore();
    requestAnimationFrame(draw);
}

draw()
