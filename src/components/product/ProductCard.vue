<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import ProductImage from '@/components/ui/ProductImage.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useStore } from '@/composables/useStore'
import { formatMoney, remainingLabel } from '@/utils/format'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  compact: Boolean,
})

const emit = defineEmits(['reserve', 'buy'])
const router = useRouter()
const { progressOf, daysLeft, hasReserved } = useStore()

const progress = computed(() => progressOf(props.product))
const days = computed(() => daysLeft(props.product))
const reserved = computed(() => hasReserved(props.product.id))
const isCrowd = computed(() => props.product.status === 'crowdfunding')
const isStock = computed(() => props.product.status === 'in_stock')

function goDetail() {
  router.push(`/product/${props.product.id}`)
}

function onAction(e) {
  e.stopPropagation()
  if (isCrowd.value && !reserved.value) {
    emit('reserve', props.product)
    return
  }
  if (isStock.value) {
    emit('buy', props.product)
    return
  }
  goDetail()
}
</script>

<template>
  <article class="card" @click="goDetail">
    <div class="card__media" :class="{ 'is-dark': product.images?.[0]?.includes('open-ear') || product.id === 'fm-oe-004' || product.id === 'fm-hp-001' }">
      <ProductImage
        :src="product.images?.[0]"
        :alt="product.name"
        :dark="product.id === 'fm-oe-004' || product.id === 'fm-hp-001'"
      />
      <div class="card__badge">
        <StatusBadge :status="product.status" />
      </div>
    </div>
    <div class="card__body">
      <div class="card__meta eyebrow">{{ product.factory?.name }} · {{ product.factory?.region }}</div>
      <h3>{{ product.name }}</h3>
      <p class="card__tagline">{{ product.tagline }}</p>

      <template v-if="isCrowd">
        <div class="card__stats">
          <span class="mono accent">{{ product.supporters }}</span>
          <span class="muted">/ {{ product.targetSupporters }} 人支持</span>
          <span class="spacer" />
          <span class="muted">{{ remainingLabel(days) }}</span>
        </div>
        <ProgressBar :value="progress" />
        <div class="card__foot">
          <span class="muted estimate">预计售价 {{ formatMoney(product.estimatedPrice) }}</span>
          <BaseButton size="sm" :disabled="reserved" @click="onAction">
            {{ reserved ? '已预定' : '¥1 预定' }}
          </BaseButton>
        </div>
      </template>

      <template v-else-if="isStock">
        <div class="card__stats stock">
          <span class="price">{{ formatMoney(product.salePrice) }}</span>
          <span class="muted">库存 {{ product.stock }}</span>
        </div>
        <div class="card__foot">
          <span class="muted">现货发售</span>
          <BaseButton size="sm" @click="onAction">立即购买</BaseButton>
        </div>
      </template>

      <template v-else>
        <div class="card__stats">
          <span class="mono">{{ product.supporters }}</span>
          <span class="muted">/ {{ product.targetSupporters }} 人已支持</span>
        </div>
        <div class="card__foot">
          <span class="muted">查看项目进度</span>
          <BaseButton size="sm" variant="secondary" @click.stop="goDetail">查看详情</BaseButton>
        </div>
      </template>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition:
    border-color var(--dur) var(--ease),
    box-shadow var(--dur) var(--ease);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card:hover {
  border-color: #c8c8c0;
  box-shadow: var(--shadow);
}

.card:hover .card__media :deep(img) {
  transform: scale(1.03);
}

.card__media {
  position: relative;
  aspect-ratio: 1 / 1;
  background: #ecece7;
}

.card__media.is-dark {
  background: #111;
}

.card__media :deep(img) {
  transition: transform 280ms var(--ease);
}

.card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
}

.card__body {
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.card__meta {
  font-size: 11px;
}

.card__body h3 {
  font-size: 17px;
  line-height: 1.35;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.card__tagline {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.9em;
}

.card__stats {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 4px;
  font-size: 13px;
}

.card__stats.stock {
  justify-content: space-between;
  align-items: center;
}

.accent {
  color: var(--accent);
  font-size: 18px;
}

.price {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.muted {
  color: var(--muted);
}

.spacer {
  flex: 1;
}

.estimate {
  font-size: 12px;
}

.card__foot {
  margin-top: auto;
  padding-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
</style>
