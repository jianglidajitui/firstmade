<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toasts" aria-live="polite">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast"
        :class="`is-${t.type}`"
        @click="dismiss(t.id)"
      >
        {{ t.message }}
      </div>
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
  animation: in 220ms var(--ease);
  cursor: pointer;
}

.toast.is-success {
  background: #173528;
}

.toast.is-error {
  background: #5c1d18;
}

@keyframes in {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
