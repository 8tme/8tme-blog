import { createPortal } from 'react-dom'

export function RootPortal({
  to,
  children,
}: {
  to?: HTMLElement
  children: React.ReactNode
}) {
  // SSR 阶段没有 document，直接跳过 portal 渲染
  if (typeof document === 'undefined') return null
  return createPortal(children, to ?? document.body)
}
