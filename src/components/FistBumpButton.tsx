import { useState } from "react";
import { trackLikeClick } from "../lib/analytics";
import { isAnalyticsDebugMode, isFirebaseConfigured } from "../lib/firebase";

export function FistBumpButton() {
  const [bumped, setBumped] = useState(false);

  const onClick = () => {
    setBumped(true);
    trackLikeClick("hero");

    if (isAnalyticsDebugMode() && !isFirebaseConfigured()) {
      console.warn(
        "[analytics] Fist bump clicked but Firebase is not configured in this build.",
      );
    }

    window.setTimeout(() => setBumped(false), 700);
  };

  return (
    <button
      type="button"
      className={`fist-bump-btn${bumped ? " is-bumped" : ""}`}
      onClick={onClick}
      aria-label="Send a fist bump"
      title="Fist bump!"
    >
      <span className="fist-bump-emoji" aria-hidden>
        👊
      </span>
      <span className="fist-bump-label">Fist me a bump !</span>
    </button>
  );
}
