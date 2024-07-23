---
title: 避免过度使用 Context
date: 2024-07-22
summary: 当用则用
category: 思考
tags: [react, context]
---

### 介绍

useContext 是一个 React 钩子，可让你从组件中读取和订阅 上下文。

```ts
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

### 问题

Context 在某些情况下非常有用，但也很有限，需要注意的是过度使用可能会导致以下问题：

1. 性能问题：Context 的值每次更改时，所有使用该 Context 的组件都会重新渲染。如果频繁更新 Context 的值，可能会导致性能下降。

2. 复杂性增加：滥用 Context 可能使代码难以理解和维护。Context 应该只用于真正需要全局状态的场景，而不是所有数据传递都依赖 Context。

### 场景

从表述上可能还不能很清楚的感受到。

试想，如果我们在一个 PC 页面上的某个部分看到一段文字，我们希望追溯这段文字的数据来源，它的来源可能性很多。

我们打开浏览器 network 窗口，发现调用了五六七八的接口，接口名称规范，还好（当然前提还得是你理解相关业务）；

如若不然，你需要不停的点点点，一层层定位数据，最后发现来自一个 context，我们点击进入其引用，发现只是：

```ts
export const useXxxContext = () => useContext(xxxContext)
```

点击查看 xxxContext， 我们看到其定义：

```ts
export const xxxContext = {
  state1: xx,
  state2: xx
  ...
}
```

emmm, 所以数据在哪儿？这时我们去全局搜 xxxContext，运气不好的话发现有五六七八个引用，我们点开第一个引用，这时突然想起来：

咦，我刚刚在找什么来着？

不重要了，举这个例子只是为了说明滥用 context 时可能出现的一种场景，相信有过相关经历多多少少能代入一点吧，只能说找数据来源的心情那真是： 淦！！！

### 如何避免过度使用

1. 局部状态优先：对于只在某些组件中使用的状态，优先使用组件内部的局部状态或 props 传递，而不是 Context。

2. 拆分 Context：如果有多个不相关的状态，考虑创建多个 Context，而不是将所有状态都放在一个 Context 中。这样可以减少不必要的重新渲染。

3. 使用 Memoization：利用 React.memo、useMemo 和 useCallback 等工具优化性能，避免不必要的组件重新渲染。

4. 组合模式：对于需要在不同层级之间传递状态的情况，考虑使用组合模式（Render Props 或者高阶组件）来避免 Context。
