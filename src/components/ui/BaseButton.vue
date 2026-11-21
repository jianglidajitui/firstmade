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
  arrow: Boolean,
})
</script>

<template>
  <button
    class="btn"
    :class="[`is-${variant}`, `is-${size}`, { 'is-block': block, 'has-arrow': arrow }]"
    :type="type"
    :disabled="disabled"
  >
    <span class="btn__label"><slot /></span>
    <svg
      v-if="arrow"
      class="btn__arrow"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      aria-hidden="true"
    >
      <path d="M3 8h10M9 4l4 4-4 4" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
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
    background var(--dur-hover) var(--ease),
    color var(--dur-hover) var(--ease),
    border-color var(--dur-hover) var(--ease),
    opacity var(--dur-hover) var(--ease),
    transform var(--dur-press) var(--ease);
  white-space: nowrap;
}

.btn:active:not(:disabled) {
  transform: scale(0.98);
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn__arrow {
  transition: transform var(--dur-hover) var(--ease);
  flex-shrink: 0;
}

@media (hover: hover) and (pointer: fine) {
  .has-arrow:hover:not(:disabled) .btn__arrow {
    transform: translateX(3px);
  }
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

@media (hover: hover) and (pointer: fine) {
  .is-primary:hover:not(:disabled) {
    background: #2a2a2a;
  }
}

.is-secondary {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--line);
}

@media (hover: hover) and (pointer: fine) {
  .is-secondary:hover:not(:disabled) {
    border-color: var(--ink);
  }
}

.is-accent {
  background: var(--accent);
  color: #fff;
}

@media (hover: hover) and (pointer: fine) {
  .is-accent:hover:not(:disabled) {
    filter: brightness(0.95);
  }
}

.is-ghost {
  background: transparent;
  color: var(--ink);
}

@media (hover: hover) and (pointer: fine) {
  .is-ghost:hover:not(:disabled) {
    background: rgba(23, 23, 23, 0.04);
  }
}

.is-light {
  background: #fff;
  color: var(--ink);
}

@media (hover: hover) and (pointer: fine) {
  .is-light:hover:not(:disabled) {
    background: #f0f0ec;
  }
}

.is-dark-ghost {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.28);
}

@media (hover: hover) and (pointer: fine) {
  .is-dark-ghost:hover:not(:disabled) {
    border-color: #fff;
  }
}
</style>
