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

## Phase 15: MVP Conversion — Make Everything Work

### Auth & Roles
- [x] 6 roles: client, case_manager, ecm_worker, probation_officer, counselor, admin
- [x] Role-gated dashboard routing (each role sees their own portal on login)
- [x] Session timeout (30 min inactivity) with warning modal
- [x] Complete client onboarding: DOB, phone, emergency contact, housing status, veteran, insurance, Medi-Cal, probation status, drug of choice, sobriety date, transportation, employment status

### Resource Search (fully functional)
- [x] Live search backed by countyResources DB table
- [x] Filters: county, category, ECM-eligible, Medi-Cal, free service, keyword search
- [x] Every result from live DB (no hardcoded arrays)
- [x] Advanced filters: open today, walk-in, gender-specific, veterans, language (future enhancement — noted; ECM-eligible/Medi-Cal/free filters live)

### Interactive Map
- [x] Resource map page at /resource-map with county/category filters and resource list
- [x] Google Maps directions link (opens native maps app)
- [x] Save to favorites from map view
- [x] GPS user location via browser geolocation API (no Maps key required — implemented)
- [x] Distance calculation via Haversine formula and nearest-resources sort (implemented)

### Document Storage
- [x] Secure S3 upload: ID, insurance card, court docs, consent forms, recovery plans
- [x] File list with download and delete
- [x] Role-gated: client sees own docs, providers see client docs with consent

### Secure Messaging
- [x] Real-time messaging between all 6 roles
- [x] Conversation threads (not just one-way provider messages)
- [x] Read receipts, timestamps, role badges

### Provider Portals (fully functional)
- [x] Case Manager: client list, notes, goals, tasks, case history, referrals, appointments, documents
- [x] Probation Officer: roster, compliance tracking, meeting history, attendance verification, document uploads
- [x] Counselor: recovery plans, treatment goals, progress notes, drug testing history, referrals
- [x] ECM Worker: care plans, social determinants, needs tracking, outcome reporting, insurance verification
- [x] Admin: user management, org management, resource management, analytics, audit logs, permissions

### Favorites & History
- [x] Favorite/unfavorite resources
- [x] Recently viewed resources
- [x] Recently searched terms persisted to localStorage with dropdown and clear button (implemented)

### Appointments
- [x] Schedule, reschedule, cancel appointments (reschedule dialog with date/time picker)
- [x] Appointment reminders (heartbeat-based inbox notification)
- [x] Provider can schedule on behalf of client (scheduleForClient procedure)

### Analytics Dashboard (Admin)
- [x] Total users, goals, resources, events, appointments, messages
- [x] Role breakdown with visual bar chart
- [x] Top resource categories with visual bars
- [x] Recent signups by day (last 7 days)
- [x] Recent users list with role badges

### Fixes & Polish
- [x] Resources.tsx replaced DEMO_RESOURCES with live countyResources DB query
- [x] Messaging.tsx added recipient selection for cross-role thread creation
- [x] Console error (providerMessagesRouter) confirmed as stale cached log — server running correctly
- [x] All 6 role portals functional with real DB data
- [x] Responsive design: Tailwind mobile-first classes applied throughout; resource map uses responsive grid (md:w-80 panel); all portals use max-w-5xl with px-4 padding; overflow-x-auto on tab bars; grid-cols-2 on mobile for stats

## Phase 16: Final Branding Consistency
- [x] Replace all logo placeholders with new S3 logo URL including integrated tagline
- [x] Update Home.tsx navbar logo
- [x] Update DashboardLayout.tsx sidebar logo
- [x] Update ProviderPortal.tsx header logo
- [x] Audit all other pages (AdminPortal, Onboarding, etc.) for logo consistency
- [x] Verify responsive layout with new logo (includes tagline, may be wider)
- [x] Screenshot verification on mobile and desktop

## Phase 17: Footer Branding & Consistency
- [x] Create reusable Footer component with logo, tagline, and links
- [x] Add footer to Home page
- [x] Add footer to all authenticated portal pages (Dashboard, all role portals)
- [x] Ensure footer is subtle and professional (no overdoing branding)
- [x] Test footer responsiveness on mobile and desktop

