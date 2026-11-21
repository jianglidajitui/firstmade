<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import ProductImage from '@/components/ui/ProductImage.vue'
import { CATEGORIES, PRESET_IMAGES } from '@/data/products'
import { useStore } from '@/composables/useStore'
import { useToast } from '@/composables/useToast'
import { formatMoney } from '@/utils/format'

const router = useRouter()
const {
  products,
  progressOf,
  startProduction,
  completeProduction,
  publishProduct,
  addDemoSupporters,
  resetDemo,
} = useStore()
const toast = useToast()

const showPublish = ref(false)
const completeTarget = ref(null)
const resetOpen = ref(false)
const demoCount = reactive({})

const form = reactive({
  name: '',
  category: 'audio',
  tagline: '',
  description: '',
  estimatedPrice: 299,
  targetSupporters: 500,
  durationDays: 30,
  productionDays: 40,
  factoryName: '',
  factoryRegion: '',
  imageId: PRESET_IMAGES[0].id,
})

const errors = reactive({})

const categoryOptions = CATEGORIES.filter((c) => c.id !== 'all')
const stockForm = reactive({ salePrice: 199, stock: 100 })

const listed = computed(() =>
  [...products.value].sort((a, b) => b.createdAt - a.createdAt),
)

function validate() {
  const next = {}
  if (!form.name.trim()) next.name = '请填写产品名称'
  if (!form.tagline.trim()) next.tagline = '请填写一句话卖点'
  if (!form.description.trim()) next.description = '请填写详细介绍'
  if (!(Number(form.estimatedPrice) > 0)) next.estimatedPrice = '请填写有效预计售价'
  if (![500, 1000].includes(Number(form.targetSupporters))) {
    next.targetSupporters = '目标人数仅支持 500 或 1000'
  }
  if (!(Number(form.durationDays) >= 7)) next.durationDays = '众筹天数至少 7 天'
  if (!(Number(form.productionDays) >= 1)) next.productionDays = '请填写生产周期'
  if (!form.factoryName.trim()) next.factoryName = '请填写工厂名称'
  if (!form.factoryRegion.trim()) next.factoryRegion = '请填写地区'
  if (!form.imageId) next.imageId = '请选择产品图片'
  Object.keys(errors).forEach((k) => delete errors[k])
  Object.assign(errors, next)
  return Object.keys(next).length === 0
}

function submitPublish() {
  if (!validate()) {
    toast.error('请检查表单必填项')
    return
  }
  const image = PRESET_IMAGES.find((i) => i.id === form.imageId)?.src
  const result = publishProduct({ ...form, image, imageId: form.imageId })
  if (result.ok) {
    showPublish.value = false
    router.push(`/product/${result.product.id}`)
  }
}

function onStart(id) {
  startProduction(id)
}

function openComplete(product) {
  completeTarget.value = product
  stockForm.salePrice = product.estimatedPrice || 199
  stockForm.stock = 100
}

function confirmComplete() {
  if (!completeTarget.value) return
  const result = completeProduction(completeTarget.value.id, {
    salePrice: stockForm.salePrice,
    stock: stockForm.stock,
  })
  if (result.ok) completeTarget.value = null
  else toast.error(result.message)
}

function addSupporters(product) {
  const n = Number(demoCount[product.id] || 1)
  addDemoSupporters(product.id, n)
}

function confirmReset() {
  resetDemo()
  resetOpen.value = false
}
</script>

