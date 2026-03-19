/**
 * Sakura 樱花点击特效
 * 基于 cursor-effects 简化版
 */
class SakuraEffect {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.init();
  }

  init() {
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(this.canvas);
    this.resize();
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('click', (e) => this.createSakura(e.clientX, e.clientY));
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createSakura(x, y) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        size: Math.random() * 8 + 4,
        color: `hsl(${330 + Math.random() * 30}, 70%, ${70 + Math.random() * 20}%)`,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        life: 1
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravity
      p.rotation += p.rotationSpeed;
      p.life -= 0.015;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      
      // 绘制樱花花瓣（椭圆形）
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// 自动初始化
new SakuraEffect();
