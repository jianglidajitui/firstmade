<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductImage from '@/components/ui/ProductImage.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AccordionItem from '@/components/ui/AccordionItem.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ReservationModal from '@/components/reservation/ReservationModal.vue'
import PurchaseModal from '@/components/purchase/PurchaseModal.vue'
import { useStore } from '@/composables/useStore'
import { formatDate, formatMoney, remainingLabel } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const { getProduct, progressOf, daysLeft, hasReserved } = useStore()

const activeImage = ref(0)
const openFaq = ref(0)
const showReserve = ref(false)
const showBuy = ref(false)
const selectedVariant = ref('')
const quantity = ref(1)

const product = computed(() => getProduct(route.params.id))

watch(
  product,
  (p) => {
    activeImage.value = 0
    openFaq.value = 0
    selectedVariant.value = p?.variants?.[0]?.id || ''
    quantity.value = 1
  },
  { immediate: true },
)

const progress = computed(() => (product.value ? progressOf(product.value) : 0))
const days = computed(() => (product.value ? daysLeft(product.value) : 0))
const reserved = computed(() => (product.value ? hasReserved(product.value.id) : false))
const canReserve = computed(
  () => product.value?.status === 'crowdfunding' && !reserved.value,
)
const canBuy = computed(
  () => product.value?.status === 'in_stock' && product.value.stock > 0,
)

