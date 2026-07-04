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

## Phase 13: Multi-Agency ROI Collaboration & County Resource Directory

### Multi-Agency Shared Client Record
- [x] DB schema: clientAgencyEnrollments, sharedProgressNotes, clientGapFlags, resourceRecommendations, countyResources, progressMilestones
- [x] tRPC multiAgency.getSharedClientRecord — unified profile visible to all enrolled agencies
- [x] tRPC multiAgency.addNote — cross-agency notes with visibility control
- [x] tRPC multiAgency.flagGap / resolveGap — flag and resolve client care gaps
- [x] tRPC multiAgency.enrollClient / getClientEnrollments — multi-agency enrollment

### Provider Shared Client Profile View
- [x] SharedClientProfile page: all-agency milestone grid, cross-agency notes feed, gap flags panel, enrolled agencies list
- [x] Gap flags displayed as colored severity badges with one-click resolve
- [x] All-agency notes feed with type, visibility, timestamp
- [x] Milestone grid showing 10 life milestones
- [x] Wired into ProviderPortal client detail view

### Resource Recommendation Engine
- [x] tRPC recommendations.getForClient — reads assessment + gap flags → scored resource matches
- [x] tRPC recommendations.sendReminder — sends resource to client inbox as a provider message reminder
- [x] Provider Portal: Recommended Resources panel with one-click Send to Client
- [x] Client Dashboard: resource reminders appear in inbox

### 6-County Northern California Resource Directory
- [x] 85 real resources seeded: Butte, Shasta, Trinity, Tehama, Humboldt, Siskiyou
- [x] Categories: Emergency Shelter, STPH, Recovery Housing, MAT, AA/NA, ECM, Mental Health, Employment, Education, Food Bank, Legal Aid, Reentry, Veterans, DV, Benefits, Peer Support
- [x] CountyDirectory page with county/category/keyword filters, ECM/Medi-Cal/Free toggles
- [x] By-County and By-Category views
- [x] Download Guide button (formatted text export)
- [x] County Directory linked from Dashboard quick actions

## Phase 14: Real-Time Community Opportunity & Resource Intelligence (Phase 3)

### Schema & Backend
- [x] DB: communityEvents table (title, type, county, date, time, location, org, verifiedAt, confidenceLevel, isActive, needsCategories)
- [x] DB: userServiceAreas table (userId, county, areaType: residence/probation/services/travel)
- [x] DB: eventEngagement table (userId, eventId, action: viewed/saved/attended)
- [x] tRPC: communityEvents.list (filter by county, date, category, verified)
- [x] tRPC: communityEvents.submit (provider submits new opportunity)
- [x] tRPC: communityEvents.verify (admin/provider marks verified)
- [x] tRPC: dailyFeed.get (personalized feed: today's events + appointments + provider messages + goals)
- [x] tRPC: serviceAreas.get / set (user's multi-county service areas)
- [x] Seed 41 community events across 6 counties with varied types and dates

### Daily Community Feed Page
- [x] Personalized feed page at /daily-feed showing today's opportunities
- [x] Sections: Today's Meals, Shelters, Transport, Appointments, Reminders, Jobs, Free Resources, Provider Messages
- [x] Context-aware priority ordering (homeless profile → shelter/meals first; reentry → probation/ID/benefits first)
- [x] Verification badges (Verified Today / Verified This Week / Pending)
- [x] Save/engage action on each event

### Live Community Events Board
- [x] Events board at /community-events with date, county, category filters
- [x] Event cards with type icon, time, location, verification status, org name
- [x] Category quick-filter strip (Meals, Shelter, Medical, Jobs, Recovery, Legal, etc.)

### Provider Opportunity Submission
- [x] Provider Portal: "Submit Opportunity" dialog (title, type, date/time, location, county, description, contact)
- [x] Submitted events appear as "Pending Verification" until confirmed

### Intelligent Notifications & Service Areas
- [x] Service area selector in user profile/onboarding (multi-county, area type)
- [x] Daily feed filtered to user's service areas only
- [x] Smart context matching: homeless profile → shelter/meals/medical priority; reentry → probation/ID/benefits; job search → employment events
- [x] Dashboard quick actions: Today's Feed + Community Events added
- [x] Add verified/confidence filter to communityEvents.list and Community Events UI (Verified Only toggle)
- [x] Add Submit Opportunity dialog inside ProviderPortal.tsx (CalendarPlus button in header)
