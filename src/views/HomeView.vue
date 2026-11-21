<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductImage from '@/components/ui/ProductImage.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ReservationModal from '@/components/reservation/ReservationModal.vue'
import PurchaseModal from '@/components/purchase/PurchaseModal.vue'
import { useStore } from '@/composables/useStore'
import { useReveal } from '@/composables/useReveal'
import { formatMoney, remainingLabel } from '@/utils/format'

const router = useRouter()
const {
  crowdfundingProducts,
  inStockProducts,
  heroProduct,
  storyProduct,
  progressOf,
  daysLeft,
  hasReserved,
} = useStore()

const reserveTarget = ref(null)
const buyTarget = ref(null)
const revealCrowdfund = useReveal()
const revealStory = useReveal()
const revealStock = useReveal()
const revealHow = useReveal()
const revealFactory = useReveal()

const liveProducts = computed(() => crowdfundingProducts.value.slice(0, 4))
const stockProducts = computed(() => inStockProducts.value.slice(0, 3))
const hero = computed(() => heroProduct.value)
const story = computed(() => storyProduct.value)
const heroProgress = computed(() => (hero.value ? progressOf(hero.value) : 0))
const heroDays = computed(() => (hero.value ? daysLeft(hero.value) : 0))
const heroReserved = computed(() => (hero.value ? hasReserved(hero.value.id) : false))

function openReserve(product) {
  reserveTarget.value = product
}

function openBuy(product) {
  buyTarget.value = product
}
</script>

<template>
  <div class="home">
    <section class="hero container">
      <div class="hero__copy">
        <p class="eyebrow">001 / NEW RELEASE</p>
        <h1 class="display">好产品，值得被制造。</h1>
        <p class="lead">
          用 1 元支持你期待的新品。达到目标人数后，工厂启动生产。
        </p>
        <div class="hero__actions">
          <BaseButton size="lg" @click="router.push('/discover')">发现新品</BaseButton>
          <BaseButton size="lg" variant="secondary" @click="router.push('/studio')">
            我是工厂，发布新品
          </BaseButton>
        </div>
        <p class="hero__slogan">让好产品，从你的支持开始。</p>
      </div>

      <article v-if="hero" class="hero__product" @click="router.push(`/product/${hero.id}`)">
        <div class="hero__visual">
          <ProductImage :src="hero.images?.[0]" :alt="hero.name" dark />
        </div>
        <div class="hero__info">
          <p class="eyebrow">FEATURED · HP-01</p>
          <h2>{{ hero.name }}</h2>
          <p>{{ hero.tagline }}</p>
          <div class="hero__support">
            <span class="mono accent">{{ hero.supporters }}</span>
            <span>/ {{ hero.targetSupporters }} 人支持</span>
            <span class="days">{{ remainingLabel(heroDays) }}</span>
          </div>
          <ProgressBar :value="heroProgress" />
          <div class="hero__cta" @click.stop>
            <BaseButton
              size="sm"
              :disabled="heroReserved || hero.status !== 'crowdfunding'"
              @click="openReserve(hero)"
            >
              {{ heroReserved ? '已预定' : '¥1 参与预定' }}
            </BaseButton>
            <button class="link" type="button" @click="router.push(`/product/${hero.id}`)">
              查看详情
            </button>
          </div>
        </div>
      </article>
    </section>

    <section ref="revealCrowdfund" class="section container reveal">
      <div class="section__head">
        <div>
          <p class="eyebrow">LIVE CROWDFUNDING</p>
          <h2>正在发生的新品</h2>
        </div>
        <BaseButton variant="ghost" @click="router.push('/discover?status=crowdfunding')">
          查看全部
        </BaseButton>
      </div>
      <div class="grid">
        <ProductCard
          v-for="p in liveProducts"
          :key="p.id"
          :product="p"
          @reserve="openReserve"
          @buy="openBuy"
        />
      </div>
    </section>

    <section v-if="story" ref="revealStory" class="story reveal">
      <div class="container story__inner">
        <div class="story__media">
          <ProductImage :src="story.images?.[0]" :alt="story.name" dark />
        </div>
        <div class="story__copy">
          <p class="eyebrow">DESIGNED TO BEGIN</p>
          <h2>开放结构，听见路况与节奏。</h2>
          <ul>
            <li v-for="(f, i) in story.features.slice(0, 3)" :key="i">
              <strong>{{ f.title }}</strong>
              <span>{{ f.text }}</span>
            </li>
          </ul>
          <BaseButton variant="light" @click="router.push(`/product/${story.id}`)">
            查看产品
          </BaseButton>
        </div>
      </div>
    </section>

    <section ref="revealStock" class="section container reveal">
      <div class="section__head">
        <div>
          <p class="eyebrow">IN STOCK</p>
          <h2>已成为现货</h2>
        </div>
        <BaseButton variant="ghost" @click="router.push('/discover?status=in_stock')">
          全部现货
        </BaseButton>
      </div>
      <div class="grid stock-grid">
        <ProductCard
          v-for="p in stockProducts"
          :key="p.id"
          :product="p"
          @reserve="openReserve"
          @buy="openBuy"
        />
      </div>
    </section>

    <section id="how-it-works" ref="revealHow" class="section container reveal how">
      <div class="section__head">
        <div>
          <p class="eyebrow">HOW IT WORKS</p>
          <h2>如何参与</h2>
          <p class="lead">1 元是意向预定金额，不是商品全款。</p>
        </div>
      </div>
      <ol class="steps">
        <li>
          <span class="mono">01</span>
          <h3>发现新品</h3>
          <p>浏览工厂尚未量产的产品方案。</p>
        </li>
        <li>
          <span class="mono">02</span>
          <h3>1 元预定</h3>
          <p>支付 1 元表达支持意向，计入目标人数。</p>
        </li>
        <li>
          <span class="mono">03</span>
          <h3>达标生产</h3>
          <p>达到目标人数后，项目进入待生产与生产。</p>
        </li>
        <li>
          <span class="mono">04</span>
          <h3>现货上架</h3>
          <p>工厂完成后按实际售价开放购买。</p>
        </li>
      </ol>
    </section>

    <section ref="revealFactory" class="section container reveal factory">
      <div class="factory__card">
        <p class="eyebrow">FOR FACTORIES</p>
        <h2>先听见市场，再启动生产。</h2>
        <p class="lead">
          发布新品、观察支持人数、展示生产进度。用真实意向降低试产风险。
        </p>
        <BaseButton size="lg" @click="router.push('/studio')">发布你的第一款新品</BaseButton>
      </div>
    </section>

    <ReservationModal
      :open="!!reserveTarget"
      :product="reserveTarget"
      @close="reserveTarget = null"
    />
    <PurchaseModal
      :open="!!buyTarget"
      :product="buyTarget"
      @close="buyTarget = null"
    />
  </div>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: clamp(32px, 5vw, 72px);
  align-items: center;
  padding-top: clamp(48px, 8vw, 88px);
  padding-bottom: clamp(64px, 8vw, 100px);
}

