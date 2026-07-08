# Obsidian Vault and Couples App Assessment

_Date assessed: 2026-07-08_

## 1. Executive Summary

One way to think about this repository is that it is an **Obsidian vault with embedded software artifacts**. The vault contains notes, processed captures, Copilot prompts, media, metrics, and exported Replit projects. The most relevant application artifact for this assessment is:

```text
ReplitExport-spatialsense/Couple-Event-Finder
```

The couples app is a **high-fidelity frontend prototype** for a product called **WeGo**. Its core idea is simple:

> Tinder mechanics, but the swipe object is not a person. The swipe object is a local event.

The primitive loop is:

1. Two people want to do something together.
2. Choosing what to do creates friction.
3. The app turns that decision into a low-friction stream of binary choices: **pass** or **like**.
4. When both people like the same event, the app promotes that event into a shared plan.

The current implementation has a polished mobile-first UI, mock event data, onboarding, swipe interactions, maps, and a match celebration screen. The backend exists, but it is still mostly scaffold-level: it has Express, a storage interface, a user schema, and a route-registration shell, but it does not yet model couples, events, swipes, matches, preferences, or calendar integrations.

In short:

- **Product concept:** strong and coherent.
- **Frontend prototype:** fairly complete.
- **Backend domain model:** mostly absent.
- **Persistence:** not implemented for the app’s core behavior.
- **Matching logic:** simulated with a hardcoded event.
- **Technical health:** TypeScript check passes for the couples app.

---

## 2. Repository Context

The top-level repository is not just a conventional app repo. It is an Obsidian-oriented workspace that also contains exported Replit application projects.

At the time of assessment, the repository worktree had:

- Current branch: `work`
- A tracked modification in `ReplitExport-spatialsense/Design-Helper/pnpm-lock.yaml`
- Several untracked `node_modules/` directories under exported Replit projects

No code changes were required to inspect the couples app. This document is the only intentional assessment artifact added by this pass.

---

## 3. Couples App Product Primitive

The app is called **WeGo**. The landing page frames the problem directly:

> Stop asking “what do you want to do?” Swipe on local events and find your perfect mutual match.

Mechanically, the product is trying to solve a coordination problem.

A couple does not merely need recommendations. They need **agreement**. So the app turns event discovery into a shared voting system:

```text
Event candidate -> Partner A vote -> Partner B vote -> mutual like -> match
```

You can almost view this as a **two-person consensus engine over local events**.

The key abstraction is:

> A match is an event with two positive votes inside a shared couple context.

That abstraction is not fully implemented yet, but the UI is clearly designed around it.

---

## 4. User Flow

### 4.1 Home

The home screen introduces the app and gives the user two paths:

- **Get Started** -> onboarding
- **I already have an account** -> events screen

It also compresses the app into three verbs:

- **Connect**
- **Filter**
- **Match**

This is a clean product decomposition. The app’s promise is not “browse events”; it is “coordinate with your partner with less negotiation.”

### 4.2 Onboarding

The onboarding flow has four steps.

#### Step 1: Location and radius

The app defaults to Ottawa, Ontario and allows the user to set a search radius. It also contains map logic that adjusts zoom based on radius.

Primitive: **where are we willing to go?**

#### Step 2: Availability

The app asks when the user is free. It offers buttons for:

- Google Calendar
- Apple Calendar
- manual date-night windows such as Thursday night, Friday night, Saturday day, Saturday night, and Sunday day

Primitive: **when can this plan happen?**

#### Step 3: Budget and dealbreakers

The app asks for budget tier and constraints:

- Free
- $
- $$
- $$$
- 21+ only
- outdoor only
- dog friendly

Primitive: **what should be filtered out before we even start?**

#### Step 4: Interests

The app asks for preferred categories:

- Live Music
- Food Festivals
- Comedy Shows
- Art Galleries
- Workshops
- Markets
- Theater
- Outdoor Adventure
- Pop-ups
- Car Shows

Primitive: **what kinds of events are worth showing?**

### 4.3 Event Swipe Deck

The event screen is the core interaction loop.

The app keeps a local list of mock events and shows the first event as the active card. The user can:

- swipe left to pass,
- swipe right to like,
- tap image to reveal details,
- tap location to reveal a map,
- use buttons for pass, like, reset, and share.

The current events are hardcoded around Ottawa and include:

- Indie Night at The Basement
- Couples Pottery Workshop
- Classic Car Show & Shine
- Underground Comedy Night
- Weekend Farmers Market
- Twilight Food Truck Fest

Each mock event has a useful production-like shape:

```text
id
title
category
date
time
location
coordinates
price
image
source
description
```

This is close to the shape that a real event ingestion pipeline would produce.

### 4.4 Match Screen

