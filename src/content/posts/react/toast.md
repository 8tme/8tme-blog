---
title: React Toast
date: 2024-11-20
summary: React Toast
category: React
tags: [react, toast]
---

### 使用 React Portal 创建 Toast

```tsx
import { createRoot, Root } from 'react-dom/client'
import { createPortal } from 'react-dom'

class Toast {
  private static root: Root | null = null
  private static div: HTMLDivElement | null = null

  static show(text: string) {
    if (!this.div) {
      this.div = document.createElement('div')
    }

    const root = createRoot(this.div)
    root.render(
      createPortal(
        <div className="h-screen w-screen fixed top-0 left-0 flex items-center justify-center bg-[transparent]">
          <div className="w-auto h-[50px] p-[36px] bg-[rgba(0,0,0,0.9)] rounded-[12px] flex flex-col items-center justify-center gap-[12px]">
            <span className="text-[28px] text-[#fff] font-medium leading-[40px]">{text}</span>
          </div>
        </div>,
        document.body,
      ),
    )

    const timer = setTimeout(() => {
      this.div = null
      root.unmount()
      clearTimeout(timer)
    }, 1000)
  }

  static showLoading(text: string) {
    if (!this.div) {
      this.div = document.createElement('div')
    }

    this.root = createRoot(this.div)
    this.root.render(
      createPortal(
        <div className="h-screen w-screen fixed top-0 left-0 flex items-center justify-center bg-[transparent]">
          <div className="w-[200px] h-[200px] bg-[rgba(0,0,0,0.9)] rounded-[37px] flex flex-col items-center justify-center gap-[12px]">
            <span className="text-[28px] text-[#fff] font-medium leading-[40px]">{text}</span>
          </div>
        </div>,
        document.body,
      ),
    )
  }

  static hideLoading() {
    this.root?.unmount()
    this.div = null
    this.root = null
  }

  static showComplete(text: string) {
    if (!this.div) {
      this.div = document.createElement('div')
    }

    const root = createRoot(this.div)
    root.render(
      createPortal(
        <div className="h-screen w-screen fixed top-0 left-0 flex items-center justify-center bg-[transparent]">
          <div className="w-[200px] h-[200px] bg-[rgba(0,0,0,0.9)] rounded-[37px] flex flex-col items-center justify-center gap-[12px]">
            <span className="text-[28px] text-[#fff] font-medium leading-[40px]">{text}</span>
          </div>
        </div>,
        document.body,
      ),
    )

    const timer = setTimeout(() => {
      this.div = null
      root.unmount()
      clearTimeout(timer)
    }, 1000)
  }
}

export default Toast
```
