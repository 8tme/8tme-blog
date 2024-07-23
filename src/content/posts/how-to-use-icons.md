---
title: 如何使用图标？
date: 2024-06-28 10:29:00
tags: [Icon]
comments: true
draft: false
---

选择 font-class 的方式引用图标。这些图标大部分来源于 [Remix Icons](https://remixicon.com/)，并且在 [iconfont](https://www.iconfont.cn/) 上进行管理和导出。

下图展示了项目中的所有图标：

![所有图标](https://s2.loli.net/2024/05/08/mbdT5HqYMEajyRG.webp)

当你在添加首页显示的社交账号时，你可能会想要使用这些图标。在对应的配置项中填写图标下面有 `icon-` 前缀的名称即可。

如果是在组件中使用图标，可以按照如下方式：

```jsx
<i className="iconfont icon-xxx"></i>
```

## 为什么不是 SVG 图标？

你可能看到很多的项目在使用 [iconify](https://iconify.design/)。iconify 是一个开源图标集，包含超过 20 万个图标，提供了多种框架的引入方式。Astro 中也有对应的插件 astro-icon 可以使用（如果对此感兴趣，可以查看他们的[文档](https://github.com/natemoo-re/astro-icon)）。

必须要承认，目前的图标方案并不优雅，每当图标集合发生修改时我都需要更新对应的字体文件和 CSS 文件。而且其他人想要管理图标集合也变得困难。


## 自定义图标

如果你想要替换 iconfont 的图标，请修改以下文件：

```text
public/fonts/iconfont.ttf
public/fonts/iconfont.woff
public/fonts/iconfont.woff2
src/styles/iconfont.css
```

注意，这将会替换掉项目中使用的所有图标，所以请确保你知道自己在做什么。
