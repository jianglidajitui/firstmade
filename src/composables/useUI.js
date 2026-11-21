import { reactive, watch } from 'vue'
import { lockBodyScroll, unlockBodyScroll } from '@/composables/useScrollLock'

const ui = reactive({
  reservationsOpen: false,
  mobileNavOpen: false,
  modalLocks: 0,
})

watch(
  () => ui.mobileNavOpen,
  (open, wasOpen) => {
    if (open && !wasOpen) lockBodyScroll()
    if (!open && wasOpen) unlockBodyScroll()
  },
)

export function useUI() {
  function openReservations() {
    ui.mobileNavOpen = false
    ui.reservationsOpen = true
  }

  function closeReservations() {
    ui.reservationsOpen = false
  }

  function toggleMobileNav() {
    ui.mobileNavOpen = !ui.mobileNavOpen
  }

  function closeMobileNav() {
    ui.mobileNavOpen = false
  }

  function lockScroll() {
    ui.modalLocks += 1
    lockBodyScroll()
  }

  function unlockScroll() {
    if (ui.modalLocks <= 0) return
    ui.modalLocks -= 1
    unlockBodyScroll()
  }

  return {
    ui,
    openReservations,
    closeReservations,
    toggleMobileNav,
    closeMobileNav,
    lockScroll,
    unlockScroll,
  }
}
