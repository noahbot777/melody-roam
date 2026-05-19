// 鼠标移动散开背景图 + 中间封面跟随
(function () {
  const coverWall = document.querySelector('.cover-wall');
  if (!coverWall) return;

  coverWall.addEventListener('mousemove', function (e) {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    const mainCover = document.querySelector('.main-cover');
    if (mainCover) {
      mainCover.style.transform = 'translate(calc(-50% + ' + x + 'px), calc(-50% + ' + y + 'px))';
    }

    const subCovers = document.querySelectorAll('.sub-cover');
    subCovers.forEach(function (cover, index) {
      const reverseX = x * (0.5 - index * 0.2);
      const reverseY = y * (0.5 - index * 0.2);
      cover.style.transform = 'translate(' + reverseX + 'px, ' + reverseY + 'px)';
    });

    const mouseX = e.clientX;
    const items = document.querySelectorAll('.static-cover');
    items.forEach(function (item) {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const offset = (itemCenter - mouseX) * 0.08;
      item.style.transform = 'translateX(' + offset + 'px)';
    });
  });

  coverWall.addEventListener('mouseleave', function () {
    document.querySelectorAll('.static-cover').forEach(function (item) {
      item.style.transform = 'translateX(0)';
    });
  });

  window.addEventListener('load', function () {
    document.querySelectorAll('.static-cover').forEach(function (cover) {
      cover.style.opacity = '1';
    });

    const dynamicCovers = document.querySelectorAll('.dynamic-cover');
    dynamicCovers.forEach(function (cover, index) {
      cover.style.opacity = '0';
      cover.style.transform += ' scale(0.8)';

      setTimeout(function () {
        cover.style.opacity = '1';
        cover.style.transform = cover.style.transform.replace(' scale(0.8)', '') + ' scale(1)';
      }, 400 + index * 300);
    });
  });
})();
