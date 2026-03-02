// ParticleEngine.js
export class ParticleEngine {
  constructor() {
    this.particles = [];
  }

  createExplosion(x, y, color, count = 15) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10, // Velocity X
        vy: (Math.random() - 0.5) * 10, // Velocity Y
        life: 1.0,                      // Alpha fade
        color: color,
        size: Math.random() * 4 + 1
      });
    }
  }

  updateAndDraw(context) {
    // Loop backwards so we can remove dead particles safely
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];

      // Update
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05; // Fade speed

      // Dead? Remove it
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      // Draw
      context.beginPath();
      context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      
      // Convert hex/rgb to rgba for fading effect
      context.fillStyle = this.getFadeColor(p.color, p.life);
      context.shadowBlur = 10;
      context.shadowColor = p.color;
      context.fill();
      
      context.shadowBlur = 0; // Reset
    }
  }

  // Simple helper to force an alpha value on standard colors
  getFadeColor(baseColor, alpha) {
    if (baseColor === '#0ff') return `rgba(0, 255, 255, ${alpha})`; // player cyan
    if (baseColor === '#ff00ff') return `rgba(255, 0, 255, ${alpha})`; // ball magenta
    return `rgba(255, 255, 255, ${alpha})`; // fallback white
  }
}
