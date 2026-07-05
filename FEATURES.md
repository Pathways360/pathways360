# Pathways 360 - Complete Feature Guide

## Quick Start

**Login Credentials for Testing:**
- **Client**: Email: client@test.com | Role: Client
- **Case Manager**: Email: cm@test.com | Role: Case Manager
- **Provider (Doctor)**: Email: doctor@test.com | Role: Doctor
- **Provider (Counselor)**: Email: counselor@test.com | Role: Counselor
- **Provider (Probation Officer)**: Email: probation@test.com | Role: Probation Officer
- **Admin**: Email: admin@test.com | Role: Admin

---

## CLIENT FEATURES

### 1. **Dashboard** (`/dashboard`)
- **Today's Plan Widget**: Shows daily schedule and goals
- **Upcoming Appointments**: Next 7 days of scheduled appointments
- **Active Goals Summary**: Current life restoration goals with progress
- **Daily Message from Life Coach**: Personalized motivational message
- **Quick Action Buttons**: Find Resources, Chat with Coach, Add Appointment

### 2. **Multi-Step Assessment** (`/onboarding`)
- **Step 1 - Housing**: Current housing status, stability score, goals
- **Step 2 - Employment**: Work status, eligibility, disability status, SSI/SSDI
- **Step 3 - Health**: Insurance type, medications, medical conditions, allergies
- **Step 4 - Legal**: Probation status, court dates, drug testing, CPS involvement
- **Step 5 - Recovery**: Sobriety date, support groups, recovery goals, milestones
- **Step 6 - Identity**: Personal info, emergency contact, veteran status
- **Step 7 - Family**: Family relationships, custody, visitation, reunification goals
- **Step 8 - Goals**: Life restoration priorities, timeline, support needed

### 3. **AI Life Coach** (`/dashboard`)
- **Coach Avatar**: Diverse avatar selection during setup
- **Daily Check-ins**: Personalized messages based on assessment
- **Motivational Messages**: Goal-based coaching conversations
- **Devotionals Toggle**: Opt-in daily inspirational messages (off by default)

### 4. **AI Counselor Chat** (`/chat`)
- **24/7 Support**: LLM-powered conversational support
- **Crisis Detection**: Identifies crisis signals and escalates gently
- **Coping Strategies**: Provides evidence-based coping techniques
- **Resource Suggestions**: Recommends relevant resources based on conversation
- **Chat History**: Persistent conversation history

### 5. **Resource Navigator** (`/resources`)
- **85+ Real Resources**: Shelters, food banks, legal aid, recovery, employment, medical, mental health
- **6-County Coverage**: Butte, Shasta, Trinity, Tehama, Humboldt, Siskiyou
- **Filters**: Category, location/ZIP, ECM-eligible, Medi-Cal, free services
- **Resource Details**: Hours, phone, eligibility, directions, verification status
- **Favorites**: Save and manage favorite resources
- **Search History**: Recently searched terms with dropdown

### 6. **Interactive Map** (`/resource-map`)
- **Google Maps Integration**: View resources on map with markers
- **GPS Location**: User's current location (browser geolocation)
- **Distance Calculation**: Shows nearest resources first
- **Directions**: One-click directions to native maps app
- **County/Category Filters**: Refine map view by location and type

### 7. **Calendar & Appointments** (`/calendar`)
- **Schedule Appointments**: Create new appointments with date/time
- **Reschedule**: Modify existing appointment details
- **Cancel**: Remove appointments with confirmation
- **Reminders**: Set appointment reminders (15 min to 2 days before)
- **Medication Reminders**: Track medication schedules
- **Court Dates**: Track court appearances and hearings
- **Program Check-ins**: Schedule and track required program visits

### 8. **Goal Engine** (`/goals`)
- **Auto-Generated Plans**: Life restoration plan from assessment
- **Goal Progress Tracking**: Visual progress indicators (0-100%)
- **Milestone Celebrations**: Achievements and milestones
- **Goal Reprioritization**: Adjust goal order and focus
- **10 Life Milestones**: Housing, employment, health, recovery, family, legal, education, financial, identity, community

### 9. **Community Events Board** (`/community-events`)
- **Daily Personalized Feed** (`/daily-feed`): Today's opportunities by context
- **Events by Category**: Meals, shelters, transport, jobs, recovery, legal, medical
- **Verification Badges**: Verified Today / This Week / Pending
- **Service Area Filtering**: Multi-county service area selection
- **Save/Engage**: Track and save events

### 10. **Secure Document Storage** (`/documents`)
- **Upload Documents**: ID, insurance card, court docs, consent forms, recovery plans
- **S3 Storage**: Secure cloud storage with encryption
- **Download/Delete**: Manage uploaded files
- **Role-Based Access**: Clients see own docs, providers see with consent

