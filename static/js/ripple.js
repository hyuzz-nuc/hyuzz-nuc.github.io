/**
 * 点击水波纹特效
 * 点击任意位置产生扩散的圆形波纹
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
  
  let waves = [];
  
  // 调整画布大小
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  // 点击创建波纹
  document.addEventListener('click', function(e) {
    waves.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      opacity: 1,
      color: `hsla(${Math.random() * 360}, 70%, 60%, 0.6)`
    });
  });
  
  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = waves.length - 1; i >= 0; i--) {
      const wave = waves[i];
      
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      ctx.strokeStyle = wave.color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = wave.opacity;
      ctx.stroke();
      
      // 扩大波纹
      wave.radius += 4;
      wave.opacity -= 0.02;
      
      // 移除消失的波纹
      if (wave.opacity <= 0) {
        waves.splice(i, 1);
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
})();
