<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useUI } from '@/composables/useUI'

const props = defineProps({
  open: Boolean,
  title: String,
  side: {
    type: String,
    default: 'right',
  },
})

const emit = defineEmits(['close'])
const { lockScroll, unlockScroll } = useUI()
const panel = ref(null)
let lastFocus = null
let locked = false

function close() {
  if (!props.open) return
  emit('close')
}

function onKey(e) {
  if (props.open && e.key === 'Escape') close()
}

function onEnter() {
  if (locked) return
  lockScroll()
  locked = true
  lastFocus = document.activeElement
  nextTick(() => {
    panel.value?.querySelector('button, [href], input')?.focus()
  })
}

function onAfterLeave() {
  if (props.open || !locked) return
  unlockScroll()
  locked = false
  if (lastFocus?.focus) lastFocus.focus()
  lastFocus = null
}

watch(
  () => props.open,
  (open) => {
    if (open) onEnter()
  },
)

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  if (locked) {
    unlockScroll()
    locked = false
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition :name="`drawer-${side}`" @after-leave="onAfterLeave">
      <div v-if="open" class="drawer" :class="`is-${side}`">
        <div class="drawer__backdrop" @click="close" />
        <aside
          ref="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          tabindex="-1"
        >
          <header class="drawer__header">
            <h3>{{ title }}</h3>
            <button class="drawer__close" type="button" aria-label="关闭" @click="close">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
              </svg>
            </button>
          </header>
          <div class="drawer__body">
            <slot />
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer {
  position: fixed;
  inset: 0;
  z-index: 70;
}

.drawer__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(17, 17, 17, 0.36);
}

.drawer__panel {
  position: absolute;
  top: 0;
  bottom: 0;
  width: min(100%, 420px);
  background: var(--surface);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
}

.is-right .drawer__panel {
  right: 0;
}

.is-left .drawer__panel {
  left: 0;
}

.drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid var(--line);
}

.drawer__header h3 {
  font-size: 16px;
  font-weight: 600;
}

.drawer__close {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-sm);
  color: var(--muted);
  transition:
    background var(--dur-hover) var(--ease),
    color var(--dur-hover) var(--ease);
}

@media (hover: hover) and (pointer: fine) {
  .drawer__close:hover {
    background: rgba(23, 23, 23, 0.05);
    color: var(--ink);
  }
}

.drawer__body {
  flex: 1;
  overflow: auto;
  padding: 16px 20px 28px;
}

.drawer-right-enter-active .drawer__backdrop,
.drawer-left-enter-active .drawer__backdrop {
  transition: opacity var(--dur-overlay) var(--ease);
}

.drawer-right-leave-active .drawer__backdrop,
.drawer-left-leave-active .drawer__backdrop {
  transition: opacity var(--dur-overlay-out) var(--ease-out);
}

.drawer-right-enter-from .drawer__backdrop,
.drawer-right-leave-to .drawer__backdrop,
.drawer-left-enter-from .drawer__backdrop,
.drawer-left-leave-to .drawer__backdrop {
  opacity: 0;
}

.drawer-right-enter-active .drawer__panel,
.drawer-left-enter-active .drawer__panel {
  transition: transform var(--dur-overlay) var(--ease);
}

.drawer-right-leave-active .drawer__panel,
.drawer-left-leave-active .drawer__panel {
  transition: transform var(--dur-overlay-out) var(--ease-out);
}

.drawer-right-enter-from .drawer__panel,
.drawer-right-leave-to .drawer__panel {
  transform: translateX(100%);
}

.drawer-left-enter-from .drawer__panel,
.drawer-left-leave-to .drawer__panel {
  transform: translateX(-100%);
}
</style>
