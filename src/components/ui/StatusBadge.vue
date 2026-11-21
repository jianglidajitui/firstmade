<script setup>
import { statusLabel } from '@/utils/format'

defineProps({
  status: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <span class="badge" :class="`is-${status}`">{{ statusLabel(status) }}</span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.02em;
  border: 1px solid var(--line);
  color: var(--muted);
  background: var(--surface);
}

.is-crowdfunding {
  color: var(--accent);
  border-color: rgba(217, 56, 43, 0.25);
  background: var(--accent-soft);
}

.is-funded {
  color: #8a5a00;
  border-color: rgba(138, 90, 0, 0.25);
  background: rgba(138, 90, 0, 0.06);
}

.is-producing {
  color: #1f4f8a;
  border-color: rgba(31, 79, 138, 0.25);
  background: rgba(31, 79, 138, 0.06);
}

.is-in_stock {
  color: var(--success);
  border-color: rgba(31, 122, 76, 0.25);
  background: rgba(31, 122, 76, 0.06);
}

.is-ended {
  color: var(--muted);
}
</style>