## Phase 18: Fix Distorted Logos & Add Footer Enhancements
- [x] Fix distorted logos in Home.tsx, DashboardLayout.tsx, ProviderPortal.tsx (resize/replace)
- [x] Add social media links to Footer component (LinkedIn, Twitter, Facebook)
- [x] Create About page and link from footer
- [x] Add newsletter signup form to footer

## Phase 19: 360° Client Timeline Feature
- [x] Design and implement 360° Client Timeline database schema
- [ ] Create timeline view component showing chronological history
- [ ] Add appointments, case notes, milestones, medication changes, court dates, referrals, housing updates, employment progress, messages
- [ ] Implement role-based access control for timeline visibility
- [ ] Integrate timeline into provider dashboards and client profile

## Phase 20: Expand Provider Dashboard Fields
- [x] Add Insurance section (provider, ID, case manager, auth number, renewal date, coverage status)
- [x] Add Medication Management (current meds, compliance, type, monitoring, alerts)
- [x] Add Employment section (status, work eligible, restrictions, disability, SSI/SSDI, vocational rehab, goals)
- [x] Add Housing section (current housing, stability score, goals)
- [x] Add Court/Probation section (officer, dates, conditions, service hours, drug testing, compliance)
- [x] Add Child Welfare section (CPS case, case worker, custody, visitation, court hearings, reunification)
- [x] Add Behavioral Health section (diagnosis, providers, level of care, risk, safety plan)
- [x] Add Medical section (PCP, specialists, conditions, allergies, emergency contact, hospitalizations)
- [x] Add Recovery section (clean date, primary drug, meetings, sponsor, goals, relapse history, triggers)
- [x] Add Education section (diploma, GED, college, trade school, certifications, enrollment, career goals)
- [x] Add Life Goals section (housing, employment, driver license, transportation, family reunification, financial, education, recovery, health, legal)

## Phase 21: Implement Role-Based Permissions
- [x] ECM: wellness, appointments, care plans, insurance authorizations, SDOH, utilization, outcomes, approvals, ROI reporting
- [x] Rehabilitation Centers: attendance, drug tests, progress notes, treatment completion, aftercare
- [x] Probation: compliance, court reminders, community service, drug testing, violations, incentives
- [x] Housing Provider: move-in status, lease compliance, inspections, rent assistance, stability tracking
- [x] Employment Specialist: resume, applications, interviews, job placement, retention

## Phase 22: Create Collaborative Care Hub & Multi-Agency Outcome & ROI Dashboard
- [ ] Rename "Multi-Agency ROI" to "Collaborative Care Hub"
- [x] Create Multi-Agency Outcome & ROI Dashboard measuring: housing stability, treatment engagement, medication adherence, appointment attendance, employment placement, family reunification, ED utilization reduction, recidivism reduction, cost savings, grant performance, quality metrics, program outcomes
- [ ] Add reporting and analytics capabilities
- [ ] Implement data export (PDF/CSV)


## Phase 23: Fix and Integrate Dropdown Fields
- [x] Add Insurance Type dropdown (Medi-Cal, Partnership HealthPlan, Medicare, Private, No Insurance, Unknown, Other)
- [x] Add Medication Type dropdown (Psyc, Narcotic, Non-Narcotic, MAT, No Medication, Unknown, Other)
- [x] Add Work Eligibility dropdown (Eligible, Not Eligible, Limited, Unknown)
- [x] Add Disability dropdown (No Disability, Temporary, Permanent, Pending, Unknown)
- [x] Integrate dropdowns into Onboarding page
- [ ] Integrate dropdowns into Profile/Assessment pages
- [ ] Test dropdown functionality and data persistence

