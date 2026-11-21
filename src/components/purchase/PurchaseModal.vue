<script setup>
import { computed, reactive, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProductImage from '@/components/ui/ProductImage.vue'
import { useStore } from '@/composables/useStore'
import { useToast } from '@/composables/useToast'
import { formatMoney } from '@/utils/format'

const props = defineProps({
  open: Boolean,
  product: Object,
})

const emit = defineEmits(['close', 'success'])
const { purchaseProduct } = useStore()
const toast = useToast()

const form = reactive({
  variantId: '',
  quantity: 1,
})
const submitting = reactive({ value: false })
const errors = reactive({ quantity: '' })

watch(
  () => [props.open, props.product],
  () => {
    if (props.product) {
      form.variantId = props.product.variants?.[0]?.id || ''
      form.quantity = 1
      errors.quantity = ''
      submitting.value = false
    }
  },
  { immediate: true },
)

const total = computed(() => {
  if (!props.product) return 0
  return (props.product.salePrice || 0) * (Number(form.quantity) || 0)
})

function validate() {
  const qty = Number(form.quantity)
  if (!Number.isInteger(qty) || qty < 1) {
    errors.quantity = '请输入不小于 1 的整数'
    return false
  }
  if (qty > props.product.stock) {
    errors.quantity = `不能超过库存 ${props.product.stock}`
    return false
  }
  errors.quantity = ''
  return true
}

function confirm() {
  if (!props.product || submitting.value) return
  if (!validate()) return
  submitting.value = true
  const result = purchaseProduct({
    productId: props.product.id,
    variantId: form.variantId,
    quantity: Number(form.quantity),
  })
  if (!result.ok) {
    toast.error(result.message)
    submitting.value = false
    return
  }
  emit('success', result.order)
  emit('close')
  submitting.value = false
}
</script>

<template>
  <BaseModal :open="open" title="模拟购买现货" width="520px" @close="$emit('close')">
    <div v-if="product" class="content">
      <div class="row">
        <div class="thumb">
          <ProductImage :src="product.images?.[0]" :alt="product.name" />
        </div>
        <div>
          <h4>{{ product.name }}</h4>
          <p>单价 {{ formatMoney(product.salePrice) }} · 库存 {{ product.stock }}</p>
        </div>
      </div>

      <label class="field">
        <span>规格</span>
        <select v-model="form.variantId">
          <option v-for="v in product.variants" :key="v.id" :value="v.id" :disabled="v.available === false">
            {{ v.label }}
          </option>
        </select>
      </label>

      <label class="field">
        <span>数量</span>
        <input
          v-model.number="form.quantity"
          type="number"
          min="1"
          :max="product.stock"
          step="1"
          @blur="validate"
        />
        <em v-if="errors.quantity">{{ errors.quantity }}</em>
      </label>

      <div class="total">
        <span>合计</span>
        <strong class="mono">{{ formatMoney(total) }}</strong>
      </div>
      <p class="note">演示购买不会要求地址或支付信息，订单仅保存在本地浏览器。</p>
    </div>
    <template #footer>
      <BaseButton variant="secondary" @click="$emit('close')">取消</BaseButton>
      <BaseButton :disabled="submitting.value || !product?.stock" @click="confirm">
        确认模拟购买
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

.field {
  display: grid;
  gap: 8px;
  font-size: 13px;
}

.field span {
  color: var(--muted);
}

.field input,
.field select {
  height: 42px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 0 12px;
  background: #fff;
}

.field em {
  color: var(--accent);
  font-style: normal;
  font-size: 12px;
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 4px;
}

.total strong {
  font-size: 24px;
}

.note {
  font-size: 12px;
}
</style>
