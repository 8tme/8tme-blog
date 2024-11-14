---
title: 反思总结重构
date: 2024-08-30
summary: 尽量不要重写
category: 项目
tags: [refactor,react]
---

### 概述

几乎能遇到的情况中，重写都不如拆分整理。接下来总结一下重构 React 组件的一些经验。

### 案例

```tsx

```

### 分析

我觉得要能意识到，这种代码不管出于什么原因，它决不是一次性完成，而且不一定是一个人做出来的，是在一定时间内，多人或单人多次堆逻辑的结果，每次改动只是为了完成某一个功能。堆积到一定程度，呈现出一种铺面而来的混乱与臃肿，每个人面对这个组件的的时候都发出同样的感叹，同时畏惧对其进行整理。

我要说的是，如果在可预见的未来，你将不得不面对这一堆代码，那么你最好行动起来，越早越好。

### 步骤

在过去的经历中，我迈出了许多次重构的步伐，也因此积累了一定的经验，觉得有一定的价值，现记录于此。

首先，要明确重构这个行为，要做的是重新构建结构，但不会改变功能。

拿到一份 React 组件的代码，首先要做一件事就是要先理解组件功能，心中能够清楚要处理的代码对应的功能；然后，我们对代码进行物理切分，暂时可以放到不同的文件中去，对不同的部分进行单独的黑盒测试，在确认前后功能一致的情况下完成结构的调整，需要注意的是，代码中可能会包含许多看似无用的代码和注释，相信我即使你觉得一点用没有，但也不要立刻删除他们，要做的是反复思考代码出现在这里的原因；要变更代码的过程中，如果遇到一些写法上的问题，就是那种可能你清楚的知道利弊，自己不会那么写，但别人的代码中出现了不当的写法，这时候最好能找到相应 lint 规则，添加到配置文件中，因为极有可能在项目中还有类似的问题。


表单的构建最好是按照模块拆分，表单实例从上下文中获取，而不是逐层传递，对比：
```tsx
// before
Item

after
```

数据获取和表单可能是复杂性最大的两个来源