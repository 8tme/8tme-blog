---
title: 输入框适配
date: 2024-11-03
summary: 输入框适配
category: 项目
tags: [js, input]
---

在手机浏览器上，存在输入框 focus 拉起软键盘，但是 vh 没有反馈可视适口变化的情况。遇到此情况，我们可以进行如下处理：
1. 添加 interactive-widget=resizes-content，使得视口会被交互式组件调整大小（此时 JS 可获取缩小后的视口高度）
<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0,interactive-widget=resizes-content"
/>
2. 添加 resize、orientationchange 监听，设置 css 变量为 innerHeight / 100（使用 1 提供的内容）
3. 添加 height: calc(var(--height, 1vh) * 100) 防止初始状态填充不满（做初态处理）
4. Safari Mobile 弹出键盘时页面滚动，需要 blur 时 window.scrollTo 处理（处理 Safari 兼容）
最终的组件代码：
"use client";

import Head from 'next/head';
import { useEffect } from 'react';

type Props = {}

function Inputer({ }: Props) {
  function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--inner-vh', `${vh}px`);
  }

  // 注：条件允许，应该把示例代码移至框架外尽早执行
  useEffect(() => {
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    setViewportHeight();

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0,interactive-widget=resizes-content" />
      </Head>
      <main className='flex flex-col h-[calc(var(--inner-vh,1vh)*100)] bg-slate-200'>
        {/* 你的自定义内容 */}
      </main>
    </>
  );
}

export default Inputer;



from 田野 
