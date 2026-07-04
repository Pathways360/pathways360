# Pathways 360: Client Dashboard Features & Functionality

## Overview
The Client Dashboard is a personalized life restoration platform designed for individuals in recovery, reentry, housing insecurity, or life transition. It combines AI coaching, resource navigation, goal tracking, and real-time support to empower users to take control of their journey.

**Target Users:**
- Individuals experiencing homelessness or housing insecurity
- People in recovery from substance use
- Reentry population (post-incarceration)
- Individuals with mental health challenges
- Anyone seeking employment, education, or social services
- Veterans, domestic violence survivors, and other vulnerable populations

---

## Core Dashboard Features

### 1. **Today's Plan Widget**
**Purpose:** Provide a daily roadmap and reduce decision paralysis.

**Functionality:**
- Displays today's date, weather (future enhancement), and mood check-in prompt
- Shows 3-5 prioritized items for the day:
  - Upcoming appointments (with time, provider name, location)
  - Active goals with today's milestone
  - Medication/recovery reminders
  - Provider messages and task assignments
  - Community events matching user's profile and service area
- One-click actions: "Mark Done," "Reschedule," "Get Directions"
- Color-coded by urgency (red = critical, yellow = important, green = routine)

**Integration:**
- Pulls from: appointments, goals, reminders, provider messages, community events
- Syncs with: provider task assignments, medication schedules, probation check-ins

---

### 2. **Active Goals Summary**
**Purpose:** Keep life restoration goals visible and motivating.

**Functionality:**
- Shows 3-5 most active goals (housing, employment, recovery, education, family)
- For each goal:
  - Progress bar (% complete based on milestones)
  - Current milestone name and due date
  - Next action step
  - Provider assigned (if applicable)
  - "View Full Goal" link to detailed goal page
- Celebration notification when milestone is reached
- Quick-add button to create a new goal

**Integration:**
- Syncs with: goal engine, provider notes, milestone tracking
- Triggers: provider notifications when goals are updated

---

### 3. **Upcoming Appointments Widget**
**Purpose:** Never miss a critical appointment (medical, probation, court, program).

**Functionality:**
- Shows next 3-5 appointments in chronological order
- For each appointment:
  - Date, time, provider/location name
  - Type badge (medical, probation, court, program, counseling, etc.)
  - Appointment notes/instructions
  - "Get Directions" button (opens Google Maps)
  - "Reschedule" button (opens date/time picker)
  - "Add to Calendar" (exports to device calendar)
- Reminders: notification 24 hours before, 2 hours before, and 15 minutes before
- Missed appointment alert (red banner) if user doesn't check in

**Integration:**
- Syncs with: provider calendars, probation system, court dates
- Triggers: SMS/push reminders, provider notifications of no-shows

---

### 4. **Daily Message from Life Coach**
**Purpose:** Provide personalized motivation, coping strategies, and gentle accountability.

**Functionality:**
- AI-generated message based on user's profile, goals, and recent activity
- Includes:
  - Personalized greeting with user's name and coach's avatar
  - Motivational message tailored to user's current challenges
  - Coping strategy or actionable tip
  - Resource suggestion or goal milestone reminder
  - Devotional (if opted in during onboarding)
- User can "React" (heart, thumbs up, etc.) or "Reply" to start a chat
- Message history available in Coach Chat page

