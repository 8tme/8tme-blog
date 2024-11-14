---
title: zustand 使用方式
date: 2024-07-02
summary: 可以结合 context 使用，更符合使用场景 
category: 思考
tags: [react,context,zustand]
---

### 简介
zustand 是最近两年最火的 react 状态管理工具，因其简单的使用方式而备受好评。


### 常见使用方式

```ts
import { create } from 'zustand'

// 创建
const useStore = create((set) => ({
  n: 1,
  setN: (n) => set({ n })
}))

// 使用
const { n, setN } = useStore()

// 单独使用
const n = useStore(state => state.n)
const setN = useStore(state => state.setN)
```

### 问题

当想在组件中初始化 store 的时候，我们不得不在

```tsx
import { useState, useEffect } from 'react'

const Demo = ({ initialN }) => {
  const n = useStore(state => state.n)
  const setN = useStore(state => state.setN)

  useEffect(() => {
    setN(initialN)
  }, [initialN])

  return (
    <div>{n}</div>
  )
}
```

上面代码功能上看起能够实现，但是存在几个问题：

1. 设置值导致的额外的渲染
2. 会导致其他引用该值的地方也被重置


### 其他方式

```tsx
import { useState, useEffect, createContext } from 'react'
import { create } from 'zustand'

const context = createContext(null)
const { Provider } = context

const Demo = ({ initialN }) => {
  const [storeIns, setStoreIns] = useState(() => {
    return create((set) => ({
      n: initialN,
      setN: (n) => set({ n })
    }))
  })

  return (
    <Provider value={storeIns}>
      <div>{n}</div>
    </Provider>
  )
}

```

这样我们就实现了引用单例的 store

1. 现在可以用属性初始化我们的存储，我们是在 React 组件树内部创建它的。
2. 因为我们可以将包含 Provider 的组件进行渲染，或者我们可以仅为测试自己渲染一个，所以测试变得轻而易举。在这两种情况下，创建的存储都将完全隔离到测试中，因此不需要在测试之间重置。
3. 一个组件可以渲染 Provider，以向其子组件提供一个封装的 zustand 存储。我们可以在一个页面上尽可能多次渲染这个组件 – 每个实例将有自己的存储，所以我们实现了可复用性。


### zustand/context 库

```tsx

import create from 'zustand'
import createContext from 'zustand/context'

const { Provider, useStore } = createContext()

const createStore = () => create(...)

const App = () => (
  <Provider createStore={createStore}>
    ...
  </Provider>
)

const Component = () => {
  const state = useStore()
  const slice = useStore(selector)
  ...
}
```
