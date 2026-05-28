import { useState } from "react";
import { CheckSquare, HeartHandshake, Settings } from "lucide-react";
import { EventMatch } from "./components/EventMatch";
import { EventOnboarding, type EventPreferences } from "./components/EventOnboarding";
import { EventSwipeDeck } from "./components/EventSwipeDeck";
import { PcaTaskCapture } from "./components/PcaTaskCapture";
import { MOCK_EVENTS, type ConciergeEvent } from "./data/events";

export default function App() {
  const [preferences, setPreferences] = useState<EventPreferences>({
    city: "Ottawa, ON",
    radiusKm: 10,
    interests: ["food", "workshops", "music"],
    calendarMode: "manual",
  });
  const [selectedEvent, setSelectedEvent] = useState<ConciergeEvent | undefined>(MOCK_EVENTS[0]);
  const [matchedEvent, setMatchedEvent] = useState<ConciergeEvent | undefined>();
  const captureFollowUp = (prompt: string) => {
    window.dispatchEvent(new CustomEvent("pca-seed-task", { detail: prompt }));
  };

  return (
    <div className="app-shell">
      <header className="hero-panel">
        <p className="eyebrow">Clean migration target</p>
        <h1>PCA Event Concierge PoC</h1>
        <p>
          A clean app subfolder that keeps one logical copy of the PCA task capture patterns,
          selectively ports the event concierge UX, and removes Replit-specific config.
        </p>
        <div className="hero-tags">
          <span><CheckSquare aria-hidden="true" /> PCA capture</span>
          <span><HeartHandshake aria-hidden="true" /> Event matching</span>
          <span><Settings aria-hidden="true" /> No Replit runtime</span>
        </div>
      </header>

      <main className="layout">
        <div className="left-rail stack">
          <EventOnboarding preferences={preferences} onChange={setPreferences} />
          <EventSwipeDeck
            onMatch={(event) => {
              setMatchedEvent(event);
              setSelectedEvent(event);
            }}
            onSelect={setSelectedEvent}
          />
        </div>
        <div className="right-rail stack">
          <EventMatch event={matchedEvent} onCaptureFollowUp={captureFollowUp} />
          <PcaTaskCapture selectedEventTitle={selectedEvent?.title} />
        </div>
      </main>
    </div>
  );
}
