---
title: CSS 新特性
date: 2024-11-14
summary: CSS 新特性
category: css
tags: [css]
---

### place-items

超级居中

```css
display: grid;
place-items: center;
```

###

```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
```

### aspect-ratio

```css
/* 宽高比 */
aspect-ratio: 1;
```


### 自定义属性
@property

动画 keyframe 支持属性变化，但不支持 css 变量的变化，自定义属性可以办到