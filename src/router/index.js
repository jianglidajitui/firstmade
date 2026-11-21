import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '初造 FIRSTMADE' },
  },
  {
    path: '/discover',
    name: 'discover',
    component: () => import('@/views/DiscoverView.vue'),
    meta: { title: '发现产品 · 初造' },
  },
  {
    path: '/product/:id',
    name: 'product',
    component: () => import('@/views/ProductDetailView.vue'),
    meta: { title: '商品详情 · 初造' },
  },
  {
    path: '/studio',
    name: 'studio',
    component: () => import('@/views/StudioView.vue'),
    meta: { title: '工厂工作台 · 初造' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '页面不存在 · 初造' },
  },
]

function waitForHashEl(hash, maxFrames = 48) {
  return new Promise((resolve) => {
    let frames = 0
    const tick = () => {
      const el = document.querySelector(hash)
      if (el) {
        resolve(el)
        return
      }
      frames += 1
      if (frames >= maxFrames) {
        resolve(null)
        return
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 浏览器前进/后退：恢复历史位置（瞬时，不用 smooth）
    if (savedPosition) {
      return savedPosition
    }

    // 同页仅改 query（筛选/搜索）：保持滚动位置
    if (from.name && to.path === from.path && to.hash === from.hash) {
      return false
    }

    // 锚点：等内容挂载后再平滑定位，并预留导航高度
    if (to.hash) {
      return waitForHashEl(to.hash).then((el) => {
        if (!el) return { top: 0, left: 0 }
        return {
          el: to.hash,
          top: 80,
          behavior: 'smooth',
        }
      })
    }

    // 进入新页面：瞬时回顶，避免从旧位置一路滚上去
    return { top: 0, left: 0 }
  },
})

router.afterEach((to) => {
  document.title = to.meta.title || '初造 FIRSTMADE'
})

export default router
