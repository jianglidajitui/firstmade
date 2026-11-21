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

const router = createRouter({
  // 与 Vite base 对齐，保证 GitHub Pages 子路径下路由正常
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ el: to.hash, behavior: 'smooth' })
        }, 50)
      })
    }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = to.meta.title || '初造 FIRSTMADE'
})

export default router
