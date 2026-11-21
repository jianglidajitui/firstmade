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

watch(
  () => route.fullPath,
  () => {
    closeMobileNav()
  },
)
</script>

<template>
  <AppHeader />
  <main class="page-main">
    <RouterView />
  </main>
  <AppFooter />
  <MyReservationsDrawer />
  <ToastHost />
</template>