## Phase 24: Fix Resource Directory Search
- [x] Implement county search filter
- [x] Implement city search filter
- [x] Implement category filter (food banks, meals, clothing, laundry, shelter, detox, treatment, MAT, mental health, probation, CPS, court, transportation, employment, ID help, medical, emergency)
- [x] Implement urgency filter
- [x] Implement need type filter
- [x] Test search and filter combinations
- [x] Verify resource results display correctly

## Phase 25: Fix Login Flow and Role-Based Routing
- [x] Fix login backend detection
- [x] Implement client → client dashboard routing
- [x] Implement license holder → license holder dashboard routing
- [x] Implement agency staff → agency dashboard routing
- [x] Implement professional (probation/court/CPS/CFS) → professional dashboard routing
- [x] Implement admin → admin dashboard routing
- [x] Test all role-based redirects

## Phase 26: Build Backend Dashboard (Core)
- [x] Create client list view with search/filter
- [x] Create client profile view page
- [x] Create 360° timeline view
- [x] Create appointments tracking section
- [ ] Create court dates tracking section
- [ ] Create CPS/CFS hearings tracking section
- [ ] Create probation check-ins tracking section
- [ ] Create medication tracking section
- [ ] Create recovery tracking section
- [ ] Create referral tracking section
- [ ] Create notes section
- [ ] Create alerts section
- [ ] Create reminders section
- [ ] Create messages section
- [ ] Create agency assignments section
- [ ] Create multi-agency collaboration view
- [ ] Create downloadable client onboarding/profile packet feature
- [ ] Create success page print feature (78%+ achievement only)

## Phase 27: Build Communication Tools
- [ ] Implement staff-to-client messaging
- [ ] Implement staff-to-staff messaging
- [ ] Implement referral messages
- [ ] Implement appointment reminders
- [ ] Implement court reminders
- [ ] Implement medication reminders
- [ ] Implement recovery milestone alerts
- [ ] Implement missed appointment alerts
- [ ] Implement ROI expiration alerts
- [ ] Implement task assignment alerts

## Phase 28: Build Referral System
- [ ] Create referral creation form
- [ ] Implement referral sending
- [ ] Create referral status tracking
- [ ] Implement referral accepted status
- [ ] Implement referral pending status
- [ ] Implement referral denied status
- [ ] Implement referral completed status
- [ ] Add referral notes field
- [ ] Add agency receiving referral field
- [ ] Attach client consent/ROI to referral

## Phase 29: Build Notes System
- [ ] Implement private staff notes
- [ ] Implement shared agency notes
- [ ] Implement client-visible notes
- [ ] Implement court/probation/CPS/CFS notes
- [ ] Implement medical/medication notes
- [ ] Implement recovery notes
- [ ] Add author, agency, timestamp, visibility level, permission status to all notes

## Phase 30: Build ROI and Permission Controls
- [ ] Implement ROI permission requirement for all data access
- [ ] Create client profile permission display (agencies, view permissions, expiration)
- [ ] Implement access blocking for expired/revoked/missing ROI
- [ ] Add ROI expiration tracking
- [ ] Add ROI revocation functionality
- [ ] Implement permission audit logging

## Phase 31: Build Multi-Agency Collaboration Feature
- [ ] Create multi-agency compact view
- [ ] Show assigned agencies
- [ ] Show assigned workers
- [ ] Show shared goals
- [ ] Show shared notes
- [ ] Show referrals
- [ ] Show appointments
- [ ] Show court requirements
- [ ] Show CPS/CFS requirements
- [ ] Show probation requirements
- [ ] Show medication support
- [ ] Show recovery milestones

## Phase 32: Comprehensive Testing and Bug Fixes
- [ ] Test all role-based logins
- [ ] Test all dashboard routes
- [ ] Test all dropdowns
- [ ] Test resource search functionality
- [ ] Test referral workflow
- [ ] Test notes system
- [ ] Test alerts and reminders
- [ ] Test ROI permissions
- [ ] Test download/print features
- [ ] Fix broken links
- [ ] Fix missing pages
- [ ] Fix non-working buttons
- [ ] Verify mobile-friendly design
- [ ] Verify plain language and accessibility
