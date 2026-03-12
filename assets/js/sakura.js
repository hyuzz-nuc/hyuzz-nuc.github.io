/**
 * 樱花飘落特效
 * 基于 Canvas 实现，轻量高性能
 */
(function() {
  // 配置项 - 可根据性能调整
  const config = {
    particleCount: 20,        // 花瓣数量（减少以提升性能）
    particleSize: [6, 12],    // 花瓣大小范围
    fallSpeed: [0.5, 2],      // 飘落速度（调慢更优雅）
    swaySpeed: 0.015,         // 摇摆速度
    swayAmplitude: 25,        // 摇摆幅度
    colors: ['#ffb7c5', '#ffc0cb', '#ffd1dc', '#ffe4e1', '#ffeff5'] // 樱花粉色系
  };

  // 创建 Canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'sakura-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  let particles = [];

  // 调整 Canvas 尺寸
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  // 花瓣类
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * -height;
      this.size = config.particleSize[0] + Math.random() * (config.particleSize[1] - config.particleSize[0]);
      this.speedY = config.fallSpeed[0] + Math.random() * (config.fallSpeed[1] - config.fallSpeed[0]);
      this.speedX = Math.random() * 2 - 1;
      this.swayPhase = Math.random() * Math.PI * 2;
      this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.swayPhase) * config.swaySpeed * config.swayAmplitude;
      this.swayPhase += config.swaySpeed;
      this.rotation += this.rotationSpeed;

      // 超出边界重置
      if (this.y > height + this.size) {
        this.reset();
      }
      if (this.x > width + this.size || this.x < -this.size) {
        this.x = Math.random() * width;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      
      // 绘制花瓣形状
      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.bezierCurveTo(
        this.size / 2, -this.size / 4,
        this.size / 2, this.size / 4,
        0, this.size / 2
      );
      ctx.bezierCurveTo(
        -this.size / 2, this.size / 4,
        -this.size / 2, -this.size / 4,
        0, -this.size / 2
      );
      ctx.closePath();
      
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.restore();
    }
  }

  // 初始化花瓣
  function init() {
    resize();
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      const p = new Particle();
      p.y = Math.random() * height; // 初始随机分布
      particles.push(p);
    }
  }

  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  // 事件监听
  window.addEventListener('resize', resize);

  // 启动
  init();
  animate();

  // 移动端/性能敏感设备自动禁用
  if (window.innerWidth < 1200 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)) {
    canvas.style.display = 'none';
  }
})();
