// 鼠标移动散开背景图 + 中间封面跟随
document.querySelector('.cover-wall').addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  const mainCover = document.querySelector('.main-cover');
  mainCover.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;

  const subCovers = document.querySelectorAll('.sub-cover');
  subCovers.forEach((cover, index) => {
    const reverseX = x * (0.5 - index * 0.2);
    const reverseY = y * (0.5 - index * 0.2);
    cover.style.transform = `translate(${reverseX}px, ${reverseY}px)`;
  });

  // 背景图片鼠标散开效果
  const mouseX = e.clientX;
  const items = document.querySelectorAll('.static-cover');
  items.forEach(item => {
    let rect = item.getBoundingClientRect();
    let itemCenter = rect.left + rect.width / 2;
    let offset = (itemCenter - mouseX) * 0.08;
    item.style.transform = `translateX(${offset}px)`;
  });
});

// 鼠标离开恢复原样
document.querySelector('.cover-wall').addEventListener('mouseleave', () => {
  document.querySelectorAll('.static-cover').forEach(item => {
    item.style.transform = 'translateX(0)';
  });
});

// 页面加载动画
window.addEventListener('load', () => {
  document.querySelectorAll('.static-cover').forEach(cover => {
    cover.style.opacity = 1;
  });

  const dynamicCovers = document.querySelectorAll('.dynamic-cover');
  dynamicCovers.forEach((cover, index) => {
    cover.style.opacity = 0;
    cover.style.transform += ' scale(0.8)';
    
    setTimeout(() => {
      cover.style.opacity = 1;
      cover.style.transform = cover.style.transform.replace(' scale(0.8)', '') + ' scale(1)';
    }, 400 + index * 300);
  });
});