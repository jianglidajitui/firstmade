import { onMounted, onUnmounted, ref } from 'vue'

export function useReveal() {
  const el = ref(null)
  let observer

  onMounted(() => {
    if (!el.value) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.value.classList.add('is-visible')
      return
    }
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    observer.observe(el.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return el
}
