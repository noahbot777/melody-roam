# MelodyRoam - 首页开发答辩

---

## 一、项目概述

**项目：** MelodyRoam 音序漫游  
**团队：** 5人前端小组，每人负责一个页面  
**我负责：** 首页（入口页面）

---

## 二、功能模块与效果展示

### 2.1 导航栏模块
**功能效果：**
- 固定在页面顶部，始终可见
- 毛玻璃背景效果，视觉现代
- 悬停时导航链接显示下划线动画

**实际效果：**
```
┌─────────────────────────────────────────────────────────────┐
│  MelodyRoam 音序漫游    首页  HipHop  R&B  古风  K-Pop     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 封面墙模块
**功能效果：**
- 41张专辑封面散落分布作为背景
- 半透明效果，营造层次感
- 页面加载时依次渐入

### 2.3 动态封面模块
**功能效果：**
- 4个音乐分类入口（HipHop、R&B、古风、K-Pop）
- 点击可跳转到对应分类页面
- 悬停时放大并加深阴影

### 2.4 交互效果模块
**功能效果：**
- 鼠标移动时，主封面跟随移动
- 副封面反向移动（视差效果）
- 背景封面根据鼠标距离散开
- 鼠标离开时背景恢复原位

---

## 三、功能实现思路

### 3.1 导航栏实现思路
1. 使用 `position: fixed` 固定在顶部
2. 使用 `backdrop-filter: blur(20px)` 实现毛玻璃
3. 使用 CSS 伪元素 `::after` 创建下划线
4. 使用 `transition` 实现悬停动画

### 3.2 封面墙实现思路
1. 使用绝对定位（`position: absolute`）排列41张封面
2. 使用 `top/left` 百分比定位精确控制位置
3. 使用 `z-index` 管理层级关系

### 3.3 动态封面实现思路
1. 使用 `<a>` 标签实现点击跳转
2. 使用 `transform: translate(-50%, -50%)` 居中定位
3. 使用伪元素 `::before` 添加渐变遮罩

### 3.4 交互效果实现思路
1. 监听 `mousemove` 事件获取鼠标位置
2. 计算鼠标偏移量并应用到封面元素
3. 主封面同向移动，副封面反向移动
4. 背景封面根据距离计算偏移量

---

## 四、代码语法详解

### 4.1 HTML 结构语法
```html
<!-- 导航栏结构 -->
<nav class="navbar">
  <div class="logo">MelodyRoam 音序漫游</div>
  <div class="nav-links">
    <a href="index.html">首页</a>
    <a href="hiphop.html">HipHop</a>
  </div>
</nav>

<!-- 动态封面结构 -->
<div class="dynamic-covers">
  <a href="hiphop.html" class="dynamic-cover main-cover hiphop">
    <div class="cover-content">
      <h3>HipHop</h3>
      <p>街头节奏 · 自由表达</p>
    </div>
  </a>
</div>
```

**语法说明：**
- `class` 属性用于标识元素，方便 CSS 选择
- `href` 属性定义链接地址
- 语义化标签（`<nav>`, `<a>`）增强可读性

### 4.2 CSS 样式语法
```css
/* 毛玻璃效果 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  backdrop-filter: blur(20px);        /* 模糊背景 */
  background: rgba(255, 255, 255, 0.35);  /* 半透明 */
}

/* 悬停下划线动画 */
.nav-links a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 3px;
  background: #1d1d1f;
  transition: width 0.3s ease;  /* 过渡动画 */
}

.nav-links a:hover::after {
  width: 100%;  /* 悬停时展开 */
}
```

**语法说明：**
- `backdrop-filter`：对元素后方内容进行模糊
- `::after`：创建伪元素
- `transition`：实现平滑过渡动画

### 4.3 JavaScript 交互语法
```javascript
// 鼠标跟随效果
document.querySelector('.cover-wall').addEventListener('mousemove', (e) => {
  // 计算鼠标偏移量（归一化处理）
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  
  // 主封面跟随
  const mainCover = document.querySelector('.main-cover');
  mainCover.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
});
```

**语法说明：**
- `document.querySelector()`：获取页面元素
- `addEventListener()`：绑定事件监听器
- 模板字符串 `` `...${变量}...` ``：拼接字符串

---

## 五、创新点总结

| 创新点 | 实现技术 | 效果 |
|-------|---------|------|
| 毛玻璃导航栏 | `backdrop-filter: blur(20px)` | 现代UI风格 |
| 视差跟随效果 | 鼠标位置计算 + `transform` | 3D空间感 |
| 背景散开效果 | 距离算法 + `translateX` | 物理模拟 |
| 加载序列动画 | `setTimeout` + 延迟递增 | 节奏感渐入 |

---

## 六、测试结果

- ✅ 功能完整：导航、跳转、交互正常
- ✅ 性能优秀：60fps流畅动画
- ✅ 兼容性：Chrome、Firefox、Safari完美支持
- ✅ 响应式：移动端适配正常

---

## 七、个人职责与贡献

- 独立完成首页开发
- 实现核心交互效果
- 提供统一导航栏规范供团队参考

---

## Q&A

谢谢！
