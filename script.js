// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');

// const canvasWidth = canvas.width = window.innerWidth;
// const canvasHeight = canvas.height = window.innerHeight;

// const particles = 500;
// const radius = 200;
// let rotation = 0;
// let angleOffset = 0; // New variable to track the "morphing" angle

// function draw(){
//     ctx.clearRect(0, 0, canvasWidth, canvasHeight);
//     ctx.save();
//     ctx.translate(canvasWidth / 2, canvasHeight / 2);

//     // The core Fibonacci angle is ~2.399 radians (137.5 degrees)
//     // We'll use angleOffset to deviate from this over time
//     const baseAngle = (137.5 * Math.PI / 180) + Math.sin(angleOffset) * 0.05;

//     for (let i = 0; i < particles; i++){
//         const y = 1 - (i / (particles - 1)) * 2;
//         const yRadius = Math.sqrt(1 - y * y);
        
//         // const theta = 137.5 * (Math.PI / 270) * i + rotation;

//         // Use the dynamic baseAngle here
//         const theta = i * baseAngle + rotation;

//         const x = Math.cos(theta) * yRadius;
//         const z = Math.sin(theta) * yRadius;

//         const perspective = 500 / (500 + (z * radius));
//         const renderX = x * radius * perspective;
//         const renderY = y * radius * perspective;

//         const opacity = (z + 1) / 2;
//         ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;

//         ctx.beginPath();
//         ctx.arc(renderX, renderY, 2 * perspective, 0, Math.PI * 2);
//         ctx.fill();
//     }
    
//     rotation += 0.01;
//     angleOffset += 0.002;  // Changes the internal pattern (morphing)

//     ctx.restore();
//     requestAnimationFrame(draw);
// }

// draw()



// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');

// const canvasWidth = canvas.width = window.innerWidth;
// const canvasHeight = canvas.height = window.innerHeight;

// const particles = 500;
// const radius = 200;
// let rotation = 0;
// let angleOffset = 0; // New variable to track the "morphing" angle
// const time = performance.now();

// function draw(){
//     ctx.clearRect(0, 0, canvasWidth, canvasHeight);
//     ctx.save();
//     ctx.translate(canvasWidth / 2, canvasHeight / 2);

//     // The core Fibonacci angle is ~2.399 radians (137.5 degrees)
//     // We'll use angleOffset to deviate from this over time
//     const baseAngle = (137.5 * Math.PI / 180) + Math.sin(angleOffset) * 0.05;

//     for (let i = 0; i < particles; i++){
//         const y = 1 - (i / (particles - 1)) * 2;
//         const yRadius = Math.sqrt(1 - y * y);
        
//         // const theta = 137.5 * (Math.PI / 270) * i + rotation;

//         // Use the dynamic baseAngle here
//         const theta = i * baseAngle + rotation;

//         const x = Math.cos(theta) * yRadius;
//         const z = Math.sin(theta) * yRadius;

//         const perspective = 500 / (500 + (z * radius));
//         const renderX = x * radius * perspective;
//         const renderY = y * radius * perspective;

//         const opacity = (z + 1) / 2;
//         ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;

//         ctx.beginPath();
//         ctx.arc(renderX, renderY, 2 * perspective, 0, Math.PI * 2);
//         ctx.fill();
//     }
    
//     // rotation += 0.01;
//     rotation += Math.atan(time) * -0.02;
//     angleOffset += 0.002;  // Changes the internal pattern (morphing)

//     ctx.restore();
//     requestAnimationFrame(draw);
// }

// draw()



const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width = window.innerWidth;
const canvasHeight = canvas.height = window.innerHeight;

const particles = 500;
const radius = 200;
let rotation = 0;
let angleOffset = 0; // New variable to track the "morphing" angle
// const time = performance.now();

function draw(){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    // The core Fibonacci angle is ~2.399 radians (137.5 degrees)
    // We'll use angleOffset to deviate from this over time
    const baseAngle = (137.5 * Math.PI / 180) + Math.sin(angleOffset) * 0.05;


    const time = performance.now() * 0.001;

    const majorRadius = 220; // distance from center to ring
    const minorRadius = 80;  // thickness of the tube

    for (let i = 0; i < particles; i++) {

    // Distribute points evenly
    const u = i * baseAngle;
    const v = i * 0.15 + Math.sin(angleOffset) * 0.3;

    // Torus parametric equations
    const x =
        (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u);

    const y =
        minorRadius * Math.sin(v);

    const z =
        (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u);

    // Perspective projection
    const perspective = 600 / (600 + z);

    const renderX = x * perspective;
    const renderY = y * perspective;

    const opacity = Math.max(0.2, perspective - 0.2);

    ctx.fillStyle = `rgba(255,255,255,${opacity})`;

    ctx.beginPath();
    ctx.arc(renderX, renderY, 2 * perspective, 0, Math.PI * 2);
    ctx.fill();
    }

    
    // rotation += 0.01;
    rotation += Math.atan(time) * -0.02;
    angleOffset += 0.002;  // Changes the internal pattern (morphing)

    ctx.restore();
    requestAnimationFrame(draw);
}

draw()

