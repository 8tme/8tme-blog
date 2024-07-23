---
title: vite
date: 2024-07-02
summary: 关于 vite 的核心概念
category: 学习
tags: [vite]
---

### 基本组成

开发环境使用 esbuild 高性能构建，借助 esm 进行加载
生产环境使用 rollup 打包（esbuild 作为打包器兼容性不是很好，其不打算，只能支持采用 esm 规范的包）