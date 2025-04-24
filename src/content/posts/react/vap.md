---
title: React Vap
date: 2024-11-20
summary: React Vap
category: React
tags: [react, vap, video-animation-player, video, animation]
---


##

```ts
import { useEffect, useState } from 'react'
import Vap from 'video-animation-player'

export const getPx = (px: number) => {
  return (window.innerWidth / 750) * px
}

export type UseVapOptions = {
  id: string
  /** 视频源 填写视频源路径 使用@/assets/vap/ */
  src: string
  /** 设计稿高度 */
  height: number
  /** 设计稿宽度 */
  width: number

  /** 是否循环播放 */
  loop?: boolean

  /** 是否不缓存资源 */
  noCache?: boolean

  /** 是否预加载 */
  precache?: boolean

  /** 开始播放 */
  onStart?: () => void
}

// 全局缓存对象
interface VapCache {
  config: string | null
  video: Blob | null
  loading: boolean
  callbacks: Array<() => void>
  objectUrl: string | null
}

const vapCacheMap = new Map<string, VapCache>()

/** 兼容性检查函数 */
const isCreateObjectURLSupported = () => {
  return typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
}

/**
 * 获取资源并缓存
 * @param vapName 视频名称
 * @param cacheVap 是否缓存资源
 */
const fetchAndCacheVapResources = async (vapName: string, noCache?: boolean) => {
  const configSrc = new URL(`../assets/vap/${vapName}/vapc.json`, import.meta.url).href
  const mp4Src = new URL(`../assets/vap/${vapName}/video.mp4`, import.meta.url).href

  if (noCache) {
    return {
      config: configSrc,
      objectUrl: mp4Src,
    }
  }

  // 如果缓存中已有加载中的相同资源，则等待其加载完成
  if (vapCacheMap.has(vapName)) {
    const cache = vapCacheMap.get(vapName)!

    if (cache.loading) {
      return new Promise<VapCache>(resolve => {
        cache.callbacks.push(() => resolve(cache))
      })
    }

    return cache
  }

  // 创建新的缓存条目
  const cache: VapCache = {
    config: configSrc,
    video: null,
    loading: true,
    callbacks: [],
    objectUrl: mp4Src,
  }

  vapCacheMap.set(vapName, cache)

  try {
    // 并行加载配置和视频
    const [configResponse, videoResponse] = await Promise.all([fetch(configSrc), fetch(mp4Src)])

    cache.config = await configResponse.json()
    cache.video = await videoResponse.blob()

    // 创建 objectURL 并存储，添加兼容性检查
    if (cache.video && isCreateObjectURLSupported()) {
      cache.objectUrl = URL.createObjectURL(cache.video)
    }

    cache.loading = false

    // 通知所有等待此资源的回调
    cache.callbacks.forEach(callback => callback())
    cache.callbacks = []

    return cache
  } catch (error) {
    console.error('加载VAP资源失败:', error)

    // 释放可能已创建的 objectURL
    if (cache.objectUrl && isCreateObjectURLSupported() && cache.objectUrl !== mp4Src) {
      URL.revokeObjectURL(cache.objectUrl)
      cache.objectUrl = null
    }

    // 移除失败的缓存
    vapCacheMap.delete(vapName)

    return cache
  }
}

export const useVap = (options: UseVapOptions) => {
  const { id, src, height, width, loop, noCache, precache, onStart } = options

  const [vapInvalid, setVapInvalid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [vapInstance, setVapInstance] = useState<Vap | null>(null)

  const initVapPlayer = async () => {
    setLoading(true)
    const vapName = src.replace('@/assets/vap/', '')

    try {
      const cache = await fetchAndCacheVapResources(vapName, noCache)

      const devicePixelRatio = window.devicePixelRatio || 1

      // 使用缓存的 objectURL 创建 VAP 实例
      const vap = new Vap({
        container: document.querySelector(`#${id}`)!,
        config: cache.config,
        src: cache.objectUrl,
        height: getPx(height) * devicePixelRatio,
        width: getPx(width) * devicePixelRatio,
        precache: !!precache,
        loop: !!loop,
        type: id,
        fps: 30,
        onLoadError: () => {
          console.log('vap 加载失败', vapName)
          setVapInvalid(true)
          setLoading(false)
        },
      })

      setVapInstance(vap)
      return vap
    } catch (error) {
      console.error('初始化VAP播放器失败:', error)
      setVapInvalid(true)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!src) {
      return
    }

    const ele = document.querySelector(`#${id}`)
    if (!ele) {
      return
    }

    // 确保在重新初始化前销毁之前的实例
    if (vapInstance) {
      vapInstance.destroy()
    }

    // 清理canvas child
    while (ele.firstChild?.tagName === 'CANVAS') {
      ele.removeChild(ele.firstChild)
    }

    let vap: Vap | null = null

    // 异步初始化播放器
    initVapPlayer().then(instance => {
      if (instance) {
        vap = instance
        vap.play()
        onStart?.()
      }
    })

    return () => {
      if (vap) {
        vap.destroy()
      }
    }
  }, [id, src, height, width])

  return {
    vapInvalid,
    vapInstance,
    loading,
  }
}

// 修改清理缓存的方法，添加兼容性检查
export const clearVapCache = (vapName?: string) => {
  if (vapName) {
    const cache = vapCacheMap.get(vapName)
    if (cache?.objectUrl && isCreateObjectURLSupported() && !cache.objectUrl.startsWith('http')) {
      URL.revokeObjectURL(cache.objectUrl)
    }
    vapCacheMap.delete(vapName)
  } else {
    // 清理所有缓存时，释放所有 objectURL
    vapCacheMap.forEach(cache => {
      if (cache.objectUrl && isCreateObjectURLSupported() && !cache.objectUrl.startsWith('http')) {
        URL.revokeObjectURL(cache.objectUrl)
      }
    })
    vapCacheMap.clear()
  }
}

// 在应用退出或组件库卸载时调用此函数
export const cleanupVapResources = () => {
  clearVapCache()
}
```