<template>
  <div class="studio page-wrap">
    <div class="container">
      <header class="head">
        <div>
          <p class="eyebrow">FACTORY STUDIO</p>
          <h1>工厂工作台</h1>
          <p class="lead">发布新品、观察支持人数，并用演示操作推进生产状态。</p>
        </div>
        <BaseButton size="lg" @click="showPublish = true">发布新品</BaseButton>
      </header>

      <section class="list">
        <h2>已发布项目</h2>
        <article v-for="p in listed" :key="p.id" class="item">
          <div class="thumb" @click="router.push(`/product/${p.id}`)">
            <ProductImage :src="p.images?.[0]" :alt="p.name" />
          </div>
          <div class="info">
            <div class="info__top">
              <h3 @click="router.push(`/product/${p.id}`)">{{ p.name }}</h3>
              <StatusBadge :status="p.status" />
            </div>
            <p>{{ p.tagline }}</p>
            <div class="stats">
              <span class="mono">{{ p.supporters }} / {{ p.targetSupporters }}</span>
              <span class="muted">预计 {{ formatMoney(p.estimatedPrice) }}</span>
              <span v-if="p.status === 'in_stock'" class="muted">
                售价 {{ formatMoney(p.salePrice) }} · 库存 {{ p.stock }}
              </span>
            </div>
            <ProgressBar
              v-if="p.status === 'crowdfunding' || p.status === 'funded'"
              :value="progressOf(p)"
            />
            <div class="actions">
              <BaseButton size="sm" variant="secondary" @click="router.push(`/product/${p.id}`)">
                查看详情
              </BaseButton>
              <BaseButton
                v-if="p.status === 'funded'"
                size="sm"
                @click="onStart(p.id)"
              >
                模拟开始生产
              </BaseButton>
              <BaseButton
                v-if="p.status === 'producing'"
                size="sm"
                @click="openComplete(p)"
              >
                模拟完成并上架
              </BaseButton>
            </div>
          </div>
        </article>
      </section>

      <section class="demo">
        <h2>演示控制</h2>
        <p class="muted">与消费者操作分开，仅用于本地演示推进数据。</p>
        <div class="demo__grid">
          <div v-for="p in listed.filter((x) => x.status === 'crowdfunding')" :key="p.id" class="demo__card">
            <strong>{{ p.name }}</strong>
            <p class="mono">{{ p.supporters }} / {{ p.targetSupporters }}</p>
            <div class="demo__row">
              <input
                v-model.number="demoCount[p.id]"
                type="number"
                min="1"
                :placeholder="'1'"
              />
              <BaseButton size="sm" variant="secondary" @click="addSupporters(p)">
                模拟新增支持者
              </BaseButton>
            </div>
          </div>
        </div>
        <BaseButton variant="secondary" @click="resetOpen = true">重置演示数据</BaseButton>
      </section>
    </div>

    <BaseModal :open="showPublish" title="发布新品" width="640px" @close="showPublish = false">
      <form class="form" @submit.prevent="submitPublish">
        <label>
          <span>产品名称</span>
          <input v-model="form.name" type="text" placeholder="例如：磁吸充电宝 P-10" />
          <em v-if="errors.name">{{ errors.name }}</em>
        </label>
        <label>
          <span>产品分类</span>
          <select v-model="form.category">
            <option v-for="c in categoryOptions" :key="c.id" :value="c.id">{{ c.label }}</option>
          </select>
        </label>
        <label>
          <span>一句话卖点</span>
          <input v-model="form.tagline" type="text" maxlength="60" />
          <em v-if="errors.tagline">{{ errors.tagline }}</em>
        </label>
        <label>
          <span>详细介绍</span>
          <textarea v-model="form.description" rows="4" />
          <em v-if="errors.description">{{ errors.description }}</em>
        </label>
        <div class="two">
          <label>
            <span>预计售价（元）</span>
            <input v-model.number="form.estimatedPrice" type="number" min="1" />
            <em v-if="errors.estimatedPrice">{{ errors.estimatedPrice }}</em>
          </label>
          <label>
            <span>目标人数</span>
            <select v-model.number="form.targetSupporters">
              <option :value="500">500</option>
              <option :value="1000">1000</option>
            </select>
            <em v-if="errors.targetSupporters">{{ errors.targetSupporters }}</em>
          </label>
        </div>
        <div class="two">
          <label>
            <span>众筹持续天数</span>
            <input v-model.number="form.durationDays" type="number" min="7" />
            <em v-if="errors.durationDays">{{ errors.durationDays }}</em>
          </label>
          <label>
            <span>预计生产周期（天）</span>
            <input v-model.number="form.productionDays" type="number" min="1" />
            <em v-if="errors.productionDays">{{ errors.productionDays }}</em>
          </label>
        </div>
        <div class="two">
          <label>
            <span>工厂名称</span>
            <input v-model="form.factoryName" type="text" />
            <em v-if="errors.factoryName">{{ errors.factoryName }}</em>
          </label>
          <label>
            <span>工厂地区</span>
            <input v-model="form.factoryRegion" type="text" placeholder="例如：广东深圳" />
            <em v-if="errors.factoryRegion">{{ errors.factoryRegion }}</em>
          </label>
        </div>
        <div>
          <span class="label">产品图片</span>
          <div class="presets">
            <button
              v-for="img in PRESET_IMAGES"
              :key="img.id"
              type="button"
              :class="{ active: form.imageId === img.id }"
              @click="form.imageId = img.id"
            >
              <ProductImage :src="img.src" :alt="img.label" />
              <span>{{ img.label }}</span>
            </button>
          </div>
          <em v-if="errors.imageId">{{ errors.imageId }}</em>
        </div>
      </form>
      <template #footer>
        <BaseButton variant="secondary" @click="showPublish = false">取消</BaseButton>
        <BaseButton @click="submitPublish">发布到本地演示</BaseButton>
      </template>
    </BaseModal>

    <BaseModal
      :open="!!completeTarget"
      title="模拟完成并上架"
      @close="completeTarget = null"
    >
      <div class="form">
        <label>
          <span>演示售价（元）</span>
          <input v-model.number="stockForm.salePrice" type="number" min="1" />
        </label>
        <label>
          <span>库存数量</span>
          <input v-model.number="stockForm.stock" type="number" min="1" step="1" />
        </label>
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="completeTarget = null">取消</BaseButton>
        <BaseButton @click="confirmComplete">确认上架</BaseButton>
      </template>
    </BaseModal>

    <BaseModal :open="resetOpen" title="重置演示数据" @close="resetOpen = false">
      <p class="reset-text">
        将清空本地预定、订单，并恢复示例商品初始状态。此操作不可撤销。
      </p>
      <template #footer>
        <BaseButton variant="secondary" @click="resetOpen = false">取消</BaseButton>
        <BaseButton variant="accent" @click="confirmReset">确认重置</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.page-wrap {
  padding: 48px 0 96px;
}