function scrollToTimeline() {
  document.getElementById('project-timeline')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div v-if="!product" class="page-wrap container">
    <EmptyState title="未找到该商品" description="链接可能已失效，或商品已被重置。">
      <BaseButton @click="router.push('/discover')">返回发现页</BaseButton>
    </EmptyState>
  </div>

  <div v-else class="detail">
    <div class="container crumb">
      <RouterLink to="/">首页</RouterLink>
      <span>/</span>
      <RouterLink to="/discover">发现</RouterLink>
      <span>/</span>
      <span>{{ product.name }}</span>
    </div>

    <section class="container top">
      <div class="gallery">
        <div class="gallery__main">
          <ProductImage
            :src="product.images?.[activeImage] || product.images?.[0]"
            :alt="product.name"
            :dark="product.id === 'fm-hp-001' || product.id === 'fm-oe-004'"
          />
        </div>
        <div v-if="product.images?.length > 1" class="thumbs">
          <button
            v-for="(img, i) in product.images"
            :key="i"
            type="button"
            :class="{ active: activeImage === i }"
            @click="activeImage = i"
          >
            <ProductImage :src="img" :alt="`${product.name} ${i + 1}`" />
          </button>
        </div>
      </div>

      <aside class="panel">
        <StatusBadge :status="product.status" />
        <h1>{{ product.name }}</h1>
        <p class="tagline">{{ product.tagline }}</p>
        <p class="factory">
          {{ product.factory.name }} · {{ product.factory.region }}
        </p>

        <div v-if="product.status === 'crowdfunding'" class="block">
          <div class="price-row">
            <div>
              <span class="label">意向预定</span>
              <strong class="accent mono">{{ formatMoney(product.reservationFee) }}</strong>
            </div>
            <div class="estimate">
              <span class="label">预计零售价</span>
              <span>{{ formatMoney(product.estimatedPrice) }}</span>
            </div>
          </div>
          <div class="support">
            <span class="mono accent">{{ product.supporters }}</span>
            <span>/ {{ product.targetSupporters }} 人</span>
            <span class="muted">{{ remainingLabel(days) }}</span>
          </div>
          <ProgressBar :value="progress" />
          <p class="hint">预计生产周期 {{ product.productionDays }} 天（演示数据）</p>
          <BaseButton
            class="desktop-action"
            size="lg"
            block
            :disabled="!canReserve"
            @click="showReserve = true"
          >
            {{ reserved ? '已预定' : '1 元预定' }}
          </BaseButton>
        </div>

        <div v-else-if="product.status === 'funded'" class="block">
          <p class="state-title">已达标，等待启动生产</p>
          <p class="muted">已支持 {{ product.supporters }} / {{ product.targetSupporters }} 人</p>
          <BaseButton class="desktop-action" size="lg" block variant="secondary" @click="scrollToTimeline">
            查看项目进度
          </BaseButton>
        </div>

        <div v-else-if="product.status === 'producing'" class="block">
          <p class="state-title">生产进行中</p>
          <p class="muted">工厂正在组装与质检，预定入口已关闭。</p>
          <BaseButton class="desktop-action" size="lg" block variant="secondary" @click="scrollToTimeline">
            查看生产时间线
          </BaseButton>
        </div>

        <div v-else-if="product.status === 'in_stock'" class="block">
          <div class="price-row">
            <div>
              <span class="label">售价</span>
              <strong class="mono">{{ formatMoney(product.salePrice) }}</strong>
            </div>
            <div>
              <span class="label">库存</span>
              <span>{{ product.stock > 0 ? `有货 ${product.stock}` : '暂时缺货' }}</span>
            </div>
          </div>
          <label class="field">
            <span>规格</span>
            <select v-model="selectedVariant">
              <option v-for="v in product.variants" :key="v.id" :value="v.id">{{ v.label }}</option>
            </select>
          </label>
          <label class="field">
            <span>数量</span>
            <input v-model.number="quantity" type="number" min="1" :max="product.stock" />
          </label>
          <BaseButton
            class="desktop-action"
            size="lg"
            block
            :disabled="!canBuy"
            @click="showBuy = true"
          >
            立即购买
          </BaseButton>
        </div>

        <div v-else class="block">
          <p class="state-title">众筹已结束</p>
          <p class="muted">未达目标人数，已停止预定。</p>
        </div>
      </aside>
    </section>

    <section class="container features">
      <article v-for="(f, i) in product.features" :key="i" class="feature" :class="{ reverse: i % 2 === 1 }">
        <div class="feature__media">
          <ProductImage :src="f.image || product.images[0]" :alt="f.title" />
        </div>
        <div class="feature__copy">
          <p class="eyebrow">0{{ i + 1 }}</p>
          <h2>{{ f.title }}</h2>
          <p>{{ f.text }}</p>
        </div>
      </article>
    </section>

    <section class="container split">
      <div>
        <h2>规格参数</h2>
        <dl class="specs">
          <div v-for="s in product.specs" :key="s.label">
            <dt>{{ s.label }}</dt>
            <dd>{{ s.value }}</dd>
          </div>
        </dl>
      </div>
      <div>
        <h2>工厂介绍</h2>
        <div class="factory-card">
          <h3>{{ product.factory.name }}</h3>
          <p class="muted">{{ product.factory.region }}</p>
          <p>{{ product.factory.about }}</p>
        </div>
      </div>
    </section>

    <section id="project-timeline" class="container timeline-wrap">
      <h2>项目进度</h2>
      <ol class="timeline">
        <li v-for="t in product.timeline" :key="t.id" :class="{ done: t.done }">
          <div class="dot" />
          <div>
            <h3>{{ t.title }}</h3>
            <p>{{ t.desc }}</p>
            <span v-if="t.at" class="mono">{{ formatDate(t.at) }}</span>
          </div>
        </li>
      </ol>
    </section>

    <section class="container faq">
      <h2>常见问题</h2>
      <AccordionItem
        v-for="(item, i) in product.faqs"
        :key="i"
        :title="item.q"
        :open="openFaq === i"
        @toggle="openFaq = openFaq === i ? -1 : i"
      >
        {{ item.a }}
      </AccordionItem>
    </section>

    <div class="mobile-bar">
      <template v-if="product.status === 'crowdfunding'">
        <div>
          <strong class="accent">¥1</strong>
          <span>意向预定</span>
        </div>
        <BaseButton :disabled="!canReserve" @click="showReserve = true">
          {{ reserved ? '已预定' : '1 元预定' }}
        </BaseButton>
      </template>
      <template v-else-if="product.status === 'in_stock'">
        <div>
          <strong>{{ formatMoney(product.salePrice) }}</strong>
          <span>现货</span>
        </div>
        <BaseButton :disabled="!canBuy" @click="showBuy = true">立即购买</BaseButton>
      </template>
      <template v-else>
        <div>
          <strong>{{ product.status === 'ended' ? '已结束' : '进行中' }}</strong>
          <span>查看进度</span>
        </div>
        <BaseButton variant="secondary" @click="scrollToTimeline">项目进度</BaseButton>
      </template>
    </div>

    <ReservationModal
      :open="showReserve"
      :product="product"
      @close="showReserve = false"
    />
    <PurchaseModal
      :open="showBuy"
      :product="product"
      @close="showBuy = false"
    />
  </div>
</template>

<style scoped>
.page-wrap {
  padding: 64px 0;
}

.crumb {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 28px;
  font-size: 13px;
  color: var(--muted);
}

.crumb a:hover {
  color: var(--ink);
}

.top {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 40px;
  padding-top: 24px;
  padding-bottom: 80px;
  align-items: start;
}

.gallery__main {
  aspect-ratio: 1 / 1;
  border-radius: var(--radius);
  overflow: hidden;
  background: #ecece7;
  border: 1px solid var(--line);
}

.thumbs {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.thumbs button {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--line);
  opacity: 0.7;
}

.thumbs button.active {
  opacity: 1;
  border-color: var(--ink);
}

.panel {
  position: sticky;
  top: calc(var(--header-h) + 20px);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 28px 24px;
}

.panel h1 {
  margin: 14px 0 10px;
  font-size: clamp(26px, 3vw, 34px);
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.tagline {
  color: var(--muted);
  font-size: 15px;
  line-height: 1.6;
}

.factory {
  margin-top: 12px;
  font-size: 13px;
  color: var(--muted);
}

.block {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
  display: grid;
  gap: 14px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.label {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 4px;
}

.price-row strong {
  font-size: 28px;
}

.accent {
  color: var(--accent);
}

.estimate span:last-child {
  font-size: 16px;
}

.support {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 14px;
}

.support .accent {
  font-size: 22px;
}

.support .muted,
.muted,
.hint {
  color: var(--muted);
  font-size: 13px;
}

.state-title {
  font-size: 18px;
  font-weight: 600;
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
}

.features {
  display: grid;
  gap: 72px;
  padding-bottom: 80px;
}

.feature {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  align-items: center;
}

.feature.reverse {
  grid-template-columns: 0.9fr 1.1fr;
}

.feature.reverse .feature__media {
  order: 2;
}

.feature__media {
  aspect-ratio: 4 / 3;
  border-radius: var(--radius);
  overflow: hidden;
  background: #ecece7;
  border: 1px solid var(--line);
}

.feature__copy h2 {
  margin: 10px 0 12px;
  font-size: clamp(24px, 3vw, 36px);
  letter-spacing: -0.03em;
}

.feature__copy p:last-child {
  color: var(--muted);
  font-size: 15px;
  line-height: 1.7;
  max-width: 34em;
}

.split,
.timeline-wrap,
.faq {
  padding-bottom: 80px;
}

.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.split h2,
.timeline-wrap h2,
.faq h2 {
  font-size: 28px;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}

.specs {
  border-top: 1px solid var(--line);
}

.specs > div {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
  font-size: 14px;
}

.specs dt {
  color: var(--muted);
}

.factory-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 24px;
}

.factory-card h3 {
  font-size: 18px;
  margin-bottom: 4px;
}

.factory-card p:last-child {
  margin-top: 12px;
  color: var(--muted);
  line-height: 1.7;
  font-size: 14px;
}

.timeline {
  display: grid;
  gap: 0;
}

.timeline li {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 16px;
  padding-bottom: 24px;
  position: relative;
}

.timeline li:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 18px;
  bottom: 0;
  width: 1px;
  background: var(--line);
}

.dot {
  width: 12px;
  height: 12px;
  margin-top: 4px;
  border-radius: 50%;
  border: 1.5px solid var(--line);
  background: #fff;
  position: relative;
  z-index: 1;
}

.timeline li.done .dot {
  background: var(--accent);
  border-color: var(--accent);
}

.timeline h3 {
  font-size: 16px;
  margin-bottom: 4px;
}

.timeline p {
  color: var(--muted);
  font-size: 14px;
  margin-bottom: 6px;
}

.timeline .mono {
  font-size: 12px;
  color: var(--muted);
}

.faq {
  padding-bottom: 120px;
}

.mobile-bar {
  display: none;
}

@media (max-width: 960px) {
  .top,
  .feature,
  .feature.reverse,
  .split {
    grid-template-columns: 1fr;
  }

  .feature.reverse .feature__media {
    order: 0;
  }

  .panel {
    position: static;
  }

  .desktop-action {
    display: none;
  }

  .mobile-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
    background: rgba(255, 255, 255, 0.96);
    border-top: 1px solid var(--line);
    backdrop-filter: blur(8px);
  }

  .mobile-bar strong {
    display: block;
    font-size: 18px;
  }

  .mobile-bar span {
    font-size: 12px;
    color: var(--muted);
  }

  .faq {
    padding-bottom: 140px;
  }
}
</style>
