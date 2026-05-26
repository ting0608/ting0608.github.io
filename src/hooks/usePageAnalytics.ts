import { useEffect } from 'react'
import { trackPageView } from '../lib/analytics'
import { isFirebaseConfigured } from '../lib/firebase'

/** Logs initial page view once Firebase is configured. */
export function usePageAnalytics() {
  useEffect(() => {
    if (!isFirebaseConfigured()) return
    trackPageView(window.location.pathname || '/')
  }, [])
}
