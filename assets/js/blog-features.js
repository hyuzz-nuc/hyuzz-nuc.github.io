/**
 * 博客增强功能
 * - 阅读进度条
 * - 文章目录折叠/展开
 * - 随机文章
 * - 文章点赞（LeanCloud）
 */

document.addEventListener('DOMContentLoaded', function() {
  // 初始化阅读进度条
  initReadingProgress();
  
  // 初始化目录折叠
  initTocToggle();
  
  // 初始化点赞
  initLike();
});

/**
 * 阅读进度条
 */
function initReadingProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress-bar';
  progressBar.id = 'reading-progress';
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', function() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    
    let progress = 0;
    if (documentHeight > 0) {
      progress = (scrolled / documentHeight) * 100;
    }
    
    progressBar.style.width = progress + '%';
  });
}

/**
 * 文章目录折叠/展开
 */
function initTocToggle() {
  const toc = document.querySelector('.toc');
  if (!toc) return;
  
  const tocContent = toc.querySelector('.inner');
  if (!tocContent) return;
  
  // 创建折叠按钮容器
  const tocHeader = document.createElement('div');
  tocHeader.className = 'toc-header';
  
  const details = toc.querySelector('details');
  const summary = toc.querySelector('summary');
  
  if (summary) {
    // 使用 PaperMod 原有的 details/summary 结构
    summary.style.cursor = 'pointer';
    summary.style.display = 'flex';
    summary.style.justifyContent = 'space-between';
    summary.style.alignItems = 'center';
    
    // 添加切换提示文字
    const toggleText = document.createElement('span');
    toggleText.className = 'toc-toggle-text';
    toggleText.textContent = details.open ? '− 收起' : '+ 展开';
    toggleText.style.fontSize = '12px';
    toggleText.style.color = 'var(--text-gray)';
    toggleText.style.marginLeft = 'auto';
    
    summary.appendChild(toggleText);
    
    details.addEventListener('toggle', function() {
      toggleText.textContent = details.open ? '− 收起' : '+ 展开';
    });
  }
}

/**
 * 随机文章
 */
async function goToRandomPost() {
  try {
    // 从 JSON 索引获取所有文章
    const response = await fetch('/index.json');
    const data = await response.json();
    
    // 过滤出文章（排除首页、关于页、归档页等，只保留 /posts/ 目录的文章）
    const posts = data.filter(item => 
      item.permalink && 
      item.permalink.includes('/posts/')
    );
    
    console.log('总文章数:', data.length, '过滤后:', posts.length);
    
    if (posts.length === 0) {
      showToast('暂无文章');
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * posts.length);
    const randomPost = posts[randomIndex];
    
    // 显示提示
    showToast('🎯 随机前往：' + randomPost.title);
    console.log('随机文章:', randomPost.title, randomPost.permalink);
    
    // 延迟 1 秒跳转，让用户看到提示
    setTimeout(() => {
      window.location.href = randomPost.permalink;
    }, 800);
  } catch (error) {
    console.error('获取文章列表失败:', error);
    showToast('随机文章功能暂时不可用');
  }
}

/**
 * 显示提示消息（替代 alert）
 */
function showToast(message) {
  // 检查是否已存在 toast
  let toast = document.getElementById('toast-message');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-message';
    toast.style.position = 'fixed';
    toast.style.top = '50%';
    toast.style.left = '50%';
    toast.style.transform = 'translate(-50%, -50%)';
    toast.style.background = 'rgba(0, 0, 0, 0.85)';
    toast.style.color = '#fff';
    toast.style.padding = '20px 40px';
    toast.style.borderRadius = '8px';
    toast.style.fontSize = '14px';
    toast.style.zIndex = '99999';
    toast.style.textAlign = 'center';
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.style.display = 'block';
  
  setTimeout(() => {
    toast.style.display = 'none';
  }, 2000);
}

/**
 * 文章点赞（LeanCloud）
 */
function initLike() {
  const likeBtn = document.getElementById('like-btn');
  const likeCountEl = document.getElementById('like-count');
  
  if (!likeBtn || !likeCountEl) return;
  
  // 初始化 LeanCloud
  const appId = likeBtn.dataset.appId;
  const appKey = likeBtn.dataset.appKey;
  
  if (!appId || !appKey) {
    console.error('LeanCloud 配置缺失');
    return;
  }
  
  AV.init({ appId, appKey });
  
  const Like = AV.Object.extend('Like');
  const articleId = likeBtn.dataset.articleId;
  
  // 查询当前文章点赞数
  const query = new AV.Query(Like);
  query.equalTo('articleId', articleId);
  
  query.count().then(function(count) {
    likeCountEl.textContent = count;
  }).catch(function(error) {
    console.error('查询点赞数失败:', error);
  });
  
  // 检查是否已点赞
  const hasLiked = localStorage.getItem('liked_' + articleId);
  if (hasLiked) {
    likeBtn.classList.add('liked');
    likeBtn.querySelector('.like-icon').textContent = '❤️';
  }
  
  // 点赞点击
  likeBtn.addEventListener('click', function() {
    if (likeBtn.classList.contains('liked')) {
      // 取消点赞（可选功能，这里不做取消）
      return;
    }
    
    const like = new Like();
    like.set('articleId', articleId);
    like.set('articleTitle', likeBtn.dataset.articleTitle);
    
    like.save().then(function() {
      // 更新本地计数
      const currentCount = parseInt(likeCountEl.textContent) || 0;
      likeCountEl.textContent = currentCount + 1;
      
      // 标记已点赞
      likeBtn.classList.add('liked');
      likeBtn.querySelector('.like-icon').textContent = '❤️';
      localStorage.setItem('liked_' + articleId, 'true');
    }).catch(function(error) {
      console.error('点赞失败:', error);
      alert('点赞失败，请稍后重试');
    });
  });
}
