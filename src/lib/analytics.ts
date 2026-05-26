import { logEvent } from 'firebase/analytics'
import { initFirebaseAnalytics, isFirebaseConfigured } from './firebase'

export type AnalyticsParams = Record<string, string | number | boolean>

/** Fire-and-forget custom event (no-op when Firebase env is missing). */
export function trackEvent(eventName: string, params?: AnalyticsParams) {
  if (!isFirebaseConfigured()) return

  void initFirebaseAnalytics().then((analytics) => {
    if (!analytics) return
    logEvent(analytics, eventName, params)
  })
}

/** Standard page view for the single-page portfolio. */
export function trackPageView(pagePath = '/') {
  trackEvent('page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: pagePath,
  })
}

/** Sidebar / CTA / roadmap controls */
export function trackButtonClick(buttonId: string, extra?: AnalyticsParams) {
  trackEvent('button_click', { button_id: buttonId, ...extra })
}

/** Fist bump / “like” on the hero */
export function trackLikeClick(location = 'hero') {
  trackEvent('like_clicked', { location })
}
