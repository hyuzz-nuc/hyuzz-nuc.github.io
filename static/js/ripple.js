/**
 * 点击光晕扩散特效
 * 点击任意位置产生渐变光环向外扩散
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
  
  let ripples = [];
  
  // 调整画布大小
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  // 点击创建光晕
  document.addEventListener('click', function(e) {
    // 创建 3 层光晕，更有层次感
    for (let i = 0; i < 3; i++) {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        opacity: 0.8,
        speed: 3 + i * 2,
        color: i === 0 ? 'rgba(255, 255, 255,' : 
               i === 1 ? 'rgba(186, 85, 211,' : 
                         'rgba(138, 43, 226,'
      });
    }
  });
  
  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];
      
      // 创建渐变光晕
      const gradient = ctx.createRadialGradient(
        ripple.x, ripple.y, 0,
        ripple.x, ripple.y, ripple.radius
      );
      
      gradient.addColorStop(0, ripple.color + '0)');
      gradient.addColorStop(0.4, ripple.color + (ripple.opacity * 0.5) + ')');
      gradient.addColorStop(1, ripple.color + '0)');
      
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // 扩大光晕
      ripple.radius += ripple.speed;
      ripple.opacity -= 0.015;
      
      // 移除消失的光晕
      if (ripple.opacity <= 0) {
        ripples.splice(i, 1);
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
})();
