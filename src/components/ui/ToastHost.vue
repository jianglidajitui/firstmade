<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toasts" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="toast"
          :class="`is-${t.type}`"
          @click="dismiss(t.id)"
        >
          {{ t.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toasts {
  position: fixed;
  top: 84px;
  right: 20px;
  z-index: 100;
  display: grid;
  gap: 10px;
  width: min(360px, calc(100vw - 40px));
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  padding: 12px 14px;
  border-radius: var(--radius);
  background: var(--ink);
  color: #fff;
  font-size: 14px;
  box-shadow: var(--shadow-md);
  cursor: pointer;
}

.toast.is-success {
  background: #173528;
}

.toast.is-error {
  background: #5c1d18;
}

.toast-enter-active {
  transition:
    opacity var(--dur-hover) var(--ease),
    transform var(--dur-hover) var(--ease);
}

.toast-leave-active {
  transition:
    opacity 160ms var(--ease-out),
    transform 160ms var(--ease-out);
  position: absolute;
  width: min(360px, calc(100vw - 40px));
}

.toast-move {
  transition: transform var(--dur-list) var(--ease);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
