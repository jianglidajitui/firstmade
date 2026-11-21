<script setup>
defineProps({
  title: String,
  open: Boolean,
})

defineEmits(['toggle'])
</script>

<template>
  <div class="acc" :class="{ 'is-open': open }">
    <button class="acc__trigger" type="button" :aria-expanded="open" @click="$emit('toggle')">
      <span>{{ title }}</span>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6">
        <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <div v-show="open" class="acc__panel">
      <p><slot /></p>
    </div>
  </div>
</template>

<style scoped>
.acc {
  border-bottom: 1px solid var(--line);
}

.acc__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 0;
  text-align: left;
  font-size: 15px;
  font-weight: 500;
}

.acc__trigger svg {
  transition: transform var(--dur) var(--ease);
  color: var(--muted);
  flex-shrink: 0;
}

.is-open .acc__trigger svg {
  transform: rotate(180deg);
}

.acc__panel {
  padding: 0 0 18px;
}

.acc__panel p {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.7;
}
</style>
