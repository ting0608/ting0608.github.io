import { useState } from 'react'
import { trackLikeClick } from '../lib/analytics'

export function FistBumpButton() {
  const [bumped, setBumped] = useState(false)

  const onClick = () => {
    setBumped(true)
    trackLikeClick('hero')
    window.setTimeout(() => setBumped(false), 700)
  }

  return (
    <button
      type="button"
      className={`fist-bump-btn${bumped ? ' is-bumped' : ''}`}
      onClick={onClick}
      aria-label="Send a fist bump"
      title="Fist bump!"
    >
      <span className="fist-bump-emoji" aria-hidden>
        👊
      </span>
      <span className="fist-bump-label">Fist bump</span>
    </button>
  )
}
