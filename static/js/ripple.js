/**
 * 点击星光闪烁特效
 * 点击任意位置产生闪烁的小星星四散
 */
(function() {
  // 创建 canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  `;
  
  document.body.appendChild(canvas);
  
  let stars = [];
  
  // 调整画布大小
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  // 点击创建星星
  document.addEventListener('click', function(e) {
    // 创建 12 颗小星星
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const speed = 2 + Math.random() * 3;
      stars.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color: ['#ffd700', '#fffacd', '#ffe4b5', '#f0e68c', '#ffffff'][Math.floor(Math.random() * 5)],
        opacity: 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2
      });
    }
  });
  
  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = stars.length - 1; i >= 0; i--) {
      const star = stars[i];
      
      ctx.save();
      ctx.translate(star.x, star.y);
      ctx.rotate(star.rotation);
      
      // 绘制四角星
      ctx.beginPath();
      for (let j = 0; j < 4; j++) {
        const angle = (Math.PI * 2 * j) / 4;
        const outerRadius = star.size;
        const innerRadius = star.size / 2;
        
        ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
        ctx.lineTo(Math.cos(angle + Math.PI / 4) * innerRadius, Math.sin(angle + Math.PI / 4) * innerRadius);
      }
      ctx.closePath();
      
      ctx.fillStyle = star.color;
      ctx.globalAlpha = star.opacity;
      ctx.fill();
      
      // 添加发光效果
      ctx.shadowColor = star.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      
      ctx.restore();
      
      // 更新位置
      star.x += star.vx;
      star.y += star.vy;
      star.vy += 0.1; // 重力
      star.rotation += star.rotationSpeed;
      star.opacity -= 0.02;
      
      // 移除消失的星星
      if (star.opacity <= 0) {
        stars.splice(i, 1);
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
})();
