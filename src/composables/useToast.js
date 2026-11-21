import { reactive } from 'vue'

const state = reactive({
  items: [],
})

let seed = 0

export function useToast() {
  function push(message, type = 'info', duration = 2800) {
    const id = ++seed
    state.items.push({ id, message, type })
    window.setTimeout(() => dismiss(id), duration)
    return id
  }

  function dismiss(id) {
    const idx = state.items.findIndex((t) => t.id === id)
    if (idx >= 0) state.items.splice(idx, 1)
  }

  function success(message) {
    return push(message, 'success')
  }

  function error(message) {
    return push(message, 'error')
  }

  return {
    toasts: state.items,
    push,
    dismiss,
    success,
    error,
  }
}
