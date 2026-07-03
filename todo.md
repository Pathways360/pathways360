# Pathways 360 — Project TODO

## Phase 1: Architecture & Database
- [x] Design and apply full database schema (users, profiles, assessments, goals, resources, appointments, coach settings, organizations, case managers)
- [x] Set up role-based access (user, case_manager, org_admin)
- [x] Configure tRPC routers for all features

## Phase 2: Authentication & Onboarding
- [x] Splash screen / landing page with Pathways 360 branding and tagline
- [x] User sign up / login flow
- [x] Multi-step needs assessment intake questionnaire (housing, employment, health, legal, recovery, identity, family, goals)
- [x] Profile creation with privacy controls

## Phase 3: AI Life Coach
- [x] Coach setup screen (name, avatar selection from diverse library, photo upload)
- [x] Devotionals toggle (opt-in, off by default)
- [x] Daily check-in messages from coach
- [x] Motivational messages and goal-based coaching conversations
- [x] Coach avatar display throughout app

## Phase 4: Main Dashboard
- [x] Today's plan widget
- [x] Upcoming appointments widget
- [x] Active goals summary
- [x] Daily message from life coach
- [x] Quick action buttons (Find Resources, Chat with Coach, Add Appointment)

## Phase 5: Resource Navigator
- [x] Real-time resource database (shelters, food banks, legal aid, recovery, employment, transportation, medical, mental health)
- [x] Filter by category and location/ZIP
- [x] Resource detail page (hours, phone, eligibility, directions)
- [x] Map view integration (future enhancement — noted for next phase)

## Phase 6: Goal Engine
- [x] Auto-generate step-by-step life restoration plan from assessment
- [x] Goal progress tracking
- [x] Milestone celebrations
- [x] Goal reprioritization logic

## Phase 7: Calendar & Reminders
- [x] Appointment creation and management
- [x] Medication reminders
- [x] Court dates and program check-ins
- [x] Push notification system (future enhancement — noted for next phase)

## Phase 8: AI Counselor Chat
- [x] LLM-powered 24/7 supportive chat
- [x] Coping strategies and resource suggestions
- [x] Crisis signal detection with gentle escalation prompts
- [x] Chat history persistence

## Phase 9: Organization & Case Manager Portal
- [x] Org admin portal (add/update resources, manage org profile)
- [x] Case manager portal (monitor client progress with consent)
- [x] Client consent management for case manager visibility
- [x] Role-based dashboard separation

## Phase 10: Polish & Delivery
- [x] Apply Pathways 360 branding (colors, fonts, logo)
- [x] Mobile-responsive design throughout
- [x] Accessibility (large buttons, minimal text, clear navigation)
- [x] Final vitest coverage
- [x] Checkpoint and deliver live preview

## Phase 11: Map View & Push Notifications
- [x] Add map view tab to Resource Navigator with markers for each resource
- [x] Geocode resource addresses and show on map with info windows
- [x] Add schema column scheduleCronTaskUid to appointments table
- [x] Create tRPC mutation to schedule/cancel reminder heartbeat jobs per appointment
- [x] Add Express handler at /api/scheduled/appointment-reminder for cron callbacks
- [x] Mount /api/scheduled/appointment-reminder in server/_core/index.ts
- [x] Add reminder toggle UI in Calendar page with time selector (15min to 2 days before)
- [x] Store reminder job UIDs in appointments table; cancel job on appointment delete

## Phase 12: Provider Portal & Dynamic Resource Network (Phase 2 Expansion)
- [x] Expand DB schema: organizations, org_members, provider_roles, client_timelines, timeline_tasks, provider_messages, progress_milestones, resource_categories (35+)
- [x] Location-aware resource filtering by ZIP/city/county/state
- [x] 35+ resource categories in resource navigator
- [x] Organization Directory — self-service org listings with hours, phone, services, closures
- [x] Downloadable Resource Guide (text export by location/category filter)
- [x] Provider Portal with 13 role types and configurable permissions
- [x] Client timeline with tasks, due dates, priority, status, assigned staff, notes, attachments
- [x] Provider-to-client messaging (messages become tasks/reminders/appointments/goals/alerts on client dashboard)
- [x] Case Management Dashboard per provider (upcoming/missed appointments, tasks, milestones, risk alerts)
- [x] Progress tracking with 10 life milestones and visual indicators
- [x] Organization reporting UI (admin-only reports tab in Provider Portal)
- [x] HIPAA-aware consent and role-based data access controls
- [x] Wire all new tRPC routes and run tests
- [x] Fully enable backend Provider Portal with working login, client list, and role-based dashboard
- [x] Build provider-to-client communication system (compose, send, message types: task/reminder/appointment/goal/alert)
- [x] Build client inbox on dashboard showing messages from providers
- [x] Provider team communication (internal notes, handoffs between team members)