.head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 40px;
}

.head h1 {
  margin: 10px 0 12px;
  font-size: clamp(32px, 5vw, 48px);
  letter-spacing: -0.03em;
}

.list h2,
.demo h2 {
  font-size: 22px;
  margin-bottom: 16px;
}

.item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 18px;
  padding: 18px;
  margin-bottom: 14px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}

.thumb {
  width: 120px;
  height: 120px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  background: #ecece7;
}

.info__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.info h3 {
  font-size: 18px;
  cursor: pointer;
}

.info > p {
  color: var(--muted);
  font-size: 13px;
  margin: 8px 0 12px;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  margin-bottom: 10px;
}

.muted {
  color: var(--muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.demo {
  margin-top: 56px;
  padding: 28px;
  border: 1px dashed var(--line);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.5);
}

.demo > .muted {
  margin-bottom: 20px;
  font-size: 14px;
}

.demo__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.demo__card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 14px;
}

.demo__card strong {
  display: block;
  font-size: 14px;
  margin-bottom: 6px;
}

.demo__row {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.demo__row input,
.form input,
.form select,
.form textarea {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  background: #fff;
}

.demo__row input {
  width: 72px;
}

.form {
  display: grid;
  gap: 14px;
}

.form label,
.form .label {
  display: grid;
  gap: 8px;
  font-size: 13px;
}

.form label > span,
.form .label {
  color: var(--muted);
}

.form em {
  color: var(--accent);
  font-style: normal;
  font-size: 12px;
}

.two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.presets {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.presets button {
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  overflow: hidden;
  text-align: left;
  background: #fff;
}

.presets button.active {
  border-color: var(--ink);
}

.presets :deep(.media) {
  aspect-ratio: 1;
}

.presets span {
  display: block;
  padding: 6px 8px 8px;
  font-size: 11px;
  color: var(--muted);
}

.reset-text {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.7;
}

@media (max-width: 800px) {
  .head {
    flex-direction: column;
    align-items: start;
  }

  .item,
  .demo__grid,
  .two,
  .presets {
    grid-template-columns: 1fr;
  }

  .thumb {
    width: 100%;
    height: 180px;
  }
}
</style>
