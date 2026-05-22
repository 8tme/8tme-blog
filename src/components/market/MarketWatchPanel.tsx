import { useEffect, useMemo, useRef, useState } from 'react'

type PriceState = {
  value: number
  prev: number | null
  source?: 'BINANCE' | 'OKX' | 'EASTMONEY' | 'TENCENT'
}

const LOCAL_STORAGE_KEY = 'market-watch-list'
const PANEL_POSITION_KEY = 'market-watch-panel-position'
const CN_STOCK_PREFIX = 'CN:'
const US_INDEX_PREFIX = 'USI:'
const US_INDEX_ALIAS: Record<string, string> = {
  标普: 'SPX',
  标普500: 'SPX',
  纳斯达克: 'IXIC',
}
const DEFAULT_WATCH_LIST = [
  'BTCUSDT',
  'ETHUSDT',
  'HYPEUSDT',
  'BNBUSDT',
  'USI:SPX',
  'USI:IXIC',
]
const ICON_FALLBACK_URL =
  'https://api.iconify.design/lucide:circle-help.svg?color=%239ca3af'
// 非加密标的沿用通用图标；加密标的走 Hyperliquid coins SVG
const ASSET_ICON_URLS: Record<string, string> = {
  CN_STOCK: 'https://api.iconify.design/lucide:landmark.svg?color=%23ef4444',
  SPX: 'https://commons.wikimedia.org/wiki/Special:FilePath/S%26P_Dow_Jones_Indices_logo.svg',
  IXIC: 'https://commons.wikimedia.org/wiki/Special:FilePath/NASDAQ_Logo.svg',
}
const getHyperliquidCoinIconUrl = (base: string) =>
  `https://app.hyperliquid.xyz/coins/${base}.svg`

const sanitizeWatchList = (list: string[]) => list.filter((symbol) => symbol !== `${CN_STOCK_PREFIX}600519`)

const PANEL_WIDTH = 200
const DRAG_SHIELD_ID = 'market-watch-drag-shield'

const getDefaultPanelPosition = () => ({
  x: Math.max(8, window.innerWidth - PANEL_WIDTH - 8),
  y: 80,
})

const normalizePanelPosition = (pos: { x: number; y: number }) => {
  const defaults = getDefaultPanelPosition()
  // Chrome 异常缓存常落在 (0,0)，表现为面板卡在左上角
  if (pos.x <= 8 && pos.y <= 8) return defaults
  return {
    x: Math.max(0, Math.min(pos.x, window.innerWidth - PANEL_WIDTH)),
    y: Math.max(0, Math.min(pos.y, window.innerHeight - 120)),
  }
}

const showDragShield = () => {
  if (document.getElementById(DRAG_SHIELD_ID)) return
  const shield = document.createElement('div')
  shield.id = DRAG_SHIELD_ID
  shield.className = 'market-watch-drag-shield'
  shield.setAttribute('aria-hidden', 'true')
  document.body.appendChild(shield)
}

const hideDragShield = () => {
  document.getElementById(DRAG_SHIELD_ID)?.remove()
}

const formatPrice = (value: number) => {
  if (value >= 1000) return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
  if (value >= 1) return value.toLocaleString('en-US', { maximumFractionDigits: 4 })
  return value.toLocaleString('en-US', { maximumFractionDigits: 8 })
}

