---
title: React Modal
date: 2024-11-20
summary: React Modal
category: React
tags: [react, modal]
---

### 使用 React Portal 创建 Modal
```tsx
import { createRoot, Root } from 'react-dom/client'
import { createPortal } from 'react-dom'

class Modal {
  private static root: Root | null = null
  private static div: HTMLDivElement | null = null

  static show() {
    if (!this.div) {
      this.div = document.createElement('div')
    }

    this.root = createRoot(this.div)
    this.root.render(
      createPortal(
        <div className="h-screen w-screen bg-[rgba(0,0,0,0.5)] fixed top-0 left-0 flex items-center justify-center">
          <div className="w-[600px] h-[308px] bg-[#fff] rounded-[32px] relative flex flex-col items-center justify-center text-[32px] text-[#5C5658] leading-[45px]">
            content
          </div>
        </div>,
        document.body
      )
    )
  }

  static hide() {
    this.root?.unmount()
    this.div = null
    this.root = null
  }
}

export default Modal
```
