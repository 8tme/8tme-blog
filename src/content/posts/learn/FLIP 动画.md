---
title: FLIP动画
date: 2024-09-12
summary: flip动画
category: 学习
tags: [flip]
---

## 概述

在一些元素结构发生变化的场景，比如排序、图片放大复原、列表增删元素等场景，常规的动画思路很难实现。FLIP动画作为一种开发动画的思路就可以发挥作用，FLIP名字由四个单词的首字母拼凑形成，分别是 First、Last、Invert、Play。
First 确定初始状态
Last 确定目标状态
Invert 反转状态
Play 播放动画

## 例子

![示例图](/public/flip.gif)

这里里省略了元素交换的步骤，以下操作是在元素交换之后执行的。
1. 给粉色添加变换，这一次操作的目的是为了让渲染之后粉色出现在变换之前的位置（First、Last）
不加这个处理，粉色的位置相当于一直是目标位置，没有发生变化自然不会有过渡效果
2. 在重绘之前把粉色的变换重置掉，目的是为了让粉色最终停留在目标位置（Invert）
重置必须要能让浏览器感知到
3. 增加过渡效果 transition，从 1  到 2 的过程，这时候就会有一个视觉上过渡效果（Play）

## 核心逻辑

```js
// 给元素添加变换 js dom 操作
element.style.transition = ''
element.style.transform = 'translateX(100px)'

// js raf
requestAnimationFrame(() => {
  // raf 中dom 操作
  // 增加过渡效果 transition
  element.style.transition = 'transform 2s'
  // 把元素的变换重置掉
  element.style.transform = ''
})
```

## 原理分析

要理解上面的代码的执行过程，需要一些前置知识。
首先，浏览器里分了很多个线程，这里涉及到的主要有主线程和渲染线程，主线程可以理解为执行JS 脚本的线程，渲染线程可以简单理解为渲染页面的线程，这两个线程是互斥的。
上面代码中前两行是 JS dom 操作，JS 操作发生在主线程，更改之后的页面效果需要重新渲染之后才看得到，主线程和渲染线程互斥，渲染线程必须要等到主线程任务完成之后才可以进行。
requestAnimationFrame在主线程中调用，它的回调是在渲染流程中执行的，执行时机是在同步代码执行完而后的布局和样式也计算完成之后， 刚好卡在在重新渲染之前。在回调中操作 dom 会使得布局和样式在主线程中重新计算，完成之后再进行渲染。
我们在同步代码中将元素的位置、大小做任意的变换，再在 requestAnimationFrame 的回调中对元素状态进行重置，并添加transition，这样从我们在同步代码中设置的状态到在回调中重置后的状态就可以产生过渡效果。