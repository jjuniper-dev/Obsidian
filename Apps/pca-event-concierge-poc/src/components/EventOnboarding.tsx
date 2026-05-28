import { Calendar, MapPin, SlidersHorizontal, Tags } from "lucide-react";

export interface EventPreferences {
  city: string;
  radiusKm: number;
  interests: string[];
  calendarMode: "manual" | "calendar-later";
}

export function EventOnboarding({ preferences, onChange }: {
  preferences: EventPreferences;
  onChange: (preferences: EventPreferences) => void;
}) {
  const setInterests = (value: string) => {
    onChange({ ...preferences, interests: value.split(",").map((item) => item.trim()).filter(Boolean) });
  };

  return (
    <section className="panel stack">
      <div className="section-heading">
        <SlidersHorizontal aria-hidden="true" />
        <div>
          <h2>Concierge onboarding</h2>
          <p>Migrated from the Replit event finder onboarding flow, simplified for a clean PoC.</p>
        </div>
      </div>

      <div className="grid two">
        <label className="field-card">
          <span><MapPin aria-hidden="true" /> City</span>
          <input value={preferences.city} onChange={(event) => onChange({ ...preferences, city: event.target.value })} />
        </label>
        <label className="field-card">
          <span><SlidersHorizontal aria-hidden="true" /> Radius km</span>
          <input
            type="number"
            min="1"
            value={preferences.radiusKm}
            onChange={(event) => onChange({ ...preferences, radiusKm: Number(event.target.value) })}
          />
        </label>
        <label className="field-card wide">
          <span><Tags aria-hidden="true" /> Interests</span>
          <input value={preferences.interests.join(", ")} onChange={(event) => setInterests(event.target.value)} />
        </label>
        <label className="field-card wide">
          <span><Calendar aria-hidden="true" /> Calendar mode</span>
          <select
            value={preferences.calendarMode}
            onChange={(event) => onChange({ ...preferences, calendarMode: event.target.value as EventPreferences["calendarMode"] })}
          >
            <option value="manual">Manual availability for PoC</option>
            <option value="calendar-later">Calendar integration later</option>
          </select>
        </label>
      </div>
    </section>
  );
}
