import { STATUS_LABELS } from '@/data/products'

export function formatMoney(value) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return `¥${Number(value).toLocaleString('zh-CN')}`
}

export function formatDate(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function statusLabel(status) {
  return STATUS_LABELS[status] || status
}

export function remainingLabel(days) {
  if (days <= 0) return '已截止'
  return `剩余 ${days} 天`
}
