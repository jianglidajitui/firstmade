import { onMounted, onUnmounted, ref } from 'vue'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function markVisible(root) {
  if (!root) return
  root.classList.add('is-visible')
  root.querySelectorAll('[data-reveal-child]').forEach((child, index) => {
    if (!child.style.getPropertyValue('--reveal-delay')) {
      child.style.setProperty('--reveal-delay', `${Math.min(index * 60, 240)}ms`)
    }
    child.classList.add('is-visible')
  })
}

/**
 * IntersectionObserver 入场：只播放一次。
 * 容器加 .reveal，子项加 data-reveal-child 可错峰。
 */
export function useReveal(options = {}) {
  const el = ref(null)
  let observer

  onMounted(() => {
    const node = el.value
    if (!node) return

    if (prefersReducedMotion()) {
      markVisible(node)
      return
    }

    // 已在视口内（含返回首页恢复位置）立刻显示，避免先隐藏再闪入
    const rect = node.getBoundingClientRect()
    const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0
    if (inView) {
      markVisible(node)
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          markVisible(entry.target)
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: options.threshold ?? 0.08,
        rootMargin: options.rootMargin ?? '0px 0px -8% 0px',
      },
    )

    try {
      observer.observe(node)
    } catch {
      markVisible(node)
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return el
}
