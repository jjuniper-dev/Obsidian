import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Heart, MapPin, RotateCcw, X } from "lucide-react";
import { type ConciergeEvent, MOCK_EVENTS } from "../data/events";
import { LeafletEventMap } from "./LeafletEventMap";

export function EventSwipeDeck({ onMatch, onSelect }: {
  onMatch: (event: ConciergeEvent) => void;
  onSelect: (event: ConciergeEvent | undefined) => void;
}) {
  const [queue, setQueue] = useState(MOCK_EVENTS);
  const currentEvent = queue[0];
  const remainingCount = useMemo(() => Math.max(queue.length - 1, 0), [queue.length]);

  const swipe = (direction: "left" | "right") => {
    if (!currentEvent) return;
    if (direction === "right") {
      onMatch(currentEvent);
    }
    const nextQueue = queue.slice(1);
    setQueue(nextQueue);
    onSelect(nextQueue[0]);
  };

  const reset = () => {
    setQueue(MOCK_EVENTS);
    onSelect(MOCK_EVENTS[0]);
  };

  if (!currentEvent) {
    return (
      <section className="panel empty-state">
        <h2>No more events in this mock queue</h2>
        <p>Reset the deck or connect a real event provider in the next migration step.</p>
        <button className="primary" type="button" onClick={reset}><RotateCcw aria-hidden="true" /> Reset deck</button>
      </section>
    );
  }

  return (
    <section className="panel stack">
      <div className="section-heading">
        <Heart aria-hidden="true" />
        <div>
          <h2>Event concierge swipe deck</h2>
          <p>Swipe pattern migrated from Couple-Event-Finder with mock events only.</p>
        </div>
      </div>

      <motion.article
        key={currentEvent.id}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_event, info) => {
          if (info.offset.x > 120) swipe("right");
          if (info.offset.x < -120) swipe("left");
        }}
        className="event-card"
      >
        <div className={`event-hero ${currentEvent.gradient}`}>
          <span>{currentEvent.category}</span>
        </div>
        <div className="event-body">
          <div className="event-title-row">
            <div>
              <h3>{currentEvent.title}</h3>
              <p>{currentEvent.description}</p>
            </div>
            <strong>{currentEvent.price}</strong>
          </div>
          <div className="event-meta">
            <span><Calendar aria-hidden="true" /> {currentEvent.date} · {currentEvent.time}</span>
            <span><MapPin aria-hidden="true" /> {currentEvent.location} · {currentEvent.distance}</span>
          </div>
          <LeafletEventMap event={currentEvent} />
          <p className="source-note">{currentEvent.source}. {remainingCount} more event{remainingCount === 1 ? "" : "s"} queued.</p>
        </div>
      </motion.article>

      <div className="swipe-actions">
        <button className="secondary round" type="button" onClick={() => swipe("left")} aria-label="Pass on event"><X aria-hidden="true" /></button>
        <button className="primary round" type="button" onClick={() => swipe("right")} aria-label="Like event"><Heart aria-hidden="true" /></button>
      </div>
    </section>
  );
}
