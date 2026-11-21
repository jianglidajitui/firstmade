import { computed, reactive, watch } from 'vue'
import { createInitialProducts, PRESET_IMAGES } from '@/data/products'
import { clearStorage, loadStorage, saveStorage } from '@/composables/useStorage'
import { useToast } from '@/composables/useToast'

const day = 24 * 60 * 60 * 1000

const RUNTIME_FIELDS = [
  'supporters',
  'status',
  'salePrice',
  'stock',
  'timeline',
  'deadline',
  'estimatedPrice',
  'targetSupporters',
  'productionDays',
  'name',
  'category',
  'tagline',
  'description',
  'factory',
  'variants',
  'faqs',
  'specs',
  'features',
  'reservationFee',
  'createdAt',
  'slug',
  'imagePresetId',
]

function resolvePresetImage(presetId) {
  return PRESET_IMAGES.find((i) => i.id === presetId)?.src || PRESET_IMAGES[0].src
}

function normalizeProduct(product) {
  const images =
    Array.isArray(product.images) && product.images.length
      ? product.images
      : product.imagePresetId
        ? [resolvePresetImage(product.imagePresetId), resolvePresetImage(product.imagePresetId)]
        : []

  return {
    ...product,
    supporters: Number(product.supporters) || 0,
    targetSupporters: Number(product.targetSupporters) || 500,
    stock: Number(product.stock) || 0,
    reservationFee: product.reservationFee ?? 1,
    timeline: Array.isArray(product.timeline) ? product.timeline : [],
    variants: Array.isArray(product.variants) ? product.variants : [],
    faqs: Array.isArray(product.faqs) ? product.faqs : [],
    features: Array.isArray(product.features) ? product.features : [],
    specs: Array.isArray(product.specs) ? product.specs : [],
    images,
  }
}

function buildDefaultState() {
  return {
    products: createInitialProducts().map(normalizeProduct),
    reservations: [],
    orders: [],
  }
}

function hydrate() {
  const saved = loadStorage()
  if (!saved) return buildDefaultState()

  const defaults = createInitialProducts()
  const defaultMap = Object.fromEntries(defaults.map((p) => [p.id, p]))
  const products = Array.isArray(saved.products)
    ? saved.products.map((p) => {
        const base = defaultMap[p.id]
        if (base) {
          const merged = { ...base }
          RUNTIME_FIELDS.forEach((key) => {
            if (p[key] !== undefined) merged[key] = p[key]
          })
          // Always restore bundled assets for catalog items
          merged.images = base.images
          merged.features = (Array.isArray(p.features) && p.features.length
            ? p.features
            : base.features
          ).map((f, i) => ({
            ...f,
            image: base.features[i]?.image || base.images[0],
          }))
          return normalizeProduct(merged)
        }

        const image = p.imagePresetId
          ? resolvePresetImage(p.imagePresetId)
          : p.images?.[0] || PRESET_IMAGES[0].src
        return normalizeProduct({
          ...p,
          images: [image, image],
          features: (p.features || []).map((f) => ({ ...f, image: f.image || image })),
        })
      })
    : defaults.map(normalizeProduct)

  defaults.forEach((d) => {
    if (!products.find((p) => p.id === d.id)) {
      products.push(normalizeProduct(d))
    }
  })

  return {
    products,
    reservations: Array.isArray(saved.reservations)
      ? saved.reservations.map((r) => {
          const base = defaultMap[r.productId]
          return {
            ...r,
            image: base?.images?.[0] || r.image,
          }
        })
      : [],
    orders: Array.isArray(saved.orders) ? saved.orders : [],
  }
}

const state = reactive(hydrate())
const toast = useToast()

watch(
  state,
  () => {
    saveStorage({
      products: state.products,
      reservations: state.reservations,
      orders: state.orders,
    })
  },
  { deep: true },
)

function getProduct(idOrSlug) {
  return state.products.find((p) => p.id === idOrSlug || p.slug === idOrSlug)
}

function progressOf(product) {
  if (!product?.targetSupporters) return 0
  return Math.min(100, Math.round((product.supporters / product.targetSupporters) * 100))
}

function daysLeft(product) {
  if (!product?.deadline) return 0
  return Math.max(0, Math.ceil((product.deadline - Date.now()) / day))
}