The match screen is triggered when the prototype detects a successful match. Currently, this is hardcoded: liking event ID `2`, the **Couples Pottery Workshop**, routes to the match screen.

The match screen shows:

- both partner avatars,
- “It’s a Match!”,
- the matched event,
- date and time,
- location,
- an **Add to our Calendars** button,
- a **Keep Swiping** button,
- confetti animation.

This screen expresses the product outcome well: the app is not optimizing for endless browsing; it is trying to create a concrete plan.

---

## 5. Current Technical Architecture

### 5.1 Frontend

The frontend is a React/Vite/TypeScript app with:

- Wouter for routing
- TanStack Query for API state infrastructure
- Framer Motion for animation
- React Leaflet for maps
- Radix UI-style components
- Tailwind styling
- Canvas Confetti for the match celebration

Routes:

```text
/             -> Home
/onboarding   -> Onboarding
/events       -> Event swipe deck
/match        -> Match confirmation
```

### 5.2 Backend

The backend is an Express server that:

- creates an HTTP server,
- parses JSON and URL-encoded bodies,
- captures raw request bodies,
- logs `/api` responses,
- registers routes,
- serves static assets in production,
- mounts Vite middleware in development.

However, the backend route file is still a placeholder. There are no real API routes for events, swipes, couples, matches, onboarding preferences, or calendar actions.

### 5.3 Storage

The storage layer currently defines only user-oriented methods:

```text
getUser(id)
getUserByUsername(username)
createUser(user)
```

The concrete implementation is an in-memory `Map`.

This means the current app does not persist the core domain behavior. If the process restarts, any in-memory user state is gone, and the event/matching behavior is not stored at all.

### 5.4 Database Schema

The shared Drizzle schema currently defines only a `users` table:

```text
id
username
password
```

There are no tables yet for:

- couples,
- partner invitations,
- events,
- event sources,
- preferences,
- swipes,
- matches,
- calendar actions,
- notifications.

---

## 6. What Is Real vs. Simulated

### Real in the current app

- Routing between screens
- Multi-step onboarding UI
- Swipe card animation
- Local mock event deck
- Details overlay
- Embedded maps
- Match screen
- Confetti animation
- TypeScript-checkable codebase
- Express/Vite full-stack shell

### Simulated or placeholder

- User accounts
- Partner pairing
- Calendar connection
- Event ingestion
- Preference persistence
- Event filtering
- Swipe persistence
- Mutual matching
- Calendar insertion
- Sharing
- Notifications

The important distinction is that the **interaction prototype is real**, while the **coordination substrate is not yet real**.

A useful compression:

> The app currently simulates agreement. A production app would have to store and resolve agreement.

---

## 7. Domain Model That Wants To Exist

The current UI implies a domain model that is not yet implemented.

A minimal production schema would likely include:

### Users

```text
users
- id
- email / username
- password_hash or auth_provider_id
- display_name
- avatar_url
- created_at
```

### Couples

```text
couples
- id
- created_at
```

### Couple Members

```text
couple_members
- couple_id
- user_id
- role
- joined_at
```

### Events

```text
events
- id
- external_source
- external_id
- title
- category
- description
- starts_at
- ends_at
- venue_name
- latitude
- longitude
- price_min
- price_max
- image_url
- source_url
```

### Preferences

```text
preferences
- id
- couple_id or user_id
- city
- latitude
- longitude
- radius_km
- budget_tier
- allowed_days
- categories
- dealbreakers
```

### Swipes

```text
swipes
- id
- couple_id
- user_id
- event_id
- vote: like | pass
- created_at
```

### Matches

```text
matches
- id
- couple_id
- event_id
- created_at
- status: proposed | calendar_added | dismissed
```

### Calendar Actions

```text
calendar_actions
- id
- match_id
- user_id
- provider
- external_calendar_event_id
- status
- created_at
```

Mechanically, the central operation is simple:

```text
When user likes event:
  store swipe
  check if partner also liked same event
  if yes, create match
```

That is the core backend transition the prototype is currently faking.

---

## 8. Event-Driven View

This app is naturally event-driven.

The user-facing “events” are concerts, workshops, markets, etc. But the system also has internal events:

```text
UserOnboarded
PreferenceUpdated
EventIngested
EventShown
EventPassed
EventLiked
MutualMatchCreated
CalendarAddRequested
CalendarAddSucceeded
CalendarAddFailed
NotificationSent
```

One way to think about it:

> The event deck is the UI projection of an event stream. The match is a derived event created when two like-events intersect.

This matters because the matching system should be auditable and replayable. If a user asks “why did we match on this?” the system should be able to explain:

- the event was inside the radius,
- it matched the category preferences,
- it fit the budget,
- both partners liked it,
- it fit the availability window.

