---
title: React-Router
date: 2024-07-02
summary: React-Router
category: React
tags: [react, react-router]
---

### 标题

让我们分析一下为什么修改后配置了 component 的路由组件不渲染。

原始代码：

```tsx
element: component && (
  <Suspense fallback={<PageLoading />}>
    <Auth>{React.createElement(component)}</Auth>
  </Suspense>
),
```

修改后的代码：

```tsx
element: (
  <Suspense fallback={<PageLoading />}>
    <Auth>
      {component && React.createElement(component)}
    </Auth>
  </Suspense>
),
```

修改后的代码不能正确渲染路由组件的原因是：

1. 条件渲染位置变化：
   在原始代码中，整个 `element` 的渲染都依赖于 `component` 是否存在。如果 `component` 不存在，`element` 就是 `undefined`。

   在修改后的代码中，`element` 总是会渲染 `Suspense` 和 `Auth` 组件，只有实际的路由组件（`React.createElement(component)`）是条件渲染的。

2. React Router 的工作方式：
   React Router 期望路由配置中的 `element` 属性直接对应到要渲染的组件。当 `element` 是 `undefined` 时，React Router 会正确地跳过这个路由。

   但在修改后的代码中，`element` 总是一个有效的 React 元素（包含 `Suspense` 和 `Auth`），即使 `component` 不存在。这可能导致 React Router 认为这是一个有效的路由，但实际上没有内容被渲染。

3. `Auth` 组件的行为：
   在修改后的代码中，即使没有 `component`，`Auth` 组件也会被渲染。如果 `Auth` 组件的实现期望有子组件，但实际上没有，可能会导致渲染问题。

4. 性能和不必要的渲染：
   修改后的代码会导致即使没有实际组件需要渲染，`Suspense` 和 `Auth` 也会被创建和挂载，这可能带来不必要的性能开销。

总结：原始代码的实现更符合 React Router 的预期使用方式，能够正确处理有 component 和没有 component 的情况。修改后的代码改变了这种行为，导致路由组件无法正确渲染。

为了解决这个问题，应该保持原来的实现方式，确保只有在 `component` 存在时才创建包含 `Suspense` 和 `Auth` 的 `element`。