**Integration:**
- Powered by: LLM (built-in Forge API)
- Personalized by: user's assessment, goals, recent messages, provider notes
- Triggers: daily at 8 AM (user's timezone)

---

### 5. **Provider Messages Inbox**
**Purpose:** Receive task assignments, reminders, and resource recommendations from case managers, counselors, and other providers.

**Functionality:**
- Shows unread message count badge
- Message list displays:
  - Provider name and role (Case Manager, ECM Worker, Counselor, etc.)
  - Message type icon (task, reminder, appointment, goal, alert, resource)
  - Message preview text
  - Timestamp (e.g., "2 hours ago")
  - Unread indicator (blue dot)
- Click to open full message with:
  - Full text content
  - Action buttons (if applicable): "Mark Done," "Reschedule," "Add to Favorites"
  - "Mark as Read" / "Archive" / "Delete"
- Message types:
  - **Task:** "Complete your job application by Friday"
  - **Reminder:** "Your AA meeting is tomorrow at 7 PM"
  - **Appointment:** "New appointment scheduled: Mental health eval on 7/15"
  - **Goal:** "Your housing goal milestone is due today"
  - **Alert:** "Your probation officer wants to schedule a meeting"
  - **Resource:** "We found a free counseling service near you that specializes in trauma"

**Integration:**
- Syncs with: provider portal (case managers send messages)
- Triggers: notifications when new message arrives

---

### 6. **Quick Action Buttons**
**Purpose:** Fast access to the most-used features.

**Functionality:**
- Sticky buttons on dashboard (or bottom nav on mobile):
  - **Find Resources:** Jump to Resource Navigator (filtered by user's service area and profile)
  - **Chat with Coach:** Open AI Counselor chat
  - **Add Appointment:** Quick-schedule a new appointment
  - **View Daily Feed:** See today's community events and opportunities
  - **Message Provider:** Start a new conversation with assigned case manager
  - **View Documents:** Access uploaded ID, insurance, court docs

---

## Secondary Features Accessible from Dashboard

### 7. **Resource Navigator**
**Purpose:** Discover and access services matching user's needs and location.

**Functionality:**
- **Search:** Keyword search across 85+ county resources
- **Filters:** County, category (shelter, food, employment, mental health, etc.), ECM-eligible, Medi-Cal accepted, free services
- **Smart Sorting:** 
  - By distance (uses browser geolocation)
  - By relevance to user's profile (homeless profile shows shelters first, reentry profile shows probation support first)
- **Resource Detail View:**
  - Name, address, phone, website, hours
  - Description and services offered
  - Eligibility requirements
  - Acceptance status (accepting clients, waitlist, not accepting)
  - Badges: ECM-eligible, Medi-Cal accepted, free, gender-specific, veteran-specific, family-friendly
  - "Get Directions" (Google Maps)
  - "Call" (phone link)
  - "Save to Favorites"
  - "Share" (SMS/email)
- **Interactive Map:** Browse resources on map, see distance in miles, nearest-first sorting
- **Recently Viewed:** Quick access to resources you've looked at before
- **Favorites:** Save and organize favorite resources by category

**Integration:**
- Syncs with: county resource database (85 organizations across 6 counties)
- Triggers: provider recommendations appear here as "suggested resources"

---

### 8. **Goals & Life Milestones**
**Purpose:** Track progress toward 10 major life restoration milestones.

**Functionality:**
- **10 Life Milestones:**
  1. Stable Housing
  2. Employment/Income
  3. Physical Health
  4. Mental Health
  5. Substance Use Recovery
  6. Legal/Probation Compliance
  7. Education/Skills
  8. Family/Relationships
  9. Financial Stability
  10. Community Engagement

- **For Each Milestone:**
  - Visual progress indicator (0-100%)
  - Sub-goals (e.g., Housing = "Find shelter" → "Get into transitional program" → "Secure permanent housing")
  - Milestone due date
  - Assigned provider (case manager, counselor, etc.)
  - Notes and attachments from provider
  - Recent activity feed (provider updates, user check-ins)
  - "Mark Milestone Complete" button (triggers celebration and next milestone)

- **Goal Creation:**
  - Auto-generated from assessment (system suggests goals based on needs)
  - Manual creation (user can add custom goals)
  - Goal wizard: name, category, due date, why it matters, first action step

- **Progress Tracking:**
  - Visual dashboard showing all 10 milestones at a glance
  - Completion percentage for each
  - Color coding: red (at risk), yellow (in progress), green (on track)
  - Celebration animations when milestones are reached

**Integration:**
- Syncs with: provider notes, assessment data, appointment history
- Triggers: provider notifications when user completes a milestone

---

### 9. **Calendar & Appointments**
**Purpose:** Manage all appointments, reminders, and important dates in one place.

**Functionality:**
- **Calendar View:**
  - Month view with color-coded appointment types
  - Week view for detailed time slots
  - Day view for detailed schedule
  - Appointments from all providers (medical, probation, court, program, counseling)

- **Appointment Management:**
  - Create new appointment (manual or provider-scheduled)
  - Reschedule: pick new date/time, system checks availability
  - Cancel: with optional reason/note to provider
  - Add notes: "Don't forget insurance card," "Need transportation"
  - Set reminders: 24 hours, 2 hours, 15 minutes before

- **Appointment Types:**
  - Medical (doctor, dentist, mental health)
  - Probation/Parole check-in
  - Court date
  - Program (recovery, employment, education)
  - Counseling/therapy
  - Case management meeting
  - Recovery meeting (AA/NA)

- **Check-In:**
  - Mark "Attended" or "Missed" after appointment
  - Provider gets notification of attendance
  - Missed appointments trigger alert to case manager

**Integration:**
- Syncs with: provider calendars, probation system, court records
- Triggers: reminders, provider notifications, compliance tracking

---

### 10. **AI Counselor Chat (24/7 Support)**
**Purpose:** Provide immediate, confidential support for coping strategies, crisis de-escalation, and resource suggestions.

**Functionality:**
- **Always Available:** Chat with AI counselor anytime, day or night
- **Conversation Types:**
  - Coping strategies: "I'm feeling anxious right now"
  - Crisis support: gentle de-escalation, crisis hotline numbers
  - Goal support: "How do I find a job?"
  - Resource suggestions: "Where can I get food tonight?"
  - General support: listening, validation, encouragement

- **Features:**
  - Natural language understanding (understands colloquial language, slang)
  - Crisis signal detection: if user mentions self-harm or suicide, system:
    - Provides immediate crisis resources (988 Suicide & Crisis Lifeline, Crisis Text Line)
    - Notifies assigned case manager (with user consent)
    - Offers to connect with human counselor
  - Coping strategy suggestions: breathing exercises, grounding techniques, positive affirmations
  - Resource recommendations based on conversation context
  - Chat history: user can review past conversations

- **Safety:**
  - No judgment, confidential (except crisis situations)
  - Clear disclaimer: "This is not a substitute for professional help"
  - Easy escalation to human support

**Integration:**
- Powered by: LLM (built-in Forge API with crisis detection)
- Triggers: crisis alerts to case manager if self-harm/suicide mentioned

---

### 11. **Daily Community Feed**
**Purpose:** Show time-sensitive opportunities (meals, shelter, jobs, events) matched to user's profile and location.

**Functionality:**
- **Personalized Feed:**
  - Filtered by user's service areas (counties they frequent)
  - Sorted by relevance to user's profile:
    - Homeless profile: shelter, meals, medical, transport first
    - Reentry profile: probation support, ID services, employment first
    - Job-seeking profile: employment, education, transportation first
  - Shows today's and upcoming week's opportunities

- **Event Types:**
  - Meals: free breakfast, lunch, dinner at specific times/locations
  - Shelter: emergency shelter, transitional housing openings
  - Medical: free clinics, vaccination events
  - Employment: job fairs, hiring events, interview prep
  - Recovery: AA/NA meetings, recovery workshops
  - Legal: legal aid clinics, ID services
  - Transportation: free transit passes, ride programs
  - Education: GED classes, job training, skill-building

- **Event Card Shows:**
  - Event title and type (with icon)
  - Time and location
  - Organization name
  - Verification badge (Verified Today, Verified This Week, Pending)
  - "Add to My Day" button (adds to today's plan)
  - "Get Directions" button
  - "Save" button (saves to favorites)

- **Smart Matching:**
  - System learns from user's past engagement (which events they attended)
  - Boosts similar events in feed
  - Learns time preferences (morning vs. evening events)

**Integration:**
- Syncs with: community events database (41 seeded events across 6 counties)
- Triggers: new matching events sent as provider messages to inbox

---

### 12. **Document Storage & Management**
**Purpose:** Securely store and organize critical documents (ID, insurance, court docs, consent forms).

**Functionality:**
- **Secure Upload:**
  - Upload documents to S3 (encrypted, HIPAA-compliant)
  - Supported formats: PDF, JPG, PNG, DOC, DOCX
  - Max file size: 10 MB per document
  - Drag-and-drop or file picker upload

- **Document Types:**
  - ID (driver's license, state ID, passport)
  - Insurance (health insurance card, Medi-Cal card)
  - Court documents (sentencing, probation order, court date notice)
  - Consent forms (provider access, data sharing)
  - Medical records
  - Recovery plans
  - Employment documents (resume, job offer letter)
  - Education documents (transcripts, GED certificate)

- **Document Management:**
  - View document (PDF viewer or image viewer)
  - Download document
  - Delete document
  - Add notes to document ("Expires 3/2025")
  - Share with provider (one-click, provider gets notification)
  - Privacy controls: choose which providers can see which documents

- **Expiration Alerts:**
  - System tracks expiration dates (ID, insurance, probation order)
  - Sends reminder 30 days before expiration
  - Flags expired documents in red

**Integration:**
- Syncs with: S3 storage, provider access controls
- Triggers: provider notifications when documents are shared

---

### 13. **Favorites & Recently Viewed**
**Purpose:** Quick access to frequently used resources and services.

**Functionality:**
- **Favorites:**
  - Save resources, events, or providers to favorites
  - Organize into custom folders (e.g., "My Shelters," "Job Resources," "Medical")
  - Quick access from dashboard
  - Share favorite list with provider

- **Recently Viewed:**
  - Automatically tracks resources, events, and pages viewed
  - Shows last 20 items
  - One-click to revisit

---

### 14. **Profile & Settings**
**Purpose:** Manage personal information, preferences, and privacy controls.

**Functionality:**
- **Profile Information:**
  - Name, date of birth, phone, email
  - Emergency contact (name, phone, relationship)
  - Housing status (homeless, transitional, permanent)
  - Veteran status
  - Insurance (Medi-Cal, private, uninsured)
  - Probation/parole status
  - Drug of choice (for recovery tracking)
  - Sobriety date
  - Transportation access (car, public transit, walking)
  - Employment status (employed, unemployed, student, disabled)

- **Service Areas:**
  - Select counties where user lives/works/receives services
  - Used to filter resources and community events
  - Can update anytime

- **Preferences:**
  - Coach avatar and name
  - Devotionals on/off
  - Notification preferences (SMS, email, in-app)
  - Language preference (future: Spanish, Vietnamese, etc.)
  - Accessibility settings (font size, high contrast, etc.)

- **Privacy & Consent:**
  - View which providers have access to your data
  - Grant/revoke provider access
  - Download your data (GDPR/CCPA compliance)
  - Delete account (with 30-day confirmation period)

---

## Integration Points: How Client Dashboard Connects to Provider Portal

1. **Provider Messages:** Providers send tasks, reminders, resources → appear in client inbox
2. **Appointments:** Providers schedule appointments → appear on client calendar
3. **Goals:** Providers create/update goals → appear on client goals page
4. **Documents:** Client uploads documents → providers can access (with permission)
5. **Shared Client Record:** Providers see client's milestones, notes, and gap flags → can send targeted resources
6. **Resource Recommendations:** Providers recommend resources → appear in client inbox as suggestions
7. **Compliance Tracking:** Probation officer marks attendance → client sees compliance status
8. **Crisis Alerts:** If client mentions self-harm in chat → case manager is notified

---

## Key Differentiators

- **Personalization:** Every feature adapts to user's profile (homeless, reentry, job-seeking, recovery)
- **Multi-Agency Collaboration:** Clients can see all their providers in one place, reducing confusion
- **Empowerment:** User controls their data, goals, and provider access
- **Accessibility:** Mobile-first design, high contrast, large fonts, simple language
- **24/7 Support:** AI coach and counselor always available
- **Real-Time Opportunities:** Daily feed shows time-sensitive events matched to user's needs
- **HIPAA Compliance:** All data encrypted, role-based access, audit logs

---

## Success Metrics

- **Engagement:** % of users checking in daily, weekly, monthly
- **Goal Completion:** % of milestones reached within target timeframe
- **Resource Access:** # of resources viewed, favorited, visited
- **Appointment Attendance:** % of appointments attended (vs. missed)
- **Provider Collaboration:** # of providers per client, # of shared notes/goals
- **User Satisfaction:** NPS score, feedback surveys, retention rate
- **Outcomes:** Housing stability, employment, recovery, legal compliance, family reunification