const normalizeSymbol = (raw: string) => {
  const trimmed = raw.trim()
  if (!trimmed) return ''

  if (US_INDEX_ALIAS[trimmed]) {
    return `${US_INDEX_PREFIX}${US_INDEX_ALIAS[trimmed]}`
  }

  const cleaned = trimmed.toUpperCase().replace(/\s+/g, '').replace(/\//g, '')
  if (!cleaned) return ''
  if (cleaned === 'SPX' || cleaned === 'INX') return `${US_INDEX_PREFIX}SPX`
  if (cleaned === 'IXIC' || cleaned === 'NASDAQ') return `${US_INDEX_PREFIX}IXIC`
  if (cleaned.startsWith(CN_STOCK_PREFIX)) return cleaned
  if (cleaned.startsWith(US_INDEX_PREFIX)) return cleaned
  if (cleaned.startsWith('SHSE:') || cleaned.startsWith('SZSE:')) {
    const code = cleaned.split(':')[1]
    if (/^\d{6}$/.test(code)) return `${CN_STOCK_PREFIX}${code}`
  }
  if (/^(SH|SZ)\d{6}$/.test(cleaned)) return `${CN_STOCK_PREFIX}${cleaned.slice(2)}`
  if (/^\d{6}$/.test(cleaned)) return `${CN_STOCK_PREFIX}${cleaned}`
  if (cleaned.includes(':')) {
    const [, symbol] = cleaned.split(':')
    return symbol || ''
  }
  if (cleaned.endsWith('USDT')) return cleaned
  return `${cleaned}USDT`
}

const isCnStockSymbol = (symbol: string) => symbol.startsWith(CN_STOCK_PREFIX)
const getCnStockCode = (symbol: string) => symbol.replace(CN_STOCK_PREFIX, '')
const isUsIndexSymbol = (symbol: string) => symbol.startsWith(US_INDEX_PREFIX)
const getUsIndexCode = (symbol: string) => symbol.replace(US_INDEX_PREFIX, '')

const toOkxInstId = (symbol: string) => {
  if (symbol.endsWith('USDT')) return `${symbol.slice(0, -4)}-USDT`
  return symbol
}

const toTradingViewSymbol = (symbol: string, source?: PriceState['source']) => {
  // A 股：TradingView 对中国股票更常用 SSE/SZSE 交易所前缀
  if (isCnStockSymbol(symbol)) {
    const stockCode = getCnStockCode(symbol)
    const exchange = stockCode.startsWith('6') ? 'SSE' : 'SZSE'
    return `${exchange}:${stockCode}`
  }
  // 指数：使用高可用 ETF 作为图表代理，避免指数权限提示
  if (isUsIndexSymbol(symbol)) {
    return getUsIndexCode(symbol) === 'SPX' ? 'AMEX:SPY' : 'NASDAQ:QQQ'
  }
  const exchange = source === 'OKX' ? 'OKX' : 'BINANCE'
  return `${exchange}:${symbol}`
}

// 价格源优先币安，失败后兜底欧易；A 股走东方财富接口
const fetchPriceWithFallback = async (
  symbol: string
): Promise<
  { price: number; source: 'BINANCE' | 'OKX' | 'EASTMONEY' | 'TENCENT'; name?: string } | null
> => {
  if (isCnStockSymbol(symbol)) {
    const stockCode = getCnStockCode(symbol)
    const secid = stockCode.startsWith('6') ? `1.${stockCode}` : `0.${stockCode}`
    try {
      const eastmoneyRes = await fetch(
        `https://push2.eastmoney.com/api/qt/stock/get?secid=${secid}&fields=f43,f57,f58`
      )
      if (!eastmoneyRes.ok) return null
      const data = (await eastmoneyRes.json()) as {
        data?: { f43?: number; f58?: string }
      }
      const rawPrice = Number(data.data?.f43)
      if (!Number.isFinite(rawPrice)) return null
      return {
        price: rawPrice / 100,
        source: 'EASTMONEY',
        name: data.data?.f58,
      }
    } catch {
      // 东方财富不可用时继续尝试后备源
    }

    try {
      const stooqRes = await fetch(`https://stooq.com/q/l/?s=${stockCode}.cn&i=1`)
      if (!stooqRes.ok) return null
      const csv = (await stooqRes.text()).trim()
      const fields = csv.split(',')
      const price = Number(fields[6])
      if (!Number.isFinite(price)) return null
      return {
        price,
        source: 'EASTMONEY',
        name: stockCode,
      }
    } catch {
      return null
    }
  }

  if (isUsIndexSymbol(symbol)) {
    const indexCode = getUsIndexCode(symbol)
    const tencentCode = indexCode === 'SPX' ? 'INX' : 'IXIC'
    try {
      const tencentRes = await fetch(`https://qt.gtimg.cn/q=us${tencentCode}`)
      if (!tencentRes.ok) return null
      const text = await tencentRes.text()
      const payload = text.split('"')[1]
      if (!payload) return null
      const parts = payload.split('~')
      const price = Number(parts[3])
      if (!Number.isFinite(price)) return null
      return {
        price,
        source: 'TENCENT',
        name: indexCode === 'SPX' ? '标普500' : '纳斯达克',
      }
    } catch {
      return null
    }
  }

  try {
    const binanceRes = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`)
    if (binanceRes.ok) {
      const data = (await binanceRes.json()) as { price: string }
      const price = Number(data.price)
      if (Number.isFinite(price)) return { price, source: 'BINANCE' }
    }
  } catch {
    // 币安异常时降级欧易
  }

  try {
    const okxRes = await fetch(
      `https://www.okx.com/api/v5/market/ticker?instId=${encodeURIComponent(toOkxInstId(symbol))}`
    )
    if (!okxRes.ok) return null
    const data = (await okxRes.json()) as { data?: Array<{ last?: string }> }
    const price = Number(data.data?.[0]?.last)
    return Number.isFinite(price) ? { price, source: 'OKX' } : null
  } catch {
    return null
  }
}