function syncCrowdfundingDeadlines() {
  state.products.forEach((p) => {
    if (p.status === 'crowdfunding' && p.deadline < Date.now() && p.supporters < p.targetSupporters) {
      p.status = 'ended'
      p.timeline = [
        ...p.timeline.filter((t) => t.id !== 'ended'),
        {
          id: 'ended',
          title: '众筹结束',
          desc: '未达目标人数，项目已结束。',
          at: Date.now(),
          done: true,
        },
      ]
    }
  })
}

syncCrowdfundingDeadlines()

function hasReserved(productId) {
  return state.reservations.some((r) => r.productId === productId)
}

function reserveProduct(productId) {
  const product = getProduct(productId)
  if (!product) return { ok: false, message: '商品不存在' }
  if (product.status !== 'crowdfunding') {
    return { ok: false, message: '当前状态不可预定' }
  }
  if (hasReserved(productId)) {
    return { ok: false, message: '你已预定过该商品' }
  }
  if (product.deadline < Date.now()) {
    product.status = 'ended'
    return { ok: false, message: '众筹已结束' }
  }

  product.supporters += 1
  state.reservations.unshift({
    id: `rsv-${Date.now()}`,
    productId: product.id,
    productName: product.name,
    image: product.images[0],
    amount: product.reservationFee,
    createdAt: Date.now(),
    statusAtReserve: product.status,
  })

  if (product.supporters >= product.targetSupporters) {
    product.status = 'funded'
    product.supporters = product.targetSupporters
    product.timeline = [
      ...product.timeline.filter((t) => t.id !== 'funded' && t.id !== 'support'),
      {
        id: 'funded',
        title: '达到目标人数',
        desc: '项目达标，等待工厂确认排产。',
        at: Date.now(),
        done: true,
      },
    ]
    toast.success('预定成功，项目已达标进入待生产')
    return { ok: true, funded: true }
  }

  toast.success('模拟预定成功')
  return { ok: true, funded: false }
}

function purchaseProduct({ productId, variantId, quantity }) {
  const product = getProduct(productId)
  if (!product) return { ok: false, message: '商品不存在' }
  if (product.status !== 'in_stock') {
    return { ok: false, message: '仅现货商品可购买' }
  }

  const qty = Number(quantity)
  if (!Number.isInteger(qty) || qty < 1) {
    return { ok: false, message: '请输入合法数量' }
  }
  if (qty > product.stock) {
    return { ok: false, message: '库存不足' }
  }

  const variant =
    product.variants.find((v) => v.id === variantId) || product.variants[0]
  if (!variant || variant.available === false) {
    return { ok: false, message: '规格不可用' }
  }

  product.stock -= qty
  const order = {
    id: `ord-${Date.now()}`,
    productId: product.id,
    productName: product.name,
    image: product.images[0],
    variantId: variant.id,
    variantLabel: variant.label,
    quantity: qty,
    unitPrice: product.salePrice,
    total: product.salePrice * qty,
    createdAt: Date.now(),
  }
  state.orders.unshift(order)
  toast.success('模拟购买成功，订单已保存到本地')
  return { ok: true, order }
}

function startProduction(productId) {
  const product = getProduct(productId)
  if (!product || product.status !== 'funded') {
    return { ok: false, message: '仅待生产项目可开始生产' }
  }
  product.status = 'producing'
  product.timeline = [
    ...product.timeline.filter((t) => t.id !== 'producing'),
    {
      id: 'producing',
      title: '启动生产',
      desc: '工厂进入打样、组装与质检流程。',
      at: Date.now(),
      done: true,
    },
  ]
  toast.success('已模拟开始生产')
  return { ok: true }
}

function completeProduction(productId, { salePrice, stock }) {
  const product = getProduct(productId)
  if (!product || product.status !== 'producing') {
    return { ok: false, message: '仅生产中项目可上架' }
  }
  const price = Number(salePrice)
  const qty = Number(stock)
  if (!(price > 0) || !Number.isFinite(price)) {
    return { ok: false, message: '请填写有效售价' }
  }
  if (!Number.isInteger(qty) || qty < 1) {
    return { ok: false, message: '请填写有效库存' }
  }
  product.status = 'in_stock'
  product.salePrice = Math.round(price)
  product.stock = qty
  product.timeline = [
    ...product.timeline.filter((t) => t.id !== 'stock'),
    {
      id: 'stock',
      title: '现货上架',
      desc: '产品完成量产并开放正式购买。',
      at: Date.now(),
      done: true,
    },
  ]
  toast.success('已上架为现货')
  return { ok: true }
}

