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