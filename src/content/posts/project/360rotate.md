---
title: 360 度跟手旋转球杆
date: 2024-07-05
summary: 360 度跟手旋转球杆
category: 项目
tags: [cocos,rotate]
---

### 实现

```js
if (collision) {
  const { hitPoint } = collision
  const { x, z } = hitPoint.clone().subtract(this.whiteBall.worldPosition)
  const degree = misc.radiansToDegrees(Math.atan2(x, z))
  // 就是杆的旋转角度 = 触摸旋转角度 + 原来的角度

  // 触摸旋转角度
  // 不同角度时都有两种情况：
  // 1. 例如 120度可能发生在 旋转角度240度和120度的时候
  // 2. 30度可能发生在 旋转角度330度和30度的时候

  // 触摸杆一侧旋转
  const diff = degree - this.startMoveDegree
  let nextDegree = this.startDegree
  if (diff > 0) {
    nextDegree += diff
    if (nextDegree > 360) {
      nextDegree -= 360
    }
  } else {
    nextDegree -= Math.abs(diff)
    if (nextDegree < 0) {
      nextDegree += 360
    }
  }

  this._dirFactor = nextDegree / 360
}
```
