---
title: typescript tips
date: 2024-10-11
summary: typescript 小技巧
category: typescript
tags: [typescript]
---

### 联合转元组

```ts
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never
type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never

// TS4.0+
type Push<T extends any[], V> = [...T, V]

// 联合转元祖
type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N
  ? []
  : Push<TuplifyUnion<Exclude<T, L>>, L>

type A = 'a' | 'b'
type B = TuplifyUnion<A> // ['a', 'b']
```


### 元组转联合
```ts
const arr = ['a', 'b'] as const
type A = typeof arr
type B = A[number] // 'a' | 'b'

```