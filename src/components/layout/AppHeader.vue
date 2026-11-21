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
let raf = 0

const count = computed(() => reservations.value.length)
const onDiscover = computed(() => route.path.startsWith('/discover'))
const onStock = computed(
  () => onDiscover.value && route.query.status === 'in_stock',
)
const onStudio = computed(() => route.path.startsWith('/studio'))
const onHow = computed(() => route.path === '/' && route.hash === '#how-it-works')

function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    scrolled.value = window.scrollY > 8
    raf = 0
  })
}

async function goHowItWorks() {
  closeMobileNav()
  if (route.path !== '/') {
    await router.push({ path: '/', hash: '#how-it-works' })
  } else {
    const el = document.getElementById('how-it-works')
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: 'smooth' })
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

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <header class="header" :class="{ 'is-scrolled': scrolled, 'is-open': ui.mobileNavOpen }">
    <div class="header__inner container">
      <RouterLink class="brand" to="/" @click="closeMobileNav">
        <span class="brand__cn">初造</span>
        <span class="brand__en mono">FIRSTMADE</span>
      </RouterLink>

      <nav class="nav desktop">
        <button
          type="button"
          :class="{ active: onDiscover && !onStock }"
          @click="goDiscover()"
        >
          发现新品
        </button>
        <button
          type="button"
          :class="{ active: onStock }"
          @click="goDiscover('in_stock')"
        >
          现货好物
        </button>
        <button type="button" :class="{ active: onHow }" @click="goHowItWorks">
          如何参与
        </button>
      </nav>

      <div class="actions desktop">
        <button class="text-btn" type="button" @click="openReservations">
          我的预定
          <span v-if="count" class="count mono">{{ count }}</span>
        </button>
        <button class="cta" type="button" :class="{ active: onStudio }" @click="goStudio">
          发布新品
        </button>
      </div>

      <button
        class="menu-btn"
        type="button"
        :aria-label="ui.mobileNavOpen ? '关闭菜单' : '打开菜单'"
        :aria-expanded="ui.mobileNavOpen"
        @click="toggleMobileNav"
      >
        <svg v-if="!ui.mobileNavOpen" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <Transition name="mobile-nav">
      <div v-if="ui.mobileNavOpen" class="mobile">
        <button type="button" :class="{ active: onDiscover && !onStock }" @click="goDiscover()">
          发现新品
        </button>
        <button type="button" :class="{ active: onStock }" @click="goDiscover('in_stock')">
          现货好物
        </button>
        <button type="button" :class="{ active: onHow }" @click="goHowItWorks">如何参与</button>
        <button type="button" @click="openReservations">
          我的预定{{ count ? `（${count}）` : '' }}
        </button>
        <button class="mobile-cta" type="button" @click="goStudio">发布新品</button>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  height: var(--header-h);
  transition:
    background var(--dur-hover) var(--ease),
    border-color var(--dur-hover) var(--ease);
  border-bottom: 1px solid transparent;
  background: transparent;
}

.header.is-scrolled,
.header.is-open {
  background: rgba(245, 245, 242, 0.94);
  border-bottom-color: var(--line);
  /* 固定模糊值，避免滚动时持续动画 blur */
  backdrop-filter: blur(10px);
}

.header__inner {
  height: var(--header-h);
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
  position: relative;
  font-size: 14px;
  color: var(--ink);
  opacity: 0.72;
  padding-bottom: 4px;
  transition: opacity var(--dur-hover) var(--ease);
}

.nav button::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--ink);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform var(--dur-hover) var(--ease);
}

.nav button.active,
.text-btn:focus-visible {
  opacity: 1;
}

.nav button.active::after {
  transform: scaleX(1);
}

@media (hover: hover) and (pointer: fine) {
  .nav button:hover,
  .text-btn:hover {
    opacity: 1;
  }

  .nav button:hover::after {
    transform: scaleX(1);
  }
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
  transition:
    background var(--dur-hover) var(--ease),
    transform var(--dur-press) var(--ease);
}

.cta:active,
.mobile-cta:active {
  transform: scale(0.98);
}

@media (hover: hover) and (pointer: fine) {
  .cta:hover,
  .mobile-cta:hover {
    background: #2a2a2a;
  }
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

.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition:
    opacity var(--dur-overlay) var(--ease),
    transform var(--dur-overlay) var(--ease);
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
  transform: translateY(-6px);
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

  .mobile button.active {
    color: var(--accent);
  }

  .mobile-cta {
    margin-top: 8px;
    text-align: center !important;
  }
}
</style>