.hero__copy .display {
  margin: 16px 0 18px;
  max-width: 8em;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.hero__slogan {
  margin-top: 28px;
  color: var(--muted);
  font-size: 14px;
}

.hero__product {
  background: var(--dark);
  color: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #1f1f1f;
}

.hero__visual {
  aspect-ratio: 4 / 3;
  background: #111;
}

.hero__info {
  padding: 22px 24px 24px;
  display: grid;
  gap: 10px;
}

.hero__info h2 {
  font-size: 22px;
  letter-spacing: -0.02em;
}

.hero__info > p {
  color: var(--dark-muted);
  font-size: 14px;
}

.hero__support {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 14px;
  margin-top: 4px;
}

.hero__support .accent {
  color: var(--accent);
  font-size: 22px;
}

.days {
  margin-left: auto;
  color: var(--dark-muted);
  font-size: 12px;
}

.hero__cta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.link {
  color: #fff;
  font-size: 13px;
  opacity: 0.72;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.link:hover {
  opacity: 1;
}

.section__head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 32px;
}

.section__head h2 {
  margin-top: 10px;
  font-size: clamp(28px, 4vw, 40px);
  letter-spacing: -0.03em;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stock-grid {
  grid-template-columns: repeat(3, 1fr);
}

.story {
  background: var(--dark);
  color: #fff;
  padding-block: clamp(64px, 8vw, 100px);
}

.story__inner {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: clamp(28px, 5vw, 64px);
  align-items: center;
}

.story__media {
  aspect-ratio: 5 / 4;
  border-radius: var(--radius);
  overflow: hidden;
  background: #161616;
}

.story__copy h2 {
  margin: 14px 0 24px;
  font-size: clamp(28px, 4vw, 44px);
  letter-spacing: -0.03em;
  max-width: 10em;
}

.story__copy ul {
  display: grid;
  gap: 16px;
  margin-bottom: 28px;
}

.story__copy li {
  display: grid;
  gap: 4px;
  padding-top: 14px;
  border-top: 1px solid var(--dark-line);
}

.story__copy strong {
  font-size: 15px;
}

.story__copy span {
  color: var(--dark-muted);
  font-size: 14px;
  line-height: 1.6;
}

.how .lead {
  margin-top: 12px;
}

.steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.steps li {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 24px 20px;
}

.steps .mono {
  color: var(--accent);
  font-size: 13px;
  letter-spacing: 0.08em;
}

.steps h3 {
  margin: 14px 0 8px;
  font-size: 18px;
}

.steps p {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

.factory__card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: clamp(36px, 6vw, 64px);
  max-width: 820px;
}

.factory__card h2 {
  margin: 12px 0 14px;
  font-size: clamp(28px, 4vw, 44px);
  letter-spacing: -0.03em;
}

.factory__card .lead {
  margin-bottom: 28px;
}

@media (max-width: 1100px) {
  .grid,
  .stock-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .steps {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .hero,
  .story__inner {
    grid-template-columns: 1fr;
  }

  .hero__copy .display {
    max-width: none;
  }
}

@media (max-width: 640px) {
  .grid,
  .stock-grid,
  .steps {
    grid-template-columns: 1fr;
  }

  .section__head {
    align-items: start;
    flex-direction: column;
  }
}
</style>