export function MarketWatchPanel() {
  const [inputValue, setInputValue] = useState('')
  const [watchList, setWatchList] = useState<string[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState<string>('')
  const [priceMap, setPriceMap] = useState<Record<string, PriceState>>({})
  const [nameMap, setNameMap] = useState<Record<string, string>>({})
  const [errorText, setErrorText] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [panelPosition, setPanelPosition] = useState<{ x: number; y: number } | null>(null)
  const [chartSize, setChartSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })
  const chartRef = useRef<HTMLDivElement>(null)
  const chartViewportRef = useRef<HTMLDivElement>(null)
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const originalTitleRef = useRef('')
  const dragStateRef = useRef<{ active: boolean; pointerId: number; offsetX: number; offsetY: number }>({
    active: false,
    pointerId: -1,
    offsetX: 0,
    offsetY: 0,
  })
  const pendingPanelPositionRef = useRef<{ x: number; y: number } | null>(null)

  // 同步面板位置到 DOM；拖拽过程中跳过，避免重渲染把位置打回旧值
  const applyPanelPosition = (position: { x: number; y: number }) => {
    if (!panelRef.current) return
    panelRef.current.style.left = `${position.x}px`
    panelRef.current.style.top = `${position.y}px`
  }

  // 初始化监控列表
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) {
      setWatchList(DEFAULT_WATCH_LIST)
      setSelectedSymbol(DEFAULT_WATCH_LIST[0])
      return
    }
    try {
      const parsed = JSON.parse(raw) as string[]
      const list = sanitizeWatchList(parsed.filter(Boolean))
      if (list.length === 0) {
        setWatchList(DEFAULT_WATCH_LIST)
        setSelectedSymbol(DEFAULT_WATCH_LIST[0])
        return
      }
      // 已有本地数据时补齐默认观察项，避免升级后需要手动逐个添加
      const mergedList = sanitizeWatchList(Array.from(new Set([...list, ...DEFAULT_WATCH_LIST])))
      setWatchList(mergedList)
      setSelectedSymbol(mergedList[0])
    } catch {
      setWatchList(DEFAULT_WATCH_LIST)
      setSelectedSymbol(DEFAULT_WATCH_LIST[0])
    }
  }, [])

  // 持久化监控列表
  useEffect(() => {
    if (watchList.length === 0) {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
      return
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(watchList))
  }, [watchList])

  // 轮询更新价格
  useEffect(() => {
    if (watchList.length === 0) return
    let stopped = false
    const refreshAllPrices = async () => {
      const entries = await Promise.all(
        watchList.map(async (symbol) => ({
          symbol,
          result: await fetchPriceWithFallback(symbol),
        }))
      )
      if (stopped) return
      const nameUpdates: Record<string, string> = {}
      setPriceMap((prev) => {
        const next = { ...prev }
        entries.forEach(({ symbol, result }) => {
          if (!result) return
          next[symbol] = {
            value: result.price,
            prev: prev[symbol]?.value ?? null,
            source: result.source,
          }
          if (result.name) nameUpdates[symbol] = result.name
        })
        return next
      })
      if (Object.keys(nameUpdates).length > 0) {
        setNameMap((prev) => ({ ...prev, ...nameUpdates }))
      }
    }

    refreshAllPrices()
    const timer = window.setInterval(refreshAllPrices, 4000)
    return () => {
      stopped = true
      window.clearInterval(timer)
    }
  }, [watchList])

  // 全屏状态同步
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === chartContainerRef.current)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  // 监听图表容器尺寸，确保 TradingView 以真实像素尺寸渲染
  useEffect(() => {
    if (!chartViewportRef.current) return
    const target = chartViewportRef.current
    const updateSize = () => {
      setChartSize({
        width: Math.floor(target.clientWidth),
        height: Math.floor(target.clientHeight),
      })
    }
    updateSize()
    const observer = new ResizeObserver(() => updateSize())
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  const selectedSymbolLabel = useMemo(() => {
    if (!selectedSymbol) return ''
    if (isCnStockSymbol(selectedSymbol)) {
      return nameMap[selectedSymbol] ?? getCnStockCode(selectedSymbol)
    }
    if (isUsIndexSymbol(selectedSymbol)) {
      return nameMap[selectedSymbol] ?? (getUsIndexCode(selectedSymbol) === 'SPX' ? '标普500' : '纳斯达克')
    }
    return selectedSymbol.replace(/USDT$/, '')
  }, [nameMap, selectedSymbol])

  const tradingViewSymbol = useMemo(() => {
    if (!selectedSymbol) return ''
    return toTradingViewSymbol(selectedSymbol, priceMap[selectedSymbol]?.source)
  }, [priceMap, selectedSymbol])

  // 重建 TradingView 图表
  useEffect(() => {
    if (!chartRef.current) return
    const target = chartRef.current
    target.innerHTML = ''
    if (!selectedSymbol) return
    if (chartSize.width <= 0 || chartSize.height <= 0) return

    const widgetContainer = document.createElement('div')
    widgetContainer.className = 'tradingview-widget-container__widget h-full w-full min-h-full'
    target.appendChild(widgetContainer)

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.innerHTML = JSON.stringify({
      autosize: false,
      width: chartSize.width,
      height: chartSize.height,
      symbol: tradingViewSymbol,
      interval: '30',
      timezone: 'Asia/Shanghai',
      theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
      style: '1',
      locale: 'zh_CN',
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: false,
      calendar: false,
      support_host: 'https://www.tradingview.com',
    })
    target.appendChild(script)
  }, [selectedSymbol, tradingViewSymbol, chartSize])

  // 同步标签页标题
  useEffect(() => {
    if (!originalTitleRef.current) originalTitleRef.current = document.title
    if (!selectedSymbol) {
      document.title = originalTitleRef.current
      return
    }
    const selectedPrice = priceMap[selectedSymbol]
    if (!selectedPrice) {
      document.title = `${selectedSymbolLabel || selectedSymbol} | 行情监控`
      return
    }
    document.title = `${formatPrice(selectedPrice.value)} ${selectedSymbolLabel || selectedSymbol} | 行情监控`
  }, [priceMap, selectedSymbol, selectedSymbolLabel])

  // 卸载时恢复原标题
  useEffect(
    () => () => {
      if (originalTitleRef.current) document.title = originalTitleRef.current
    },
    []
  )

  // 初始化右侧面板位置，并在窗口变化时做边界收敛
  useEffect(() => {
    const defaults = getDefaultPanelPosition()
    const raw = localStorage.getItem(PANEL_POSITION_KEY)
    let position = defaults
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { x?: number; y?: number }
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          position = normalizePanelPosition({ x: parsed.x, y: parsed.y })
        }
      } catch {
        // 位置数据异常时回退默认位置
      }
    }
    setPanelPosition(position)
    applyPanelPosition(position)
  }, [])

  useEffect(() => {
    if (!panelPosition || dragStateRef.current.active) return
    applyPanelPosition(panelPosition)
  }, [panelPosition])

  useEffect(() => {
    if (!panelPosition) return
    localStorage.setItem(PANEL_POSITION_KEY, JSON.stringify(panelPosition))
  }, [panelPosition])

  useEffect(() => {
    return () => hideDragShield()
  }, [])

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const normalized = normalizeSymbol(inputValue)
    if (!normalized) return
    if (watchList.includes(normalized)) {
      setErrorText(`${normalized} 已在监控列表中`)
      return
    }
    setWatchList((prev) => [...prev, normalized])
    setSelectedSymbol(normalized)
    setInputValue('')
    setErrorText('')
  }

  const removeSymbol = (symbol: string) => {
    const next = watchList.filter((item) => item !== symbol)
    setWatchList(next)
    if (next.length === 0) {
      setSelectedSymbol('')
      return
    }
    if (selectedSymbol === symbol) setSelectedSymbol(next[0])
  }

  const toggleFullscreen = async () => {
    if (!chartContainerRef.current) return
    try {
      if (document.fullscreenElement === chartContainerRef.current) {
        await document.exitFullscreen()
        return
      }
      await chartContainerRef.current.requestFullscreen()
    } catch {
      setErrorText('浏览器不支持全屏或被拦截')
    }
  }

  const startDragPanel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    const panel = panelRef.current
    if (!panel) return

    const rect = panel.getBoundingClientRect()
    event.preventDefault()
    event.stopPropagation()

    const pointerId = event.pointerId
    const offsetX = event.clientX - rect.left
    const offsetY = event.clientY - rect.top

    dragStateRef.current = {
      active: true,
      pointerId,
      offsetX,
      offsetY,
    }
    showDragShield()

    try {
      panel.setPointerCapture(pointerId)
    } catch {
      // 部分环境下 capture 可能失败，仍依赖 window 捕获阶段监听
    }

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId || !dragStateRef.current.active) return
      e.preventDefault()
      const panelRect = panel.getBoundingClientRect()
      const maxX = Math.max(0, window.innerWidth - panelRect.width)
      const maxY = Math.max(0, window.innerHeight - panelRect.height)
      const nextX = Math.min(maxX, Math.max(0, e.clientX - offsetX))
      const nextY = Math.min(maxY, Math.max(0, e.clientY - offsetY))
      pendingPanelPositionRef.current = { x: nextX, y: nextY }
      applyPanelPosition({ x: nextX, y: nextY })
    }

    const endDrag = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return
      window.removeEventListener('pointermove', onPointerMove, true)
      window.removeEventListener('pointerup', endDrag, true)
      window.removeEventListener('pointercancel', endDrag, true)
      hideDragShield()
      try {
        panel.releasePointerCapture(pointerId)
      } catch {
        // 指针可能已被浏览器释放
      }
      const pending = pendingPanelPositionRef.current
      if (pending) {
        setPanelPosition(pending)
        pendingPanelPositionRef.current = null
      }
      dragStateRef.current.active = false
      dragStateRef.current.pointerId = -1
    }

    // 捕获阶段挂到 window，Chrome 经过 iframe 时仍能收到 pointer 事件
    window.addEventListener('pointermove', onPointerMove, true)
    window.addEventListener('pointerup', endDrag, true)
    window.addEventListener('pointercancel', endDrag, true)
  }

  const getDisplayInfo = (symbol: string) => {
    if (isCnStockSymbol(symbol)) {
      return {
        label: nameMap[symbol] ?? getCnStockCode(symbol),
        iconUrl: ASSET_ICON_URLS.CN_STOCK,
      }
    }
    if (isUsIndexSymbol(symbol)) {
      const isSpx = getUsIndexCode(symbol) === 'SPX'
      return {
        label: isSpx ? '标普500' : '纳斯达克',
        iconUrl: isSpx ? ASSET_ICON_URLS.SPX : ASSET_ICON_URLS.IXIC,
      }
    }
    const base = symbol.replace(/USDT$/, '')
    return {
      label: base,
      iconUrl: getHyperliquidCoinIconUrl(base),
    }
  }

  const formatQuotePrice = (symbol: string, value: number) => {
    const prefix = isCnStockSymbol(symbol) ? '¥' : '$'
    return `${prefix}${formatPrice(value)}`
  }

  return (
    <section className="market-watch-root">
      {/* 左侧图表区：右侧留出空间给悬浮观察面板 */}
      <div
        ref={chartContainerRef}
        className={`rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden flex flex-col ${isFullscreen ? 'bg-base' : 'market-watch-chart'}`}
      >
          <div className="px-4 md:px-5 py-3 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
            <div className="font-medium">TradingView - {selectedSymbolLabel || '未选择标的'}</div>
            <button
              type="button"
              className="text-xs px-2 py-1 rounded-md border border-zinc-300 dark:border-zinc-600 hover:border-accent/60"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? '退出全屏' : '全屏'}
            </button>
          </div>
          <div
            ref={chartViewportRef}
            className={
              isFullscreen
                ? 'market-watch-chart-viewport-fullscreen bg-zinc-50 dark:bg-zinc-900'
                : 'flex-1 min-h-0 bg-zinc-50 dark:bg-zinc-900'
            }
          >
            <div
              ref={chartRef}
              className="market-watch-tv-widget h-full w-full tradingview-widget-container"
            />
          </div>
      </div>

      {/* 右侧悬浮面板：支持拖拽自由摆放 */}
      <aside ref={panelRef} className="market-watch-panel">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white/85 dark:bg-zinc-800/85 backdrop-blur shadow-sm">
          {/* 拖动手柄：仅此处触发拖动 */}
          <div
            className="market-watch-drag-handle flex flex-col items-center gap-0.5 border-b border-zinc-200 dark:border-zinc-700"
            onPointerDown={startDragPanel}
            aria-label="拖动监控面板"
            title="拖动移动面板"
          >
            <span className="w-9 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <span className="flex gap-0.5" aria-hidden>
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            </span>
          </div>

          <div className="px-1.5 py-1.5 border-b border-zinc-200 dark:border-zinc-700">
            <form className="flex gap-1" onSubmit={onSubmit}>
              <input
                className="market-watch-text-11 flex-1 min-w-0 rounded border border-zinc-300 dark:border-zinc-600 bg-transparent px-1.5 py-0.5 outline-none focus-visible:ring-1 ring-accent/40"
                placeholder="HYPE / 标普"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                className="market-watch-text-11 shrink-0 rounded px-1.5 py-0.5 bg-accent text-white dark:text-black hover:opacity-90 transition"
              >
                添加
              </button>
            </form>
            {errorText && <div className="market-watch-text-10 mt-1 text-red-500">{errorText}</div>}
          </div>

          {/* 监控列表：单行展示图标、名称与价格 */}
          <div className="market-watch-list">
            {watchList.map((symbol) => {
              const price = priceMap[symbol]
              const displayInfo = getDisplayInfo(symbol)
              const isSelected = selectedSymbol === symbol
              const isUp = price?.prev != null ? price.value >= price.prev : null
              const priceText = price ? formatQuotePrice(symbol, price.value) : '…'
              return (
                <div
                  key={symbol}
                  data-market-watch-row
                  className={`market-watch-row px-1.5 flex items-center gap-1.5 border-b last:border-b-0 border-zinc-200 dark:border-zinc-700 cursor-pointer ${
                    isSelected ? 'bg-accent/10' : 'hover:bg-zinc-100/70 dark:hover:bg-zinc-700/40'
                  }`}
                  onClick={() => setSelectedSymbol(symbol)}
                >
                  <img
                    src={displayInfo.iconUrl}
                    alt={`${displayInfo.label} icon`}
                    className="market-watch-coin-icon"
                    draggable={false}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onDragStart={(e) => e.preventDefault()}
                    onError={(e) => {
                      const target = e.currentTarget
                      if (target.src !== ICON_FALLBACK_URL) {
                        target.src = ICON_FALLBACK_URL
                      }
                    }}
                  />
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-1">
                    <span className="text-xs font-medium truncate">{displayInfo.label}</span>
                    <span
                      className={`market-watch-text-11 tabular-nums shrink-0 ${
                        isUp == null ? 'text-base/70' : isUp ? 'text-emerald-500' : 'text-red-500'
                      }`}
                    >
                      {priceText}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 w-4 h-4 leading-none text-base/40 hover:text-red-500 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeSymbol(symbol)
                    }}
                    aria-label={`删除 ${displayInfo.label}`}
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </aside>
    </section>
  )
}