### 11. **Messaging** (`/messages`)
- **Conversation Threads**: Multi-message conversations with providers
- **Read Receipts**: See when messages are read
- **Timestamps**: Message timestamps and delivery status
- **Role Badges**: Identify message sender role
- **Message Types**: Tasks, reminders, appointments, goals, alerts

---

## PROVIDER FEATURES

### 1. **Provider Portal** (`/provider-portal`)
- **Role-Based Dashboards**: 13 provider role types with custom views
- **Client List**: Search, filter by status, risk level, last contact
- **Quick Stats**: Active clients, pending tasks, alerts, messages

### 2. **Client Profile** (`/provider-portal/client/:id`)
- **360° Timeline**: Chronological view of all client activities
- **Insurance Section**: Provider, ID, case manager, auth number, renewal date
- **Medication Management**: Current meds, compliance %, type, monitoring, alerts
- **Employment Section**: Status, work eligibility, disability, SSI/SSDI, vocational rehab
- **Housing Section**: Current housing, stability score, goals
- **Court/Probation Section**: Officer, dates, conditions, service hours, drug testing
- **Child Welfare Section**: CPS case, case worker, custody, visitation, reunification
- **Behavioral Health Section**: Diagnosis, providers, level of care, risk, safety plan
- **Medical Section**: PCP, specialists, conditions, allergies, hospitalizations
- **Recovery Section**: Sobriety date, support groups, milestones, relapse prevention

### 3. **Provider Onboarding** (`/provider-onboarding`)
- **Step 1 - Organization**: Agency name, address, contact info
- **Step 2 - Professional Info**: License number, county/area dropdown, admin passcode (ADMIN123 for demo)
- **Step 3 - Client Search**: Search clients by name, ID, phone with results showing DOB and current providers
- **Step 4 - Verification**: License verification (LIC prefix = verified, PND = pending, ADMIN123 = demo)
- **Step 5 - Dashboard Access**: Multi-role ROI dashboard with role-specific metrics

### 4. **Multi-Role ROI Dashboard** (`/provider-portal/roi-dashboard`)
- **Doctor ROI Tab**: Appointment attendance %, medication adherence %, health outcomes, cost savings
- **Counselor ROI Tab**: Treatment engagement %, recovery milestones, relapse prevention, progress tracking
- **Case Manager ROI Tab**: Housing stability %, employment placement %, multi-agency coordination, outcomes
- **ECM Worker ROI Tab**: Social determinants addressed, insurance verification, benefit enrollment, care plan compliance
- **Probation Officer ROI Tab**: Compliance rate %, recidivism reduction %, court date attendance, drug testing results
- **Multi-Agency ROI Tab**: Combined outcomes, inter-agency compact metrics, shared client progress
- **Comparison Charts**: Individual vs. agency vs. multi-agency benchmarks
- **Export Reports**: PDF/CSV export by date range, client, or outcome category

### 5. **Dashboard Sections** (visible in provider portal)

#### **Appointments Tracking**
- Upcoming appointments with date, time, provider, location
- Past appointments with completion status
- Add/reschedule/cancel appointments
- Appointment reminders and confirmations

#### **Court Dates Tracking**
- Upcoming court hearings with judge, case number, location
- Court documents and preparation status
- Past court appearances with outcomes
- Court order tracking

#### **Medication Tracking**
- Active medications with dosage, frequency, start date
- Medication compliance percentage
- Side effects and monitoring
- Refill tracking and reminders

#### **Recovery Tracking**
- Sobriety counter (days/months/years)
- Recovery milestones with dates
- Support group attendance
- Relapse prevention progress

#### **Referral Tracking**
- Pending referrals (awaiting response)
- Active referrals (accepted, in progress)
- Completed referrals (successfully resolved)
- Denied referrals (rejected with reason)
- Referral notes and agency information
- ROI and consent tracking

#### **Notes Section**
- **Private Staff Notes**: Only visible to staff
- **Shared Agency Notes**: Visible to all agencies
- **Client-Visible Notes**: Visible to client
- **Note Types**: Court, probation, CPS/CFS, medical, recovery, general
- **Metadata**: Author, agency, timestamp, visibility level, permission status

#### **Alerts Section**
- **Critical Alerts**: Red (high-risk situations, immediate action needed)
- **High Alerts**: Orange (urgent issues, action within 24 hours)
- **Medium Alerts**: Yellow (important issues, action within 1 week)
- **Low Alerts**: Gray (informational, routine follow-up)
- **Alert Types**: High-risk, missed appointments, compliance issues, ROI expiration, task assignments
- **Action Tracking**: Mark as acknowledged, resolved, or escalated

