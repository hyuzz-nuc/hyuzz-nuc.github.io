/* ===================================
   复古卡通风博客 - 交互脚本
   =================================== */

// --- 回到顶部按钮 ---
function initBackToTop() {
  // 创建按钮
  const backToTop = document.createElement('div');
  backToTop.className = 'back-to-top';
  backToTop.id = 'backToTop';
  backToTop.innerHTML = '<span class="back-to-top-arrow">▲</span>';
  document.body.appendChild(backToTop);

  // 点击事件
  backToTop.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 滚动监听
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTop.style.display = 'block';
    } else {
      backToTop.style.display = 'none';
    }
  });
}

// --- 阅读进度条 ---
function initReadingProgress() {
  // 创建进度条
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress-bar';
  progressBar.id = 'readingProgress';
  document.body.appendChild(progressBar);

  // 滚动监听
  window.addEventListener('scroll', function() {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// --- 初始化 ---
document.addEventListener('DOMContentLoaded', function() {
  initBackToTop();
  initReadingProgress();
  console.log('🎮 复古卡通风博客已加载！');
});
