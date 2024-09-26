---
title: 使用 auto-zustand-selectors-hook 简化选择状态
date: 2024-08-02
summary: 简化选择状态
category: 思考
tags: [react,zustand,auto-zustand-selectors-hook]
---

### auto-zustand-selectors-hook 库

```tsx
import { create } from 'zustand'
import { createSelectorFunctions, createSelectorHooks } from 'auto-zustand-selectors-hook'

type State = {
    state1: string
}

type Action = {
    updateState1: (s: string) => void
}

export const useStore = create<State & Action>((set, get) => ({
    state1: xx,
    updateState1: s => {
        set({ state1: s })
    }
}))

// 比较方便的写法 订阅整个 store
const { state1 } = useStore()

// 订阅单独的状态
const state1 = useStore(state => state.state1)

// 函数式用法
export const useStoreState = createSelectorFunctions(useStore)
// const state1 = useStoreState.use.state1()

// hook式用法
export const useStoreHooks = createSelectorHooks(useStore)
// const state1 = useStoreHooks.useState1()
```
