---
title: RxJS
date: 2024-10-18
summary: RxJS
category: 学习
tags: [js, rxjs]
---

### 介绍
RxJS 解决了 JavaScript 异步编程中的多个问题，主要包括：

复杂的异步流管理：在传统的 JavaScript 中，异步操作（如事件、定时器、Ajax 请求等）通常使用回调函数处理，这可能导致所谓的“回调地狱”。RxJS 通过 Observables 和操作符提供了一种更清晰、更声明式的方式来处理异步数据流。

数据流的组合和转换：RxJS 提供了丰富的操作符来映射、过滤、组合、合并、切换和分拆异步数据流。

错误处理：在传统的异步模式中，错误处理可能很复杂，尤其是在多个异步操作嵌套时。RxJS 提供了统一的错误处理机制。

内存和性能优化：RxJS 的流式处理可以减少内存使用，因为它不需要存储整个数据集，而是处理一个连续的数据流。

响应式数据管理：RxJS 可以用于响应式编程，创建响应式数据流，自动更新 UI 或其他订阅者。



Promise 和迭代器（Iterator）是 JavaScript 中处理异步操作和序列数据的两种原生机制。尽管它们在某些方面可以提供类似的功能，但 RxJS 有一些独特的优势：

更丰富的操作符：

RxJS 提供了超过 100 个操作符来处理数据流，如 map、filter、merge、switchMap 等，这些操作符使得复杂的数据流处理变得简单。
链式调用：

RxJS 的操作符可以链式调用，使得你可以轻松地对数据流进行多步骤处理，而 Promise 链通常更难以阅读和维护。
错误处理：

RxJS 的 catchError 操作符提供了统一的错误处理机制，可以轻松地捕获和处理 Observable 链中任何点的错误。
热和冷 Observable 的区分：

RxJS 中的 Observable 可以是热的（Hot）或冷的（Cold），这允许你控制数据流的订阅和取消订阅，以及数据的共享。
多值处理：

RxJS 可以处理多个值，而 Promise 仅用于处理单个值（尽管 Promise.all 可以处理多个 Promise）。
时间控制操作符：

RxJS 提供了如 debounceTime、throttleTime、delay 等操作符，它们可以基于时间来控制数据流。
响应式编程：

RxJS 支持响应式编程范式，这使得它非常适合处理依赖于多个数据源的动态 UI。
可取消的异步操作：

通过 Subscription，RxJS 允许你取消异步操作，这有助于避免资源泄露。
多线程调度：

使用 RxJS 的 Schedulers，你可以控制 Observable 的执行环境，实现多线程编程。
与响应式框架的集成：

RxJS 可以与现代响应式前端框架（如 Angular）无缝集成，提供更丰富的响应式编程能力。
与 Promise 比较：
Promise 适合处理单个异步操作的结果，而 RxJS 更适合处理多个异步操作或连续的数据流。
Promise 链在处理多个异步操作时可能会变得复杂，而 RxJS 的操作符可以简化这种复杂性。
与迭代器比较：
迭代器通常用于同步的、有限的序列处理，而 RxJS 的 Observable 可以处理异步的、无限的数据流。
RxJS 的 Observable 可以发出错误和完成通知，而迭代器通常只处理值。
示例场景：
假设你需要实现一个功能，用户可以输入搜索词，应用需要在用户输入时显示搜索建议，并在用户选择建议时获取更多相关信息。

使用 Promise，你可能需要为每次搜索请求创建一个新的 Promise，这在用户快速输入时可能不够高效。
使用迭代器，你将受限于同步操作，且难以处理复杂的异步逻辑。
使用 RxJS，你可以创建一个从用户输入事件派生的 Observable，使用诸如 debounceTime、distinctUntilChanged 和 switchMap 等操作符来处理用户输入，获取搜索建议，并在用户选择建议时进一步处理。
总之，RxJS 的设计目标是处理复杂的异步数据流，而 Promise 和迭代器更适合处理更简单的异步操作或同步序列。RxJS 的强大之处在于其提供了一系列工具来构建和操作数据流，特别是在需要处理多个异步源或连续数据时。


### 基本原理

- 简化版本
```ts
class Observable {
  constructor(subscribe) {
    if (subscribe) {
      // 保存订阅函数(生产者)
      this._subscribe = subscribe;
    }
  }
  
  subscribe(observer, error, complete) {
    const unsubscribe = this._subscribe(observer);
    return unsubscribe
  }
  
  pipe(...operators) {
    if (operators.length === 0) {
      return this;
    }
    
    return operators.reduce(
      (source, operator) => operator(source),
      this
    );
  }
}
```

- 完整版本
```ts
class Observable {
  constructor(subscribeFn) {
    this._subscribe = subscribeFn;
  }
  
  subscribe(observerOrNext, error, complete) {
    // 标准化观察者对象
    const observer = typeof observerOrNext === 'function'
      ? { next: observerOrNext, error, complete }
      : observerOrNext;
    
    // 创建订阅对象
    const subscription = new Subscription();
    
    // 包装观察者，添加自动清理逻辑
    const safeObserver = {
      next: value => {
        if (!subscription.closed) {
          try {
            observer.next(value);
          } catch (err) {
            subscription.unsubscribe(); // 出错时自动取消订阅
            throw err;
          }
        }
      },
      error: err => {
        if (!subscription.closed) {
          subscription.closed = true;
          try {
            observer.error(err);
          } finally {
            subscription.unsubscribe(); // 错误时自动取消订阅
          }
        }
      },
      complete: () => {
        if (!subscription.closed) {
          subscription.closed = true;
          try {
            observer.complete();
          } finally {
            subscription.unsubscribe(); // 完成时自动取消订阅
          }
        }
      }
    };
    
    try {
      // 执行订阅函数
      const teardown = this._subscribe(safeObserver);
      
      // 存储清理函数
      if (teardown) {
        subscription.add(teardown);
      }
    } catch (err) {
      safeObserver.error(err);
    }
    
    return subscription;
  }
}

class Subscription {
  constructor() {
    this.closed = false;
    this._teardowns = [];
  }
  
  add(teardown) {
    if (teardown && typeof teardown !== 'function') {
      if (teardown instanceof Subscription) {
        // 如果是另一个订阅对象，添加它的 unsubscribe 方法
        this._teardowns.push(() => teardown.unsubscribe());
      } else if (typeof teardown.unsubscribe === 'function') {
        this._teardowns.push(() => teardown.unsubscribe());
      }
    } else if (typeof teardown === 'function') {
      this._teardowns.push(teardown);
    }
  }
  
  unsubscribe() {
    if (this.closed) return;
    
    this.closed = true;
    
    // 执行所有清理函数
    for (const teardown of this._teardowns) {
      try {
        teardown();
      } catch (err) {
        console.error('取消订阅时出错:', err);
      }
    }
    
    this._teardowns = null;
  }
}
```

- 调用
```ts

// 创建一个发出 1, 2, 3 的 Observable
const simple$ = new Observable(observer => {
  // 这里是数据生产逻辑
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
  
  // 返回清理函数
  return () => {
    console.log('已取消订阅');
  };
});

// 订阅 Observable
const subscription = simple$.subscribe({
  next: value => console.log('收到值:', value),
  error: err => console.error('发生错误:', err),
  complete: () => console.log('完成')
});
```