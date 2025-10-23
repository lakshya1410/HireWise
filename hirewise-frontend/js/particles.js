/**
 * Particle Background Animation
 * Creates an animated particle canvas background for all pages
 */

class ParticleBackground {
  constructor(canvasId = 'particle-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 100;
    this.connectionDistance = 150;
    
    this.init();
  }

  init() {
    this.resizeCanvas();
    this.createParticles();
    this.animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }
  }

  drawParticles() {
    // Create solid dark navy background matching landing page
    this.ctx.fillStyle = '#1a1f3a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Add subtle border glow effect
    this.ctx.strokeStyle = 'rgba(0, 172, 193, 0.2)';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw corner accents
    this.drawCornerAccents();
    
    // Draw particles with glow effect
    this.particles.forEach(particle => {
      // Outer glow
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius + 2, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 172, 193, 0.2)';
      this.ctx.fill();
      
      // Inner particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 172, 193, 0.8)';
      this.ctx.fill();
    });

    // Draw connections with enhanced visibility
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          const opacity = (1 - distance / this.connectionDistance) * 0.4;
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(0, 172, 193, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  drawCornerAccents() {
    const cornerSize = 50;
    const lineWidth = 3;
    
    this.ctx.strokeStyle = 'rgba(0, 172, 193, 0.6)';
    this.ctx.lineWidth = lineWidth;
    
    // Top-left corner
    this.ctx.beginPath();
    this.ctx.moveTo(0, cornerSize);
    this.ctx.lineTo(0, 0);
    this.ctx.lineTo(cornerSize, 0);
    this.ctx.stroke();
    
    // Top-right corner
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width - cornerSize, 0);
    this.ctx.lineTo(this.canvas.width, 0);
    this.ctx.lineTo(this.canvas.width, cornerSize);
    this.ctx.stroke();
    
    // Bottom-left corner
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.height - cornerSize);
    this.ctx.lineTo(0, this.canvas.height);
    this.ctx.lineTo(cornerSize, this.canvas.height);
    this.ctx.stroke();
    
    // Bottom-right corner
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width - cornerSize, this.canvas.height);
    this.ctx.lineTo(this.canvas.width, this.canvas.height);
    this.ctx.lineTo(this.canvas.width, this.canvas.height - cornerSize);
    this.ctx.stroke();
  }

  updateParticles() {
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
    });
  }

  animate() {
    this.drawParticles();
    this.updateParticles();
    requestAnimationFrame(() => this.animate());
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ParticleBackground();
});
