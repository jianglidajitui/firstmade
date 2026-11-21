<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ToastHost from '@/components/ui/ToastHost.vue'
import MyReservationsDrawer from '@/components/reservation/MyReservationsDrawer.vue'
import { useUI } from '@/composables/useUI'

const route = useRoute()
const { closeMobileNav } = useUI()

function pageKey(r) {
  // 区分实际页面与商品，但不用 fullPath，避免筛选触发整页切换
  if (r.name === 'product') return r.path
  return r.path
}

watch(
  () => route.path,
  () => {
    closeMobileNav()
  },
)
</script>

<template>
  <AppHeader />
  <main class="page-main">
    <RouterView v-slot="{ Component, route: r }">
      <Transition name="page-fade">
        <component :is="Component" :key="pageKey(r)" />
      </Transition>
    </RouterView>
  </main>
  <AppFooter />
  <MyReservationsDrawer />
  <ToastHost />
</template>
