---
title: React Lottie
date: 2024-11-20
summary: React Lottie
category: React
tags: [react, lottie]
---

### 使用 React Lottie

```tsx
import Lottie from 'lottie-react'
import loadingData from '@/assets/lotties/loading.json'

const Loading = <Lottie className="w-[56px] h-[56px]" animationData={loadingData} loop autoplay />
```

<!-- loading -->

```json
{
  "v": "4.8.0",
  "meta": { "g": "LottieFiles AE 3.5.7", "a": "", "k": "", "d": "", "tc": "" },
  "fr": 30,
  "ip": 0,
  "op": 24,
  "w": 56,
  "h": 56,
  "nm": "转圈loading",
  "ddd": 0,
  "assets": [
    {
      "id": "image_0",
      "w": 96,
      "h": 96,
      "u": "",
      "p": "data:image/png;base64,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",
      "e": 0
    }
  ],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 2,
      "nm": "路径",
      "refId": "image_0",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100, "ix": 11 },
        "r": {
          "a": 1,
          "k": [
            {
              "i": { "x": [0.833], "y": [0.833] },
              "o": { "x": [0.167], "y": [0.167] },
              "t": 0,
              "s": [0]
            },
            { "t": 24, "s": [360] }
          ],
          "ix": 10
        },
        "p": { "a": 0, "k": [28, 28, 0], "ix": 2 },
        "a": { "a": 0, "k": [48, 48, 0], "ix": 1 },
        "s": { "a": 0, "k": [50, 50, 100], "ix": 6 }
      },
      "ao": 0,
      "ip": 0,
      "op": 24,
      "st": 0,
      "bm": 0
    }
  ],
  "markers": []
}
```
