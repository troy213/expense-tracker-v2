import { useCallback, useEffect, useState } from 'react'
import { getStorage, setStorage } from '@/utils'

const DISMISS_KEY = 'pwa-install-dismissed'

/**
 * The `beforeinstallprompt` event is non-standard and not in the DOM lib types.
 * Chromium fires it when the PWA is installable; calling `prompt()` opens the
 * native install dialog.
 */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const isIOSDevice = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
  // iPadOS 13+ reports as Mac, detect via touch support
  (window.navigator.platform === 'MacIntel' &&
    window.navigator.maxTouchPoints > 1)

const isInStandaloneMode = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  // iOS Safari uses a non-standard navigator.standalone flag
  ('standalone' in window.navigator &&
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true)

/**
 * Drives the custom PWA install banner.
 *
 * - Chromium (Android/desktop): captures `beforeinstallprompt` so we can show
 *   our own UI and trigger the native dialog on demand.
 * - iOS Safari: cannot prompt programmatically, so we surface manual
 *   "Add to Home Screen" instructions instead.
 *
 * Stays hidden when the app is already installed or the user dismissed it.
 */
const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const isIOS = isIOSDevice()

  useEffect(() => {
    if (isInStandaloneMode() || getStorage(DISMISS_KEY) === 'true') {
      return
    }

    if (isIOS) {
      setIsVisible(true)
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsVisible(true)
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setIsVisible(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isIOS])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return
    }

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsVisible(false)
    }
    setDeferredPrompt(null)
  }, [deferredPrompt])

  const dismiss = useCallback(() => {
    setStorage(DISMISS_KEY, 'true')
    setIsVisible(false)
  }, [])

  return { isVisible, isIOS, promptInstall, dismiss }
}

export default usePWAInstall