function publishProduct(form) {
  const id = `fm-user-${Date.now()}`
  const createdAt = Date.now()
  const days = Number(form.durationDays) || 30
  const image = form.image || resolvePresetImage(form.imageId)
  const product = normalizeProduct({
    id,
    slug: `custom-${Date.now()}`,
    name: form.name.trim(),
    category: form.category,
    tagline: form.tagline.trim(),
    description: form.description.trim(),
    imagePresetId: form.imageId || null,
    images: [image, image],
    features: [
      {
        title: '新品亮点',
        text: form.tagline.trim(),
        image,
      },
    ],
    specs: [
      { label: '预计售价', value: `¥${form.estimatedPrice}` },
      { label: '生产周期', value: `${form.productionDays} 天` },
    ],
    factory: {
      name: form.factoryName.trim(),
      region: form.factoryRegion.trim(),
      about: '由工厂工作台发布的本地演示项目。',
    },
    reservationFee: 1,
    estimatedPrice: Number(form.estimatedPrice),
    salePrice: null,
    supporters: 0,
    targetSupporters: Number(form.targetSupporters),
    status: 'crowdfunding',
    createdAt,
    deadline: createdAt + days * day,
    productionDays: Number(form.productionDays),
    stock: 0,
    variants: [{ id: 'default', label: '标准版', available: true }],
    faqs: [
      {
        q: '这是真实商品吗？',
        a: '否。本条为本地演示发布，数据仅保存在你的浏览器中。',
      },
    ],
    timeline: [
      {
        id: 'launch',
        title: '新品发布',
        desc: '工厂提交产品方案，开启 1 元意向预定。',
        at: createdAt,
        done: true,
      },
      {
        id: 'support',
        title: '收集支持',
        desc: '达到目标人数后进入待生产。',
        at: null,
        done: false,
      },
    ],
  })

  state.products.unshift(product)
  toast.success('已发布到本地演示')
  return { ok: true, product }
}

function addDemoSupporters(productId, count = 1) {
  const product = getProduct(productId)
  if (!product) return { ok: false, message: '商品不存在' }
  if (product.status !== 'crowdfunding') {
    return { ok: false, message: '仅众筹中项目可增加支持人数' }
  }
  const room = product.targetSupporters - product.supporters
  if (room <= 0) return { ok: false, message: '已达目标人数' }
  const add = Math.min(Math.max(1, Number(count) || 1), room)
  product.supporters += add
  if (product.supporters >= product.targetSupporters) {
    product.status = 'funded'
    product.supporters = product.targetSupporters
    product.timeline = [
      ...product.timeline.filter((t) => t.id !== 'funded' && t.id !== 'support'),
      {
        id: 'funded',
        title: '达到目标人数',
        desc: '项目达标，等待工厂确认排产。',
        at: Date.now(),
        done: true,
      },
    ]
  }
  toast.success(`已模拟新增 ${add} 位支持者`)
  return { ok: true }
}

function resetDemo() {
  clearStorage()
  const fresh = buildDefaultState()
  state.products.splice(0, state.products.length, ...fresh.products)
  state.reservations.splice(0, state.reservations.length)
  state.orders.splice(0, state.orders.length)
  toast.success('演示数据已重置')
}

export function useStore() {
  const products = computed(() => state.products)
  const reservations = computed(() =>
    state.reservations.map((r) => {
      const product = getProduct(r.productId)
      return {
        ...r,
        currentStatus: product?.status || r.statusAtReserve,
        product,
      }
    }),
  )
  const orders = computed(() => state.orders)
  const crowdfundingProducts = computed(() =>
    state.products.filter((p) => p.status === 'crowdfunding'),
  )
  const inStockProducts = computed(() =>
    state.products.filter((p) => p.status === 'in_stock'),
  )
  const heroProduct = computed(
    () => state.products.find((p) => p.id === 'fm-hp-001') || state.products[0],
  )
  const storyProduct = computed(
    () =>
      state.products.find((p) => p.id === 'fm-oe-004') ||
      state.products.find((p) => p.status === 'producing'),
  )

  return {
    products,
    reservations,
    orders,
    crowdfundingProducts,
    inStockProducts,
    heroProduct,
    storyProduct,
    getProduct,
    progressOf,
    daysLeft,
    hasReserved,
    reserveProduct,
    purchaseProduct,
    startProduction,
    completeProduction,
    publishProduct,
    addDemoSupporters,
    resetDemo,
  }
}
