<script setup>
import { computed, nextTick, onUnmounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ReservationModal from '@/components/reservation/ReservationModal.vue'
import PurchaseModal from '@/components/purchase/PurchaseModal.vue'
import { CATEGORIES, STATUS_LABELS } from '@/data/products'
import { useStore } from '@/composables/useStore'

const route = useRoute()
const router = useRouter()
const { products, progressOf } = useStore()

const filters = reactive({
  q: '',
  category: 'all',
  status: 'all',
  sort: 'newest',
})

const reserveTarget = reactive({ value: null })
const buyTarget = reactive({ value: null })

const statusOptions = [
  { id: 'all', label: '全部' },
  ...Object.entries(STATUS_LABELS).map(([id, label]) => ({ id, label })),
]

const sortOptions = [
  { id: 'newest', label: '最新发布' },
  { id: 'supporters', label: '支持人数最多' },
  { id: 'progress', label: '众筹进度最高' },
]

let syncingFromRoute = false
let queryTimer = 0

function readQuery(query) {
  return {
    q: typeof query.q === 'string' ? query.q : '',
    category: typeof query.category === 'string' ? query.category : 'all',
    status: typeof query.status === 'string' ? query.status : 'all',
    sort: typeof query.sort === 'string' ? query.sort : 'newest',
  }
}

function buildQuery() {
  const query = {}
  if (filters.q.trim()) query.q = filters.q.trim()
  if (filters.category !== 'all') query.category = filters.category
  if (filters.status !== 'all') query.status = filters.status
  if (filters.sort !== 'newest') query.sort = filters.sort
  return query
}

function queriesEqual(a, b) {
  return (
    (a.q || '') === (b.q || '') &&
    (a.category || 'all') === (b.category || 'all') &&
    (a.status || 'all') === (b.status || 'all') &&
    (a.sort || 'newest') === (b.sort || 'newest')
  )
}

function syncQuery() {
  const next = buildQuery()
  const current = readQuery(route.query)
  if (queriesEqual(next, current)) return
  router.replace({ path: '/discover', query: next })
}

watch(
  () => route.query,
  async (query) => {
    const next = readQuery(query)
    if (
      filters.q === next.q &&
      filters.category === next.category &&
      filters.status === next.status &&
      filters.sort === next.sort
    ) {
      return
    }
    syncingFromRoute = true
    filters.q = next.q
    filters.category = next.category
    filters.status = next.status
    filters.sort = next.sort
    await nextTick()
    syncingFromRoute = false
  },
  { immediate: true },
)

watch(
  () => filters.q,
  () => {
    if (syncingFromRoute) return
    window.clearTimeout(queryTimer)
    queryTimer = window.setTimeout(syncQuery, 280)
  },
)

watch(
  () => [filters.category, filters.status, filters.sort],
  () => {
    if (syncingFromRoute) return
    window.clearTimeout(queryTimer)
    syncQuery()
  },
)

onUnmounted(() => window.clearTimeout(queryTimer))

const filtered = computed(() => {
  const q = filters.q.trim().toLowerCase()
  let list = products.value.filter((p) => {
    if (filters.category !== 'all' && p.category !== filters.category) return false
    if (filters.status !== 'all' && p.status !== filters.status) return false
    if (!q) return true
    return (
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    )
  })

  list = [...list].sort((a, b) => {
    if (filters.sort === 'supporters') return b.supporters - a.supporters
    if (filters.sort === 'progress') return progressOf(b) - progressOf(a)
    return b.createdAt - a.createdAt
  })
  return list
})

function resetFilters() {
  filters.q = ''
  filters.category = 'all'
  filters.status = 'all'
  filters.sort = 'newest'
}
</script>

<template>
  <div class="discover page-wrap">
    <div class="container">
      <header class="head">
        <p class="eyebrow">DISCOVER</p>
        <h1>发现产品</h1>
        <p class="lead">搜索、筛选并支持你期待的新品，或购买已量产现货。</p>
      </header>

      <div class="toolbar">
        <label class="search">
          <span class="sr-only">搜索</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4 4" stroke-linecap="round" />
          </svg>
          <input v-model="filters.q" type="search" placeholder="搜索产品名称或卖点" />
        </label>

        <div class="groups">
          <div class="group">
            <span>分类</span>
            <div class="chips">
              <button
                v-for="c in CATEGORIES"
                :key="c.id"
                type="button"
                :class="{ active: filters.category === c.id }"
                @click="filters.category = c.id"
              >
                {{ c.label }}
              </button>
            </div>
          </div>
          <div class="group">
            <span>状态</span>
            <div class="chips">
              <button
                v-for="s in statusOptions"
                :key="s.id"
                type="button"
                :class="{ active: filters.status === s.id }"
                @click="filters.status = s.id"
              >
                {{ s.label }}
              </button>
            </div>
          </div>
          <label class="sort">
            <span>排序</span>
            <select v-model="filters.sort">
              <option v-for="s in sortOptions" :key="s.id" :value="s.id">{{ s.label }}</option>
            </select>
          </label>
        </div>
      </div>

      <p class="count mono">{{ filtered.length }} 件产品</p>

      <div class="results" :class="{ 'is-empty': !filtered.length }">
        <TransitionGroup v-if="filtered.length" name="list" tag="div" class="grid">
          <div v-for="p in filtered" :key="p.id" class="grid__item">
            <ProductCard
              :product="p"
              @reserve="(prod) => (reserveTarget.value = prod)"
              @buy="(prod) => (buyTarget.value = prod)"
            />
          </div>
        </TransitionGroup>
        <EmptyState
          v-else
          title="没有符合条件的产品"
          description="试试调整关键词、分类或状态筛选。"
        >
          <BaseButton variant="secondary" @click="resetFilters">重置筛选</BaseButton>
        </EmptyState>
      </div>
    </div>

    <ReservationModal
      :open="!!reserveTarget.value"
      :product="reserveTarget.value"
      @close="reserveTarget.value = null"
    />
    <PurchaseModal
      :open="!!buyTarget.value"
      :product="buyTarget.value"
      @close="buyTarget.value = null"
    />
  </div>
</template>

<style scoped>
.page-wrap {
  padding-block: 48px 96px;
}

.head h1 {
  margin: 10px 0 12px;
  font-size: clamp(32px, 5vw, 48px);
  letter-spacing: -0.03em;
}

.toolbar {
  margin-top: 32px;
  display: grid;
  gap: 18px;
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}

.search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: #fff;
  transition: border-color var(--dur-hover) var(--ease);
}

