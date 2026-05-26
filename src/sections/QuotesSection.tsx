import { RevealText } from "../components/RevealText";
import { StarTrails } from "../components/StarTrails";
import { ScrollHint } from "../components/ScrollHint";
import { useDailyQuote } from "../hooks/useDailyQuote";

export function QuotesSection() {
  const quote = useDailyQuote();

  return (
    <section id="quotes" className="section quotes-section">
      <StarTrails />
      <div className="quotes-stage">
        <RevealText as="blockquote" className="quote-text">
          <p>&ldquo;{quote}&rdquo;</p>
        </RevealText>
      </div>
      <ScrollHint targetId="timeline" label="Scroll down to next" />
    </section>
  );
}
