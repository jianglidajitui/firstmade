<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useUI } from '@/composables/useUI'

const props = defineProps({
  open: Boolean,
  title: String,
  width: {
    type: String,
    default: '480px',
  },
})

const emit = defineEmits(['close'])
const { lockScroll, unlockScroll } = useUI()
const panel = ref(null)
let lastFocus = null
let locked = false

function close() {
  emit('close')
}

function onKey(e) {
  if (!props.open) return
  if (e.key === 'Escape') close()
}

watch(
  () => props.open,
  (open) => {
    if (open && !locked) {
      lockScroll()
      locked = true
      lastFocus = document.activeElement
      requestAnimationFrame(() => {
        panel.value?.querySelector('button, [href], input, select, textarea')?.focus()
      })
    } else if (!open && locked) {
      unlockScroll()
      locked = false
      if (lastFocus?.focus) lastFocus.focus()
    }
  },
)

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  if (locked) unlockScroll()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal" role="dialog" aria-modal="true" :aria-label="title">
      <div class="modal__backdrop" @click="close" />
      <div ref="panel" class="modal__panel" :style="{ maxWidth: width }" tabindex="-1">
        <header class="modal__header">
          <h3>{{ title }}</h3>
          <button class="modal__close" type="button" aria-label="关闭" @click="close">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
            </svg>
          </button>
        </header>
        <div class="modal__body">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="modal__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 20px;
}

.modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(17, 17, 17, 0.42);
}

.modal__panel {
  position: relative;
  width: min(100%, 480px);
  max-height: min(90vh, 720px);
  overflow: auto;
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  animation: rise 220ms var(--ease);
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--line);
}

.modal__header h3 {
  font-size: 16px;
  font-weight: 600;
}

.modal__close {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-sm);
  color: var(--muted);
}

.modal__close:hover {
  background: rgba(23, 23, 23, 0.05);
  color: var(--ink);
}

.modal__body {
  padding: 20px;
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px 20px;
  border-top: 1px solid var(--line);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
