<script setup>
defineProps({
  title: {
    type: String,
    default: '暂无内容',
  },
  description: String,
})
</script>

<template>
  <div class="empty">
    <div class="empty__icon" aria-hidden="true">
      <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.4">
        <rect x="8" y="12" width="32" height="24" rx="4" />
        <path d="M16 24h16M16 30h10" stroke-linecap="round" />
      </svg>
    </div>
    <h3>{{ title }}</h3>
    <p v-if="description">{{ description }}</p>
    <div v-if="$slots.default" class="empty__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.empty {
  text-align: center;
  padding: 48px 20px;
  color: var(--muted);
}

.empty__icon {
  margin-bottom: 12px;
  color: #b0b0a8;
}

.empty h3 {
  color: var(--ink);
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty p {
  font-size: 14px;
  max-width: 28em;
  margin: 0 auto;
}

.empty__actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
