<script setup>
import { computed } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProductImage from '@/components/ui/ProductImage.vue'
import { useStore } from '@/composables/useStore'
import { formatMoney } from '@/utils/format'

const props = defineProps({
  open: Boolean,
  product: Object,
})

const emit = defineEmits(['close', 'success'])
const { reserveProduct, hasReserved } = useStore()

const already = computed(() => (props.product ? hasReserved(props.product.id) : false))

function confirm() {
  if (!props.product) return
  const result = reserveProduct(props.product.id)
  if (result.ok) {
    emit('success', result)
    emit('close')
  }
}
</script>

<template>
  <BaseModal :open="open" title="模拟意向预定" @close="$emit('close')">
    <div v-if="product" class="content">
      <div class="row">
        <div class="thumb">
          <ProductImage :src="product.images?.[0]" :alt="product.name" />
        </div>
        <div>
          <h4>{{ product.name }}</h4>
          <p>{{ product.tagline }}</p>
        </div>
      </div>
      <div class="box">
        <div class="line">
          <span>意向预定金额</span>
          <strong class="mono">{{ formatMoney(product.reservationFee) }}</strong>
        </div>
        <p class="note">1 元为意向预定金额，非商品全款。本操作为本地演示，不接入真实支付。</p>
      </div>
    </div>
    <template #footer>
      <BaseButton variant="secondary" @click="$emit('close')">取消</BaseButton>
      <BaseButton :disabled="already" @click="confirm">
        {{ already ? '已预定' : '确认模拟预定' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.content {
  display: grid;
  gap: 16px;
}

.row {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 14px;
  align-items: center;
}

.thumb {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--line);
}

h4 {
  font-size: 15px;
  margin-bottom: 4px;
}

p {
  color: var(--muted);
  font-size: 13px;
}

.box {
  background: var(--bg);
  border-radius: var(--radius);
  padding: 14px;
}

.line {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.line strong {
  font-size: 22px;
  color: var(--accent);
}

.note {
  font-size: 12px;
  line-height: 1.6;
}
</style>
