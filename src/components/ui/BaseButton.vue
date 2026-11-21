<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'md',
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: Boolean,
  block: Boolean,
})
</script>

<template>
  <button
    class="btn"
    :class="[`is-${variant}`, `is-${size}`, { 'is-block': block }]"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--radius-sm);
  font-weight: 500;
  letter-spacing: 0.01em;
  transition:
    background var(--dur) var(--ease),
    color var(--dur) var(--ease),
    border-color var(--dur) var(--ease),
    transform var(--dur) var(--ease),
    opacity var(--dur) var(--ease);
  white-space: nowrap;
}

.btn:active:not(:disabled) {
  transform: translateY(1px);
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.is-block {
  width: 100%;
}

.is-sm {
  height: 36px;
  padding: 0 14px;
  font-size: 13px;
}

.is-md {
  height: 44px;
  padding: 0 20px;
  font-size: 14px;
}

.is-lg {
  height: 52px;
  padding: 0 24px;
  font-size: 15px;
}

.is-primary {
  background: var(--ink);
  color: #fff;
}

.is-primary:hover:not(:disabled) {
  background: #2a2a2a;
}

.is-secondary {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--line);
}

.is-secondary:hover:not(:disabled) {
  border-color: var(--ink);
}

.is-accent {
  background: var(--accent);
  color: #fff;
}

.is-accent:hover:not(:disabled) {
  filter: brightness(0.95);
}

.is-ghost {
  background: transparent;
  color: var(--ink);
}

.is-ghost:hover:not(:disabled) {
  background: rgba(23, 23, 23, 0.04);
}

.is-light {
  background: #fff;
  color: var(--ink);
}

.is-light:hover:not(:disabled) {
  background: #f0f0ec;
}

.is-dark-ghost {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.28);
}

.is-dark-ghost:hover:not(:disabled) {
  border-color: #fff;
}
</style>
