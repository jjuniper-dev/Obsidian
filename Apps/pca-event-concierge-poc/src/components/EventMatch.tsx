import { CalendarHeart, Check, Heart, MapPin } from "lucide-react";
import { type ConciergeEvent } from "../data/events";

export function EventMatch({ event, onCaptureFollowUp }: {
  event?: ConciergeEvent;
  onCaptureFollowUp: (prompt: string) => void;
}) {
  if (!event) {
    return (
      <section className="panel empty-state">
        <Heart aria-hidden="true" />
        <h2>No match yet</h2>
        <p>Like an event to preview the migrated match screen pattern.</p>
      </section>
    );
  }

  return (
    <section className="panel match-panel">
      <div className="match-badge"><Heart aria-hidden="true" /></div>
      <p className="eyebrow">It's a match</p>
      <h2>{event.title}</h2>
      <div className={`match-hero ${event.gradient}`} />
      <div className="event-meta centered">
        <span><CalendarHeart aria-hidden="true" /> {event.date} · {event.time}</span>
        <span><MapPin aria-hidden="true" /> {event.location}</span>
      </div>
      <button
        className="primary"
        type="button"
        onClick={() => onCaptureFollowUp(`Add ${event.title} to our calendar and invite my partner`)}
      >
        <Check aria-hidden="true" /> Capture calendar follow-up
      </button>
    </section>
  );
}
