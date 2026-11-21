import { reactive, watch } from 'vue'

const ui = reactive({
  reservationsOpen: false,
  mobileNavOpen: false,
  modalLocks: 0,
})

function syncBodyLock() {
  const locked = ui.reservationsOpen || ui.mobileNavOpen || ui.modalLocks > 0
  document.body.classList.toggle('is-locked', locked)
}

watch(
  () => [ui.reservationsOpen, ui.mobileNavOpen, ui.modalLocks],
  syncBodyLock,
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
    syncBodyLock()
  }

  function unlockScroll() {
    ui.modalLocks = Math.max(0, ui.modalLocks - 1)
    syncBodyLock()
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
