class ParticleSystem {
    constructor() {
        this.container = document.querySelector('.hero');
        this.mouse = { x: 0, y: 0 };
        this.particles = [];
        this.links = [];
        
        // Canvas setup
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas style for proper positioning
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';  // Ensure it's above the background but below content
        
        // Insert canvas at the start of hero section
        this.container.style.position = 'relative';  // Ensure container is positioned
        this.container.insertBefore(this.canvas, this.container.firstChild);
        
        // Configuration
        this.config = {
            particleCount: 100,  // Increased for better effect
            particleSize: {
                min: 1,
                max: 3
            },
            particleOpacity: {
                min: 0.3,
                max: 0.8
            },
            linkDistance: 150,
            linkOpacity: 0.8,  // Increased for better visibility
            linkWidth: 1,
            moveSpeed: 1,  // Reduced for smoother movement
            repulseDistance: 100,
            repulseStrength: 100
        };
        
        // Initialize
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
        this.updateColors(); // Initial color setup
    }
    
    updateColors() {
        // Check if the theme is light
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
        this.particleColor = isLightMode ? '#ff0099' : '#ffffff';
    }
    
    createParticles() {
        this.particles = [];  // Clear existing particles
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,  // Reduced velocity
                vy: (Math.random() - 0.5) * 0.5,  // Reduced velocity
                size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
                opacity: Math.random() * (this.config.particleOpacity.max - this.config.particleOpacity.min) + this.config.particleOpacity.min
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Listen for theme changes
        const observer = new MutationObserver(() => {
            this.updateColors();
        });
        observer.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ['data-theme'] 
        });
    }
    
    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.createParticles();  // Recreate particles with new dimensions
    }
    
    onMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = event.clientX - rect.left;
        this.mouse.y = event.clientY - rect.top;
    }
    
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${this.hexToRgb(this.particleColor)}, ${particle.opacity})`;
        this.ctx.fill();
    }
    
    drawLink(p1, p2, distance) {
        const opacity = (1 - (distance / this.config.linkDistance)) * this.config.linkOpacity;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = `rgba(${this.hexToRgb(this.particleColor)}, ${opacity})`;
        this.ctx.lineWidth = this.config.linkWidth;
        this.ctx.stroke();
    }
    
    // Helper function to convert hex to rgb
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '255, 255, 255';
    }
    
    update() {
        this.particles.forEach(particle => {
            // Move particles
            particle.x += particle.vx * this.config.moveSpeed;
            particle.y += particle.vy * this.config.moveSpeed;
            
            // Bounce off edges with some margin
            const margin = 50;
            if (particle.x < -margin) particle.x = this.canvas.width + margin;
            if (particle.x > this.canvas.width + margin) particle.x = -margin;
            if (particle.y < -margin) particle.y = this.canvas.height + margin;
            if (particle.y > this.canvas.height + margin) particle.y = -margin;
            
            // Mouse repulsion
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.repulseDistance) {
                    const force = (this.config.repulseDistance - distance) / this.config.repulseDistance;
                    const angle = Math.atan2(dy, dx);
                    particle.vx -= force * Math.cos(angle) * 0.02;
                    particle.vy -= force * Math.sin(angle) * 0.02;
                }
            }
        });
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw links
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.linkDistance) {
                    this.drawLink(this.particles[i], this.particles[j], distance);
                }
            }
        }
        
        // Draw particles
        this.particles.forEach(particle => this.drawParticle(particle));
    }
    
    animate = () => {
        requestAnimationFrame(this.animate);
        this.update();
        this.draw();
    }
    
    cleanup() {
        window.removeEventListener('resize', this.resize);
        window.removeEventListener('mousemove', this.onMouseMove);
        if (this.container.contains(this.canvas)) {
            this.container.removeChild(this.canvas);
        }
    }
} 