That becomes important if this grows from prototype to real coordination product.

---

## 9. Observability and Governance Implications

For a local event matching app, observability is not just server uptime. You want to understand the recommendation/matching pipeline.

Useful operational signals would include:

- events ingested per source,
- duplicate event rate,
- invalid geocoding rate,
- event freshness,
- swipe-through rate,
- like rate,
- mutual match rate,
- calendar conversion rate,
- partner invitation completion rate,
- empty-deck rate,
- source reliability.

For privacy and governance, the sensitive primitives are:

- location,
- calendar availability,
- relationship graph,
- event preferences,
- behavioral swipe history.

So a production version should be careful about:

- minimizing stored calendar data,
- separating auth identity from preference data where possible,
- avoiding unnecessary precise location retention,
- making partner visibility rules explicit,
- allowing users to delete history.

The app is small, but the data is intimate.

---

## 10. Technical Health

The couples app TypeScript check passes with:

```bash
npm run check
```

The command completed successfully, though npm printed a warning about an unknown environment config named `http-proxy`.

This means the current source is typecheck-clean, but it does not mean the app is feature-complete. TypeScript validates the scaffold and UI code; it does not validate that the product’s backend domain behavior exists.

---

## 11. Main Gaps

### 11.1 Backend domain model

The largest gap is that the backend does not yet model the actual problem.

Right now, the backend knows about users. The product needs it to know about couples, events, preferences, swipes, and matches.

### 11.2 Persistence

Onboarding choices do not appear to persist. Swipes do not persist. Matches do not persist. Calendar actions do not persist.

The app can demonstrate the flow, but it cannot yet remember the flow.

### 11.3 Partner state

The UI shows a partner avatar and a “waiting” state, but there is no real partner session or synchronization logic.

A real version needs:

- invite partner,
- accept invite,
- couple context,
- separate votes per partner,
- match creation only when both users like the same event.

### 11.4 Event ingestion

The event list is static. A production app needs ingestion from event sources, deduplication, normalization, geocoding, categorization, pricing extraction, and freshness management.

### 11.5 Calendar integration

Calendar UI exists, but no calendar integration exists yet.

A real version needs:

- OAuth or native calendar permissions,
- availability reading or manual availability modeling,
- add-to-calendar action,
- failure handling,
- partner calendar coordination.

---

## 12. Recommended Next Build Sequence

A calm way to proceed is to make the hidden state real, one layer at a time.

### Phase 1: Persist the prototype loop

Goal: make the current mock experience stateful.

- Add event table.
- Seed current mock events into storage.
- Add swipe table.
- Add match table.
- Replace local event array with API-backed event deck.
- Implement `POST /api/swipes`.
- Implement match creation when both partners like the same event.

### Phase 2: Add couple pairing

Goal: make the “partner” real.

- Add couple and couple member tables.
- Add invite code or invite link flow.
- Associate swipes with `couple_id` and `user_id`.
- Show partner waiting/liked/matched state from backend data.

### Phase 3: Persist onboarding preferences

Goal: make filters real.

- Store city/location/radius.
- Store budget and dealbreakers.
- Store categories.
- Use these preferences to filter event candidates.

### Phase 4: Event ingestion

Goal: stop relying on static mock data.

- Add source adapters.
- Normalize event records.
- Deduplicate events.
- Geocode venues.
- Track source freshness and reliability.

### Phase 5: Calendar and notifications

Goal: close the loop from match to plan.

- Add calendar provider connection.
- Add calendar event creation.
- Notify partner on match.
- Track calendar-add success/failure.

---

## 13. Product Assessment

The interesting thing about this app is that the product idea is not “event discovery” in the generic sense. Event discovery apps often fail because they stop at browse/search.

This app adds a second-person coordination layer.

That is the actual differentiator:

```text
Discovery app: What could I do?
Couples app: What do we both want to do?
```

That small shift changes the system design. The event is no longer just content. It becomes a coordination token.

The current prototype captures that well. The next step is to make the coordination real in the backend.

---

## 14. Final Assessment

The couples app is best described as:

> A polished mobile-first prototype for mutual event selection, with a scaffolded full-stack architecture but no real domain persistence yet.

It is already useful for validating the user experience:

- Does the swipe mechanic make sense for couples?
- Are events the right unit of choice?
- Does onboarding capture the right constraints?
- Does a match feel like a satisfying outcome?

It is not yet ready as a real multi-user product because the backend does not yet store or resolve the core state transitions.

If continued, the next engineering move should not be more UI polish. The next move should be to implement the smallest real closed loop:

```text
two users -> one couple -> shared event deck -> persisted swipes -> mutual match
```

Once that loop exists, the app becomes a real coordination system rather than a simulation of one.
