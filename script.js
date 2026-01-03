// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// let rotation = { x: 0, y: 0 };

// function resizeCanvas(){
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     draw();
// }

// window.addEventListener('resize', resizeCanvas);

// // Mouse move listener for rotation
// document.addEventListener('mousemove', (e) => {
//     rotation.y = (e.clientX / canvas.width) * Math.PI * 2;
//     rotation.x = (e.clientY / canvas.height) * Math.PI * 2;
// });

// function draw(){
//     // Clear canvas
//     ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
    
//     const centerX = canvas.width / 2;
//     const centerY = canvas.height / 2;
//     const sphereRadius = 200;
//     const particleRadius = 2;
//     const density = 15; // Number of particles around the sphere
    
//     // Create particle positions on sphere surface
//     const particles = [];
    
//     for (let lat = 0; lat < Math.PI; lat += Math.PI / density) {
//         for (let lon = 0; lon < Math.PI * 2; lon += Math.PI / density) {
//             // 3D coordinates on sphere
//             const x = sphereRadius * Math.sin(lat) * Math.cos(lon);
//             const y = sphereRadius * Math.sin(lat) * Math.sin(lon);
//             const z = sphereRadius * Math.cos(lat);
            
//             particles.push({ x, y, z });
//         }
//     }
    
//     // Rotate particles based on mouse position
//     const rotated = particles.map(p => {
//         // Rotate around X axis
//         let x = p.x;
//         let y = p.y * Math.cos(rotation.x) - p.z * Math.sin(rotation.x);
//         let z = p.y * Math.sin(rotation.x) + p.z * Math.cos(rotation.x);
        
//         // Rotate around Y axis
//         let x2 = x * Math.cos(rotation.y) + z * Math.sin(rotation.y);
//         let z2 = -x * Math.sin(rotation.y) + z * Math.cos(rotation.y);
        
//         return { x: x2, y, z: z2 };
//     });
    
//     // Sort by z depth (painter's algorithm)
//     rotated.sort((a, b) => a.z - b.z);
    
//     // Draw particles
//     rotated.forEach(p => {
//         const screenX = centerX + p.x;
//         const screenY = centerY + p.y;
        
//         // Color based on depth (z position)
//         const brightness = Math.floor((p.z + sphereRadius) / (sphereRadius * 2) * 255);
//         ctx.fillStyle = `rgb(${brightness}, ${brightness + 50}, 255)`;
        
//         // Draw circular particle using arc
//         ctx.beginPath();
//         ctx.arc(screenX, screenY, particleRadius, 0, Math.PI * 2);
//         ctx.fill();
//     });
    
//     requestAnimationFrame(draw);
// }

// draw();



const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let rotation = { x: 0, y: 0 };
const particles = [];
let sphereRadius = 200;
const density = 15;

function updateSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Set radius to 30% of the smaller screen dimension
    const minDimension = Math.min(canvas.width, canvas.height);
    sphereRadius = minDimension * 0.35; 
    
    // If you moved particle generation to initParticles(), 
    // you must call it again here so they take the new radius!
    initParticles();
}

// 1. Generate particles ONCE
function initParticles() {
    particles.length = 0;
    for (let lat = 0; lat < Math.PI; lat += Math.PI / density) {
        for (let lon = 0; lon < Math.PI * 2; lon += Math.PI / density) {
            particles.push({
                x: sphereRadius * Math.sin(lat) * Math.cos(lon),
                y: sphereRadius * Math.sin(lat) * Math.sin(lon),
                z: sphereRadius * Math.cos(lat)
            });
        }
    }
}

// 2. Handle resizing properly
window.addEventListener('resize', () => {
    updateSize();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

document.addEventListener('mousemove', (e) => {
    // Smoother mapping: -Math.PI to Math.PI
    rotation.y = (e.clientX / canvas.width - 0.5) * Math.PI * 2;
    rotation.x = (e.clientY / canvas.height - 0.5) * Math.PI * 2;
});

document.addEventListener('touchmove', (e) => {
    // 1. Prevent scrolling while interacting with the canvas
    e.preventDefault();

    // 2. Access the first touch point
    const touch = e.touches[0];
    
    // 3. Update rotation using the touch coordinates
    rotation.y = (touch.clientX / canvas.width - 0.5) * Math.PI * 2;
    rotation.x = (touch.clientY / canvas.height - 0.5) * Math.PI * 2;
}, { passive: false }); // 'passive: false' is required to allow preventDefault()

function draw() {
    // Clear with a slight trail effect
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const fieldOfView = 400; // Perspective depth

    // Project and Rotate
    const projected = particles.map(p => {
        // Rotate X
        let y1 = p.y * Math.cos(rotation.x) - p.z * Math.sin(rotation.x);
        let z1 = p.y * Math.sin(rotation.x) + p.z * Math.cos(rotation.x);
        
        // Rotate Y
        let x2 = p.x * Math.cos(rotation.y) + z1 * Math.sin(rotation.y);
        let z2 = -p.x * Math.sin(rotation.y) + z1 * Math.cos(rotation.y);

        // Perspective Scaling
        // Objects further away (smaller z) look smaller
        const scale = fieldOfView / (fieldOfView + z2);
        return {
            x: x2 * scale + centerX,
            y: y1 * scale + centerY,
            z: z2,
            scale: scale
        };
    });

    // Depth sorting (Painter's Algorithm)
    projected.sort((a, b) => b.z - a.z);

    // Draw
    projected.forEach(p => {
        const brightness = Math.floor(((p.z + sphereRadius) / (sphereRadius * 2)) * 255);
        ctx.fillStyle = `rgb(${brightness}, ${brightness + 50}, 255)`;
        
        ctx.beginPath();
        // Multiply radius by scale for perspective
        ctx.arc(p.x, p.y, 2 * p.scale, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(draw);
}

updateSize();

initParticles();
draw();