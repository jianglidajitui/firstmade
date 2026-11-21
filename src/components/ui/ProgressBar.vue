<script setup>
defineProps({
  value: {
    type: Number,
    default: 0,
  },
  dark: Boolean,
  accent: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div class="progress" :class="{ 'is-dark': dark }" role="progressbar" :aria-valuenow="value" aria-valuemin="0" aria-valuemax="100">
    <div
      class="progress__fill"
      :class="{ 'is-accent': accent }"
      :style="{ width: `${Math.min(100, Math.max(0, value))}%` }"
    />
  </div>
</template>

<style scoped>
.progress {
  width: 100%;
  height: 2px;
  background: var(--line);
  overflow: hidden;
  border-radius: 999px;
}

.progress.is-dark {
  background: rgba(255, 255, 255, 0.18);
}

.progress__fill {
  height: 100%;
  background: var(--ink);
  transition: width 300ms var(--ease);
}

.progress__fill.is-accent {
  background: var(--accent);
}

.is-dark .progress__fill {
  background: #fff;
}

.is-dark .progress__fill.is-accent {
  background: var(--accent);
}
</style>
