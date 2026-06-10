# WeGo - Project Backlog & Roadmap

## 🎯 Phase 1: Prototype (Current State)
- [x] Core scaffolding (React, Vite, Tailwind, wouter)
- [x] Dark theme styling (Electric Indigo primary)
- [x] 4-Step Onboarding Flow (Location, Radius, Calendar, Preferences)
- [x] Tinder-style Swipe Interface (Framer Motion)
- [x] Event Details Overlay
- [x] Interactive Leaflet Maps
- [x] Match & Confirmation Screen
- [x] Full Accessibility Pass (WCAG AA)

## 🏗️ Phase 2: Fullstack Graduation (Next Steps)
- [ ] **Backend Integration:** Replace mock data with a real Postgres database and REST API.
- [ ] **Authentication:** Add user login (e.g., Auth0, Firebase, or standard JWT) to link couples together.
- [ ] **Real Event Data:** Integrate a third-party API (Ticketmaster, Eventbrite, Meetup) to fetch real Ottawa/Canadian events.
- [ ] **Calendar Sync:** Implement OAuth for Google Calendar and Apple Calendar to actually schedule events.
- [ ] **Push Notifications:** Add SMS or push notifications to alert a partner when a match occurs.

## 🧪 Phase 3: E2E & Agentic Testing (UiPath / Enterprise Prep)
- [ ] **Automated UI Testing:** Introduce Playwright or Cypress to cover the core happy path (Login -> Onboard -> Swipe -> Match).
- [ ] **Visual Regression Testing:** Add snapshot testing to ensure the complex Framer Motion swipe gestures remain intact.
- [ ] **UiPath Test Cloud Setup:** Configure the CI/CD pipeline to support UiPath agentic testing for cross-browser and cross-device end-to-end validation.
- [ ] **Self-Healing Selectors:** Ensure all UI elements use semantic `data-testid` attributes (which are currently implemented) to support robust, AI-driven test execution.

## 🚀 Phase 4: Production Polish
- [ ] **Performance Optimization:** Lazy load the Leaflet map and optimize image delivery.
- [ ] **Offline Support:** Add a Service Worker / PWA capabilities so users can browse cached events offline.
- [ ] **Analytics:** Integrate product analytics (PostHog, Mixpanel) to track swipe behaviors and drop-off rates.