#### **Reminders Section**
- **Pending Reminders**: Not yet sent
- **Sent Reminders**: Delivered to client
- **Acknowledged Reminders**: Client confirmed receipt
- **Reminder Types**: Appointments, court dates, medications, recovery milestones, tasks
- **Scheduling**: Set frequency (once, daily, weekly, monthly)
- **Customization**: Add notes and priority level

### 6. **Messaging** (`/provider-portal/messages`)
- **Staff-to-Client Messaging**: Send tasks, reminders, appointments, goals, alerts
- **Staff-to-Staff Messaging**: Internal team communication and handoffs
- **Conversation Threads**: Multi-message conversations with read receipts
- **Message Types**: Task, reminder, appointment, goal, alert
- **Message History**: Persistent conversation history

### 7. **Referral Management** (`/provider-portal/referrals`)
- **Create Referral**: Select client, receiving agency, service type, notes
- **Send Referral**: Submit to receiving agency with ROI/consent verification
- **Status Tracking**: Pending → Accepted/Denied → Completed/Closed
- **Referral Notes**: Add notes and attachments
- **Agency Assignment**: Specify receiving agency and worker
- **ROI Verification**: Confirm client consent/ROI before sending

### 8. **Client Search** (`/provider-portal/client-search`)
- **Search Criteria**: Name, ID, phone, email, DOB
- **Advanced Filters**: Status (active/inactive), risk level, last contact date, assigned provider
- **Search Results**: Client name, DOB, current providers, status, risk level
- **Quick Actions**: View profile, add to caseload, send message

---

## MULTI-AGENCY FEATURES

### 1. **Shared Client Profile** (`/shared-client-profile/:id`)
- **All-Agency Milestone Grid**: 10 life milestones visible to all agencies
- **Cross-Agency Notes Feed**: Notes from all enrolled agencies
- **Gap Flags Panel**: Care gaps identified by any agency (severity badges)
- **Enrolled Agencies List**: All agencies working with client
- **Unified Profile**: Single source of truth for client data

### 2. **Collaborative Care Hub** (`/collaborative-care-hub`)
- **Multi-Agency ROI Dashboard**: Combined outcomes across all providers
- **Inter-Agency Compact Metrics**: Shared goals and progress
- **Shared Client Progress**: Unified view of all client achievements
- **Reports & Export Tab**: 
  - Collaborative Outcomes Report (PDF/CSV)
  - Multi-Agency ROI Analysis (PDF/CSV)
  - Client Care Summary (PDF/CSV)
  - Agency Performance Report (PDF/CSV)

### 3. **Multi-Agency Collaboration View** (`/provider-portal/collaboration/:id`)
- **Assigned Agencies**: List of all agencies working with client (5+ agencies)
- **Assigned Workers**: Staff members from each agency with contact info
- **Shared Goals**: Goals with progress tracking (0-100%), target dates, status
- **Shared Notes**: Coordination notes visible to all agencies
- **Inter-Agency Compacts**: 
  - Confidentiality & Data Sharing agreement
  - Coordinated Care Planning (monthly meetings)
  - Shared Outcome Metrics reporting

### 4. **Permissions Display** (`/provider-portal/permissions/:id`)
- **Active Permissions**: Valid ROI with access levels (view/edit/admin)
- **Expired Permissions**: ROI expired, needs renewal
- **Pending Permissions**: Awaiting ROI signature
- **Revoked Permissions**: Access removed by client
- **Access Levels**:
  - View Only: Read-only access to client data
  - Edit: Can view and modify client data
  - Admin: Full access including permission management
- **Data Access Types**: Profile, timeline, appointments, medications, notes, referrals, alerts, recovery, court dates
- **ROI Expiration Tracking**: Shows expiration date and days remaining
- **Permission Actions**: Edit access, revoke, renew, grant new access

### 5. **Resource Recommendation Engine**
- **Reads Assessment + Gap Flags**: Analyzes client needs
- **Scored Resource Matches**: Ranks resources by relevance
- **One-Click Send to Client**: Providers can send recommendations
- **Client Inbox**: Resource reminders appear as provider messages

---

## ADMIN FEATURES

### 1. **Admin Portal** (`/admin-portal`)
- **User Management**: Add, edit, remove users; assign roles
- **Organization Management**: Add, edit, remove organizations
- **Resource Management**: Add, edit, remove resources; manage categories
- **Analytics Dashboard**: See below
- **Audit Logs**: Track all system changes
- **Permissions Management**: Grant/revoke access levels

### 2. **Analytics Dashboard** (`/admin-portal/analytics`)
- **Total Users**: Count by role (pie chart)
- **Total Goals**: Active and completed goals
- **Total Resources**: By category (bar chart)
- **Total Events**: Community events by type
- **Total Appointments**: Scheduled and completed
- **Total Messages**: Cross-role conversations
- **Role Breakdown**: Visual bar chart (client, case_manager, ecm_worker, probation_officer, counselor, admin)
- **Top Resource Categories**: Most accessed resources
- **Recent Signups**: Last 7 days by day (line chart)
- **Recent Users List**: Latest registered users with role badges

