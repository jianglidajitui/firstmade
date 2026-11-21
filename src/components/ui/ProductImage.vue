<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  src: String,
  alt: {
    type: String,
    default: '',
  },
  contain: {
    type: Boolean,
    default: true,
  },
  dark: Boolean,
  eager: Boolean,
  priority: {
    type: String,
    default: '',
  },
})

const failed = ref(false)
const loaded = ref(false)

const loadingAttr = computed(() => (props.eager ? 'eager' : 'lazy'))
const fetchPriority = computed(() => props.priority || undefined)

watch(
  () => props.src,
  () => {
    failed.value = false
    loaded.value = false
  },
)

function onLoad(e) {
  loaded.value = true
  // 缓存命中时部分浏览器仍触发 load，保持及时可见
  if (e?.target?.complete) loaded.value = true
}

function onError() {
  failed.value = true
  loaded.value = false
}
</script>

<template>
  <div class="media" :class="{ 'is-dark': dark, 'is-failed': failed }">
    <img
      v-if="src && !failed"
      :src="src"
      :alt="alt"
      :loading="loadingAttr"
      :fetchpriority="fetchPriority"
      decoding="async"
      :class="{ contain, 'is-loaded': loaded }"
      @load="onLoad"
      @error="onError"
    />
    <div v-else class="fallback" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none">
        <rect x="8" y="12" width="32" height="24" rx="4" stroke="currentColor" stroke-width="1.5" />
        <circle cx="18" cy="20" r="3" stroke="currentColor" stroke-width="1.5" />
        <path d="M8 30l8-6 6 5 6-8 12 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span>图片暂不可用</span>
    </div>
  </div>
</template>

<style scoped>
.media {
  width: 100%;
  height: 100%;
  background: #ecece7;
  display: grid;
  place-items: center;
  overflow: hidden;
  position: relative;
}

.media.is-dark {
  background: #161616;
}

img {
  width: 100%;
  height: 100%;
  object-position: center;
  opacity: 0;
  transition: opacity 220ms var(--ease);
}

img.is-loaded {
  opacity: 1;
}

img.contain {
  object-fit: contain;
}

img:not(.contain) {
  object-fit: cover;
}

.fallback {
  display: grid;
  place-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 12px;
}

.fallback svg {
  width: 40px;
  height: 40px;
}

.is-dark .fallback {
  color: var(--dark-muted);
}

@media (prefers-reduced-motion: reduce) {
  img {
    opacity: 1;
    transition: none;
  }
}
</style>
