---
title: Shadow DOM
date: 2024-11-14
summary: Shadow DOM
category: 学习
tags: [js, shadow-dom]
---

### 概念

Shadow DOM 是 Web Components 的一部分，它允许开发者将 DOM 树的某些部分封装起来，形成一个独立的 DOM 树，从而实现更好的封装和隔离。

### 优势

1. 封装性
2. 隔离性
3. 可重用性
4. 可维护性

### 缺点

1. 兼容性
2. 性能

- 每个实例都有独立的 DOM 树和样式表, 独立的计算
- 事件需要穿过 shadow boundary，需要有额外的开销

### 使用

```js
class Custom extends HTMLElement {
  shadow: ShadowRoot
  contentDiv: HTMLDivElement

  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })

    this.shadow.innerHTML = `
      <style>
        .content {
          color: blue;
        }
      </style>

      <div class="content">inner shadow</div>
      <slot>默认占位</slot>
    `

    this.contentDiv = this.shadow.querySelector('.content') as HTMLDivElement

    // const style = document.createElement('style')
    // style.textContent = `
    //   .content {
    //     color: red;
    //   }
    // `
    // this.shadow.appendChild(style)
  }

  static get observedAttributes() {
    return ['name', 'test']
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log(name, oldValue, newValue)

    switch (name) {
      case 'name':
        this.contentDiv.textContent = `Name is: ${newValue}`
        break
      case 'test':
        this.contentDiv.innerHTML = `Test value: <span style="color: green">${newValue}</span>`
        break
    }
  }

  get name() {
    return this.getAttribute('name')!
  }

  set name(value: string) {
    this.setAttribute('name', value)
  }

  connectedCallback() {
    console.log('组件被添加到文档')
    this.updateContent()
  }

  private updateContent() {
    const name = this.getAttribute('name')
    const test = this.getAttribute('test')

    if (name || test) {
      this.contentDiv.innerHTML = `
        ${name ? `<div>Name: ${name}</div>` : ''}
        ${test ? `<div>Test: ${test}</div>` : ''}
      `
    }
  }

  disconnectedCallback() {
    console.log('组件从文档中移除')
  }

  adoptedCallback() {
    console.log('组件被移动到新文档')
  }
}

customElements.define('custom-element', Custom)

```

### 限制

````js
// ✅ 可以附加 Shadow DOM 的元素
const validElements = {
  div: document.createElement('div'),
  span: document.createElement('span'),
  main: document.createElement('main'),
  section: document.createElement('section'),
  article: document.createElement('article'),
  aside: document.createElement('aside'),
  nav: document.createElement('nav'),
  header: document.createElement('header'),
  footer: document.createElement('footer'),
  p: document.createElement('p'),
  // ... 等
}

// ❌ 不能附加 Shadow DOM 的元素
const invalidElements = {
  img: document.createElement('img'),
  input: document.createElement('input'),
  textarea: document.createElement('textarea'),
  select: document.createElement('select'),
  // ... 等
}
```

