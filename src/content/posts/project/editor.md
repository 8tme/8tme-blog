---
title: WangEditor中自定义按钮
date: 2024-08-01
summary: WangEditor中自定义按钮的过程
category: 项目
tags: [WangEditor, 富文本, react]
---

### WangEditor

WangEditor是一个开源 Web 富文本编辑器，开箱即用，配置简单。

### 自定义上传按钮

这里介绍一下如何定义一个打开上传弹框的的按钮

1. 第一步
```tsx
import ReactDOM from 'react-dom/client'

class ModalMenuBase {
  id: string = `modal-${Math.random().toString(36).slice(2)}`
  title: string
  tag: string
  $ele: HTMLDivElement
  $root: any
  ifInit: boolean = false
  controlShow: (i: boolean) => void = Function.prototype as any

  constructor() {
    this.title = '添加附件'
    this.tag = 'button'
    this.$ele = document.createElement('div')
    this.$ele.id = this.id
    document.body.appendChild(this.$ele)
    this.$root = ReactDOM.createRoot(this.$ele!)
  }

  modalInit = (method: (i: boolean) => void) => {
    // 这里把控制react的方法透出
    this.controlShow = method
  }

  isActive() {
    return false // or false
  }

  isDisabled() {
    return false // or true
  }

  exec(_, value: any) {
    if (this.ifInit) {
      this.controlShow(true)
      return
    }
    this.$root.render(value)
    this.ifInit = true
  }
}

export default ModalMenuBase
```


2. 第二步

```tsx

class UploadExtension extends ModalMenuBase {
  constructor() {
    super()
  }

  getValue(editor: IDomEditor) {
    return <UploadModal onInit={this.modalInit} editor={editor} />
  }
}

export const uploadMenuExtensionConf = {
  key: 'menuExtensionConf',
  factory: () => new UploadExtension() as any,
}

export default UploadExtension
```

3. 第三步
```tsx
import { Boot } from '@wangeditor/editor'

Boot.registerMenu(uploadMenuExtensionConf)
```

大功告成！！！
