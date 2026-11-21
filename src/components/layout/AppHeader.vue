<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUI } from '@/composables/useUI'
import { useStore } from '@/composables/useStore'

const route = useRoute()
const router = useRouter()
const { ui, openReservations, toggleMobileNav, closeMobileNav } = useUI()
const { reservations } = useStore()
const scrolled = ref(false)

const count = computed(() => reservations.value.length)

function onScroll() {
  scrolled.value = window.scrollY > 8
}

async function goHowItWorks() {
  closeMobileNav()
  if (route.path !== '/') {
    await router.push({ path: '/', hash: '#how-it-works' })
  } else {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }
}

function goDiscover(status) {
  closeMobileNav()
  router.push({ path: '/discover', query: status ? { status } : {} })
}

function goStudio() {
  closeMobileNav()
  router.push('/studio')
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header" :class="{ 'is-scrolled': scrolled }">
    <div class="header__inner container">
      <RouterLink class="brand" to="/" @click="closeMobileNav">
        <span class="brand__cn">初造</span>
        <span class="brand__en mono">FIRSTMADE</span>
      </RouterLink>

      <nav class="nav desktop">
        <button type="button" @click="goDiscover()">发现新品</button>
        <button type="button" @click="goDiscover('in_stock')">现货好物</button>
        <button type="button" @click="goHowItWorks">如何参与</button>
      </nav>

      <div class="actions desktop">
        <button class="text-btn" type="button" @click="openReservations">
          我的预定
          <span v-if="count" class="count mono">{{ count }}</span>
        </button>
        <button class="cta" type="button" @click="goStudio">发布新品</button>
      </div>

      <button class="menu-btn" type="button" aria-label="打开菜单" @click="toggleMobileNav">
        <svg v-if="!ui.mobileNavOpen" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <div v-if="ui.mobileNavOpen" class="mobile">
      <button type="button" @click="goDiscover()">发现新品</button>
      <button type="button" @click="goDiscover('in_stock')">现货好物</button>
      <button type="button" @click="goHowItWorks">如何参与</button>
      <button type="button" @click="openReservations">我的预定{{ count ? `（${count}）` : '' }}</button>
      <button class="mobile-cta" type="button" @click="goStudio">发布新品</button>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  height: var(--header-h);
  transition:
    background var(--dur) var(--ease),
    border-color var(--dur) var(--ease),
    backdrop-filter var(--dur) var(--ease);
  border-bottom: 1px solid transparent;
}

.header.is-scrolled {
  background: rgba(245, 245, 242, 0.92);
  backdrop-filter: blur(10px);
  border-bottom-color: var(--line);
}

.header__inner {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
}

.brand {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  justify-self: start;
}

.brand__cn {
  font-size: 18px;
  font-weight: 650;
  letter-spacing: 0.08em;
}

.brand__en {
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--muted);
}

.nav {
  display: flex;
  gap: 28px;
  justify-content: center;
}

.nav button,
.text-btn {
  font-size: 14px;
  color: var(--ink);
  opacity: 0.88;
}

.nav button:hover,
.text-btn:hover {
  opacity: 1;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
}

.count {
  display: inline-grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  margin-left: 6px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-size: 11px;
}

.cta,
.mobile-cta {
  height: 36px;
  padding: 0 14px;
  border-radius: var(--radius-sm);
  background: var(--ink);
  color: #fff;
  font-size: 13px;
}

.cta:hover,
.mobile-cta:hover {
  background: #2a2a2a;
}

.menu-btn {
  display: none;
  justify-self: end;
  width: 40px;
  height: 40px;
  place-items: center;
}

.mobile {
  display: none;
}

@media (max-width: 900px) {
  .header__inner {
    grid-template-columns: 1fr auto;
  }

  .desktop {
    display: none !important;
  }

  .menu-btn {
    display: grid;
  }

  .mobile {
    display: grid;
    gap: 4px;
    padding: 12px var(--pad) 20px;
    background: rgba(245, 245, 242, 0.98);
    border-bottom: 1px solid var(--line);
  }

  .mobile button {
    text-align: left;
    padding: 12px 4px;
    font-size: 15px;
  }

  .mobile-cta {
    margin-top: 8px;
    text-align: center !important;
  }
}
</style>
