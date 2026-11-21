let lockCount = 0
let savedY = 0

function applyLock() {
  savedY = window.scrollY || window.pageYOffset || 0
  const scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth)
  document.body.style.position = 'fixed'
  document.body.style.top = `-${savedY}px`
  document.body.style.left = '0'
  document.body.style.right = '0'
  document.body.style.width = '100%'
  if (scrollbar > 0) {
    document.body.style.paddingRight = `${scrollbar}px`
  }
  document.body.classList.add('is-locked')
}

function releaseLock() {
  document.body.classList.remove('is-locked')
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.width = ''
  document.body.style.paddingRight = ''
  window.scrollTo(0, savedY)
}

export function lockBodyScroll() {
  if (lockCount === 0) applyLock()
  lockCount += 1
}

export function unlockBodyScroll() {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) releaseLock()
}

export function forceUnlockBodyScroll() {
  lockCount = 0
  releaseLock()
}