.search:focus-within {
  border-color: var(--ink);
}

.search input {
  flex: 1;
  border: 0;
  outline: none;
  background: transparent;
}

.groups {
  display: grid;
  gap: 16px;
}

.group,
.sort {
  display: grid;
  gap: 10px;
}

.group > span,
.sort > span {
  font-size: 12px;
  color: var(--muted);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chips button {
  height: 34px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line);
  font-size: 13px;
  background: #fff;
  transition:
    background var(--dur-hover) var(--ease),
    color var(--dur-hover) var(--ease),
    border-color var(--dur-hover) var(--ease);
}

.chips button.active {
  background: var(--ink);
  color: #fff;
  border-color: var(--ink);
}

.sort select {
  height: 42px;
  max-width: 240px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 0 12px;
  background: #fff;
}

.count {
  margin: 22px 0 16px;
  color: var(--muted);
  font-size: 12px;
}

.results {
  min-height: 320px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  position: relative;
}

.grid__item {
  min-width: 0;
}

.list-enter-active,
.list-leave-active {
  transition:
    opacity var(--dur-list) var(--ease),
    transform var(--dur-list) var(--ease);
}

.list-move {
  transition: transform var(--dur-list) var(--ease);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.list-leave-active {
  position: absolute;
  width: calc((100% - 40px) / 3);
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .list-leave-active {
    width: calc((100% - 20px) / 2);
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .list-leave-active {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .list-enter-active,
  .list-leave-active,
  .list-move {
    transition: none;
  }
}
</style>