---

## NAVIGATION & ROUTING

### Client Routes
- `/` - Home page
- `/dashboard` - Main client dashboard
- `/onboarding` - Multi-step assessment
- `/resources` - Resource navigator
- `/resource-map` - Interactive map
- `/calendar` - Appointments and calendar
- `/goals` - Goal tracking
- `/chat` - AI counselor chat
- `/community-events` - Events board
- `/daily-feed` - Personalized daily feed
- `/documents` - Document storage
- `/messages` - Messaging
- `/profile` - Client profile
- `/about` - About page

### Provider Routes
- `/provider-portal` - Provider portal home
- `/provider-portal/clients` - Client list
- `/provider-portal/client/:id` - Client profile
- `/provider-portal/roi-dashboard` - Multi-role ROI dashboard
- `/provider-portal/messages` - Messaging
- `/provider-portal/referrals` - Referral management
- `/provider-portal/client-search` - Client search
- `/provider-portal/collaboration/:id` - Multi-agency collaboration
- `/provider-portal/permissions/:id` - Permissions display
- `/provider-onboarding` - Provider onboarding flow

### Admin Routes
- `/admin-portal` - Admin portal home
- `/admin-portal/analytics` - Analytics dashboard

### Multi-Agency Routes
- `/shared-client-profile/:id` - Shared client profile
- `/collaborative-care-hub` - Collaborative Care Hub
- `/multi-agency-hub` - Multi-agency hub (legacy name)

---

## KEY COMPONENTS

### Dashboard Sections
- `AppointmentsSection` - Appointment tracking
- `CourtDatesSection` - Court date tracking
- `MedicationTrackingSection` - Medication management
- `RecoveryTrackingSection` - Recovery milestones
- `ReferralTrackingSection` - Referral management
- `NotesSection` - Notes with multiple types
- `AlertsSection` - Alert management
- `RemindersSection` - Reminder scheduling
- `ClientTimeline` - 360° timeline view

### Provider Components
- `ProviderMessaging` - Staff messaging
- `ClientSearch` - Client search interface
- `MultiRoleROIDashboard` - Role-specific ROI metrics
- `ProviderOnboarding` - Provider signup flow
- `ProviderReferrals` - Referral management
- `ProviderAlerts` - Alert management

### Multi-Agency Components
- `MultiAgencyCollaborationView` - Agency coordination
- `PermissionsDisplay` - ROI and access management
- `SharedClientProfile` - Shared profile view
- `MultiAgencyHub` - Multi-agency dashboard

### Layout Components
- `DashboardLayout` - Main dashboard layout with sidebar
- `ProviderPortal` - Provider portal layout
- `AdminPortal` - Admin portal layout
- `Footer` - Consistent footer with branding

---

## DEMO DATA

All components include realistic demo data for testing:
- **Clients**: 5+ demo clients with full profiles
- **Appointments**: 10+ upcoming and past appointments
- **Court Dates**: 5+ court hearings with details
- **Medications**: 8+ active medications with compliance tracking
- **Recovery Milestones**: 6+ milestones with dates
- **Referrals**: 8+ referrals in various statuses
- **Notes**: 15+ notes of different types
- **Alerts**: 10+ alerts with different severity levels
- **Reminders**: 8+ reminders in different states
- **Agencies**: 5+ multi-agency partnerships
- **Permissions**: 6+ permission records with different statuses
- **Resources**: 85+ real resources across 6 counties

---

## TESTING CREDENTIALS

Use these credentials to test different roles:

```
Client: client@test.com / password
Case Manager: cm@test.com / password
Doctor: doctor@test.com / password
Counselor: counselor@test.com / password
Probation Officer: probation@test.com / password
Admin: admin@test.com / password
```

---

## TECHNICAL STACK

- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **Backend**: Express 4, tRPC 11, Drizzle ORM
- **Database**: MySQL/TiDB
- **Auth**: Manus OAuth
- **Storage**: S3
- **APIs**: Google Maps, Manus Built-in APIs
- **Testing**: Vitest
- **Dev Server**: Vite with HMR

---

## NEXT STEPS FOR BACKEND INTEGRATION

The following items are ready for backend integration:
1. Wire all demo components to live tRPC procedures
2. Implement permission audit logging in server procedures
3. Add role-based access control enforcement in backend
4. Integrate ClientTimeline with live timeline data
5. Create pagination/lazy loading for large client lists
6. Add Vitest coverage for all backend procedures
7. Performance optimization for production deployment

---

## SUPPORT

For questions or issues, refer to the comprehensive README.md in the project root.
