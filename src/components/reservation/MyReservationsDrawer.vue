<script setup>
import { useRouter } from 'vue-router'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ProductImage from '@/components/ui/ProductImage.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useStore } from '@/composables/useStore'
import { useUI } from '@/composables/useUI'
import { formatDate } from '@/utils/format'

const { reservations } = useStore()
const { ui, closeReservations } = useUI()
const router = useRouter()

function openProduct(item) {
  closeReservations()
  router.push(`/product/${item.productId}`)
}
</script>

<template>
  <BaseDrawer :open="ui.reservationsOpen" title="我的预定" @close="closeReservations">
    <EmptyState
      v-if="!reservations.length"
      title="还没有预定"
      description="去发现页支持一款新品，1 元表达你的意向。"
    />
    <ul v-else class="list">
      <li v-for="item in reservations" :key="item.id">
        <button class="item" type="button" @click="openProduct(item)">
          <div class="thumb">
            <ProductImage :src="item.image || item.product?.images?.[0]" :alt="item.productName" />
          </div>
          <div class="info">
            <div class="top">
              <strong>{{ item.productName }}</strong>
              <StatusBadge :status="item.currentStatus" />
            </div>
            <p>预定时间 {{ formatDate(item.createdAt) }}</p>
            <p class="mono">意向金额 ¥{{ item.amount }}</p>
          </div>
        </button>
      </li>
    </ul>
  </BaseDrawer>
</template>

<style scoped>
.list {
  display: grid;
  gap: 12px;
}

.item {
  width: 100%;
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  text-align: left;
  transition: border-color var(--dur) var(--ease);
}

.item:hover {
  border-color: #c8c8c0;
}

.thumb {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: #ecece7;
}

.top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.top strong {
  font-size: 14px;
  line-height: 1.4;
}

.info p {
  color: var(--muted);
  font-size: 12px;
}
</style>
