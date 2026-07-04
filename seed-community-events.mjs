import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Generate dates relative to today
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

const today = daysFromNow(0);
const tomorrow = daysFromNow(1);
const d2 = daysFromNow(2);
const d3 = daysFromNow(3);
const d4 = daysFromNow(4);
const d5 = daysFromNow(5);
const d6 = daysFromNow(6);

const events = [
  // ── BUTTE COUNTY ──────────────────────────────────────────────────────────
  {
    title: "Daily Lunch — Good News Rescue Mission",
    description: "Hot lunch served daily. Arrive 20 minutes early for best chance of being served. No ID required.",
    eventType: "meal", eventDate: today, startTime: "12:00", endTime: "13:00",
    county: "butte", city: "Chico", address: "311 Salem St", locationName: "Good News Rescue Mission",
    organizationName: "Good News Rescue Mission", organizationPhone: "(530) 345-2640",
    needsCategories: "meals,housing,shelter", confidenceLevel: "verified_today",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "daily",
    isFeatured: true, freeService: true,
  },
  {
    title: "Emergency Shelter Check-In — Torres Community Shelter",
    description: "Emergency shelter beds available. Check-in begins at 5:30 PM. Arriving early improves bed availability. Sober entry required.",
    eventType: "emergency_shelter", eventDate: today, startTime: "17:30", endTime: "08:00",
    county: "butte", city: "Chico", address: "101 Silver Dollar Way", locationName: "Torres Community Shelter",
    organizationName: "Torres Community Shelter", organizationPhone: "(530) 894-0429",
    needsCategories: "shelter,housing,emergency", confidenceLevel: "verified_today",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "daily",
    isFeatured: true, freeService: true,
  },
  {
    title: "Mobile Hope Medical Van — Downtown Chico",
    description: "Walk-in medical services including wound care, prescriptions, and referrals. No insurance required.",
    eventType: "mobile_medical", eventDate: today, startTime: "09:00", endTime: "13:00",
    county: "butte", city: "Chico", address: "Bidwell Park Entrance, E 1st Ave",
    organizationName: "Butte County Public Health", organizationPhone: "(530) 552-4000",
    needsCategories: "medical,health,homeless", confidenceLevel: "verified_this_week",
    sourceType: "county_website", isRecurring: true, recurringPattern: "weekly:tue,thu",
    isFeatured: true, freeService: true,
  },
  {
    title: "Butte County Food Bank Distribution",
    description: "Drive-through and walk-up food distribution. Bring ID if available but not required. Families welcome.",
    eventType: "food_distribution", eventDate: tomorrow, startTime: "10:00", endTime: "13:00",
    county: "butte", city: "Chico", address: "1262 Fortress St",
    organizationName: "Butte County Food Bank", organizationPhone: "(530) 343-2946",
    needsCategories: "food,meals,basic_needs", confidenceLevel: "verified_this_week",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "weekly:wed",
    freeService: true,
  },
  {
    title: "Shower & Laundry Program — Jesus Center",
    description: "Free showers and laundry available. Towels and hygiene kits provided while supplies last.",
    eventType: "shower_program", eventDate: today, startTime: "08:00", endTime: "12:00",
    county: "butte", city: "Chico", address: "1297 Park Ave", locationName: "Jesus Center",
    organizationName: "Jesus Center", organizationPhone: "(530) 345-2640",
    needsCategories: "shower,laundry,hygiene,homeless", confidenceLevel: "verified_today",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "daily",
    freeService: true,
  },
  {
    title: "Butte County Job Fair — Chico State",
    description: "50+ employers hiring. Bring copies of your resume. Business casual dress recommended. Free bus passes available at the door.",
    eventType: "job_fair", eventDate: d3, startTime: "10:00", endTime: "15:00",
    county: "butte", city: "Chico", address: "400 W 1st St", locationName: "Chico State — Laxson Auditorium",
    organizationName: "Butte County Employment Center", organizationPhone: "(530) 891-2760",
    needsCategories: "employment,jobs,hiring", confidenceLevel: "verified_this_week",
    sourceType: "public_website", isFeatured: true, freeService: true,
  },
  {
    title: "Legal Aid Clinic — Butte County",
    description: "Free legal consultations for housing, benefits, and expungement. First come, first served. Bring any relevant documents.",
    eventType: "legal_clinic", eventDate: d2, startTime: "13:00", endTime: "17:00",
    county: "butte", city: "Oroville", address: "1735 Montgomery St",
    organizationName: "Legal Services of Northern California", organizationPhone: "(530) 345-9491",
    needsCategories: "legal,benefits,reentry,expungement", confidenceLevel: "verified_this_week",
    sourceType: "organization_direct", freeService: true,
  },
  {
    title: "AA Meeting — Open Big Book Study",
    description: "Open Alcoholics Anonymous meeting. All are welcome. Chips and coffee provided.",
    eventType: "recovery_meeting", eventDate: today, startTime: "19:00", endTime: "20:00",
    county: "butte", city: "Chico", address: "245 Cohasset Rd",
    organizationName: "Alcoholics Anonymous — Butte County Intergroup",
    needsCategories: "recovery,aa,support_group", confidenceLevel: "verified_today",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "daily",
    freeService: true,
  },
  {
    title: "Clothing Closet — Catalyst Domestic Violence Services",
    description: "Free clothing available for adults and children. No appointment needed. Sizes vary.",
    eventType: "clothing_closet", eventDate: d2, startTime: "10:00", endTime: "14:00",
    county: "butte", city: "Chico", address: "PO Box 3686 (call for address)",
    organizationName: "Catalyst Domestic Violence Services", organizationPhone: "(530) 343-7711",
    needsCategories: "clothing,domestic_violence,basic_needs", confidenceLevel: "verified_this_week",
    sourceType: "organization_direct", freeService: true,
  },
  {
    title: "Bus Voucher Distribution — Butte Regional Transit",
    description: "Free bus vouchers available for medical appointments and job interviews. Must show documentation of need.",
    eventType: "bus_voucher", eventDate: tomorrow, startTime: "09:00", endTime: "12:00",
    county: "butte", city: "Chico", address: "326 Huss Dr",
    organizationName: "Butte Regional Transit / B-Line", organizationPhone: "(530) 342-0221",
    needsCategories: "transportation,bus,employment,medical", confidenceLevel: "verified_this_week",
    sourceType: "organization_direct", freeService: true,
  },

  // ── SHASTA COUNTY ─────────────────────────────────────────────────────────
  {
    title: "Daily Breakfast — Shasta Community Health Center",
    description: "Free breakfast for unhoused individuals. Walk-ins welcome. Served rain or shine.",
    eventType: "meal", eventDate: today, startTime: "07:30", endTime: "09:00",
    county: "shasta", city: "Redding", address: "1321 California St",
    organizationName: "Shasta Community Health Center", organizationPhone: "(530) 229-8420",
    needsCategories: "meals,food,homeless", confidenceLevel: "verified_today",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "daily",
    isFeatured: true, freeService: true,
  },
  {
    title: "Redding Rescue Mission — Emergency Shelter",
    description: "Emergency shelter for men. Check-in at 4:30 PM. Sobriety required. Case management available on-site.",
    eventType: "emergency_shelter", eventDate: today, startTime: "16:30", endTime: "07:00",
    county: "shasta", city: "Redding", address: "683 Locust St", locationName: "Redding Rescue Mission",
    organizationName: "Redding Rescue Mission", organizationPhone: "(530) 241-1771",
    needsCategories: "shelter,housing,emergency,case_management", confidenceLevel: "verified_today",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "daily",
    isFeatured: true, freeService: true,
  },
  {
    title: "Behavioral Health Outreach — Shasta County",
    description: "Mental health outreach team available at Sundial Bridge area. Crisis support, medication assistance, and referrals.",
    eventType: "behavioral_health_outreach", eventDate: today, startTime: "10:00", endTime: "14:00",
    county: "shasta", city: "Redding", address: "Sundial Bridge, 1 Sundial Bridge Dr",
    organizationName: "Shasta County Behavioral Health", organizationPhone: "(530) 225-5200",
    needsCategories: "mental_health,behavioral_health,crisis,homeless", confidenceLevel: "verified_this_week",
    sourceType: "county_website", isRecurring: true, recurringPattern: "weekly:mon,wed,fri",
    isFeatured: true, freeService: true,
  },
  {
    title: "Shasta Food Bank — Walk-Up Distribution",
    description: "Weekly food distribution. No income verification required. Bring bags or boxes to carry food.",
    eventType: "food_bank", eventDate: d4, startTime: "09:00", endTime: "12:00",
    county: "shasta", city: "Redding", address: "2565 Breslauer Way",
    organizationName: "Shasta Food Bank", organizationPhone: "(530) 223-3634",
    needsCategories: "food,meals,basic_needs", confidenceLevel: "verified_this_week",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "weekly:sat",
    freeService: true,
  },
  {
    title: "Expungement Clinic — Shasta County Courthouse",
    description: "Free assistance with criminal record expungement. Attorneys on-site. Bring any court documents you have.",
    eventType: "expungement_event", eventDate: d5, startTime: "09:00", endTime: "15:00",
    county: "shasta", city: "Redding", address: "1500 Court St",
    organizationName: "Legal Services of Northern California", organizationPhone: "(530) 241-3565",
    needsCategories: "legal,reentry,expungement,probation", confidenceLevel: "verified_this_week",
    sourceType: "organization_direct", freeService: true,
  },
  {
    title: "NA Meeting — Newcomers Welcome",
    description: "Narcotics Anonymous open meeting. Newcomers especially welcome. Speaker sharing.",
    eventType: "recovery_meeting", eventDate: today, startTime: "20:00", endTime: "21:00",
    county: "shasta", city: "Redding", address: "1765 Eureka Way",
    organizationName: "Narcotics Anonymous — Shasta Area",
    needsCategories: "recovery,na,support_group", confidenceLevel: "verified_today",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "daily",
    freeService: true,
  },
  {
    title: "Hiring Event — Shasta County Workforce Center",
    description: "Multiple employers hiring for immediate positions. Bring resume and ID. On-the-spot interviews possible.",
    eventType: "hiring_event", eventDate: d2, startTime: "10:00", endTime: "14:00",
    county: "shasta", city: "Redding", address: "1265 Redding Ct",
    organizationName: "Shasta County Workforce Development", organizationPhone: "(530) 245-6300",
    needsCategories: "employment,jobs,hiring", confidenceLevel: "verified_this_week",
    sourceType: "county_website", freeService: true,
  },
  {
    title: "Veterans Stand Down — Redding",
    description: "One-day event providing veterans with food, clothing, haircuts, medical screenings, benefits enrollment, and housing resources.",
    eventType: "veterans_event", eventDate: d6, startTime: "08:00", endTime: "16:00",
    county: "shasta", city: "Redding", address: "Shasta District Fairgrounds, 1890 Briggs St",
    organizationName: "Shasta County Veterans Services", organizationPhone: "(530) 225-5616",
    needsCategories: "veterans,housing,medical,benefits,clothing", confidenceLevel: "verified_this_week",
    sourceType: "county_website", isFeatured: true, freeService: true,
  },

  // ── HUMBOLDT COUNTY ───────────────────────────────────────────────────────
  {
    title: "Eureka Rescue Mission — Daily Dinner",
    description: "Hot dinner served nightly. All welcome. No ID required. Beds available for men after dinner.",
    eventType: "meal", eventDate: today, startTime: "17:30", endTime: "18:30",
    county: "humboldt", city: "Eureka", address: "110 2nd St", locationName: "Eureka Rescue Mission",
    organizationName: "Eureka Rescue Mission", organizationPhone: "(707) 443-4551",
    needsCategories: "meals,shelter,housing", confidenceLevel: "verified_today",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "daily",
    isFeatured: true, freeService: true,
  },
  {
    title: "Humboldt Open Door Clinic — Mobile Health Van",
    description: "Mobile medical clinic serving unhoused individuals. Walk-in medical, dental referrals, and behavioral health services.",
    eventType: "mobile_medical", eventDate: tomorrow, startTime: "09:00", endTime: "13:00",
    county: "humboldt", city: "Eureka", address: "2200 Harrison Ave (Palco Marsh area)",
    organizationName: "Open Door Community Health Centers", organizationPhone: "(707) 269-7500",
    needsCategories: "medical,health,homeless,behavioral_health", confidenceLevel: "verified_this_week",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "weekly:mon,thu",
    isFeatured: true, freeService: true,
  },
  {
    title: "Humboldt Food Bank — Eureka Distribution",
    description: "Food distribution for individuals and families. Bring bags. No documentation required.",
    eventType: "food_bank", eventDate: d3, startTime: "10:00", endTime: "13:00",
    county: "humboldt", city: "Eureka", address: "307 W 14th St",
    organizationName: "Humboldt Food Bank", organizationPhone: "(707) 445-3166",
    needsCategories: "food,meals,basic_needs", confidenceLevel: "verified_this_week",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "weekly:wed",
    freeService: true,
  },
  {
    title: "Probation Outreach — Humboldt County",
    description: "Probation officers available for walk-in check-ins and questions. Avoid warrants — come in voluntarily.",
    eventType: "probation_outreach", eventDate: d2, startTime: "09:00", endTime: "12:00",
    county: "humboldt", city: "Eureka", address: "1200 W Wabash Ave",
    organizationName: "Humboldt County Probation Department", organizationPhone: "(707) 445-7251",
    needsCategories: "probation,reentry,legal", confidenceLevel: "verified_this_week",
    sourceType: "county_website", freeService: true,
  },
  {
    title: "DHHS Benefits Enrollment — Humboldt",
    description: "Apply for Medi-Cal, CalFresh, CalWORKs, and General Relief. Bring ID and proof of residence if available.",
    eventType: "resource_fair", eventDate: d4, startTime: "08:00", endTime: "17:00",
    county: "humboldt", city: "Eureka", address: "929 Koster St",
    organizationName: "Humboldt County DHHS", organizationPhone: "(707) 445-3200",
    needsCategories: "benefits,medi_cal,calfresh,housing", confidenceLevel: "verified_this_week",
    sourceType: "county_website", freeService: true,
  },

  // ── TEHAMA COUNTY ─────────────────────────────────────────────────────────
  {
    title: "Red Bluff Community Pantry",
    description: "Weekly food pantry open to all Tehama County residents. No income verification. Drive-through available.",
    eventType: "food_bank", eventDate: d3, startTime: "09:00", endTime: "12:00",
    county: "tehama", city: "Red Bluff", address: "640 Walnut St",
    organizationName: "Tehama County Food Bank", organizationPhone: "(530) 527-7900",
    needsCategories: "food,meals,basic_needs", confidenceLevel: "verified_this_week",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "weekly:thu",
    freeService: true,
  },
  {
    title: "Tehama County Behavioral Health Walk-In",
    description: "Walk-in mental health and substance use services. Crisis support available. Medi-Cal accepted, sliding scale for others.",
    eventType: "behavioral_health_outreach", eventDate: today, startTime: "08:00", endTime: "17:00",
    county: "tehama", city: "Red Bluff", address: "1860 Walnut St",
    organizationName: "Tehama County Behavioral Health", organizationPhone: "(530) 527-8491",
    needsCategories: "mental_health,behavioral_health,substance_use,crisis", confidenceLevel: "verified_today",
    sourceType: "county_website", isRecurring: true, recurringPattern: "daily",
    freeService: false, mediCalAccepted: true,
  },
  {
    title: "Salvation Army — Red Bluff Hot Meal",
    description: "Hot lunch served Monday through Friday. Clothing and hygiene items available while supplies last.",
    eventType: "meal", eventDate: today, startTime: "12:00", endTime: "13:00",
    county: "tehama", city: "Red Bluff", address: "1635 Walnut St",
    organizationName: "Salvation Army — Red Bluff Corps", organizationPhone: "(530) 527-1700",
    needsCategories: "meals,clothing,basic_needs", confidenceLevel: "verified_today",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "weekly:mon,tue,wed,thu,fri",
    freeService: true,
  },
  {
    title: "Tehama County Job Center — Walk-In Services",
    description: "Resume help, job listings, computer access, and referrals to training programs. CalJOBS registration available.",
    eventType: "training", eventDate: today, startTime: "08:00", endTime: "17:00",
    county: "tehama", city: "Red Bluff", address: "310 S Main St",
    organizationName: "Tehama County Employment Services", organizationPhone: "(530) 527-0604",
    needsCategories: "employment,jobs,training,education", confidenceLevel: "verified_today",
    sourceType: "county_website", isRecurring: true, recurringPattern: "daily",
    freeService: true,
  },

  // ── TRINITY COUNTY ────────────────────────────────────────────────────────
  {
    title: "Trinity County Food Bank — Weaverville",
    description: "Monthly food distribution for Trinity County residents. Bring ID and proof of county residency.",
    eventType: "food_bank", eventDate: d5, startTime: "10:00", endTime: "13:00",
    county: "trinity", city: "Weaverville", address: "101 Memorial Dr",
    organizationName: "Trinity County Food Bank", organizationPhone: "(530) 623-4567",
    needsCategories: "food,meals,basic_needs", confidenceLevel: "verified_this_week",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "monthly",
    freeService: true,
  },
  {
    title: "Trinity County Behavioral Health — Walk-In",
    description: "Mental health and substance use services. Crisis support. Medi-Cal accepted.",
    eventType: "behavioral_health_outreach", eventDate: today, startTime: "08:00", endTime: "17:00",
    county: "trinity", city: "Weaverville", address: "PO Box 1470, 101 Memorial Dr",
    organizationName: "Trinity County Behavioral Health", organizationPhone: "(530) 623-8236",
    needsCategories: "mental_health,substance_use,crisis,behavioral_health", confidenceLevel: "verified_today",
    sourceType: "county_website", isRecurring: true, recurringPattern: "weekly:mon,tue,wed,thu,fri",
    freeService: false, mediCalAccepted: true,
  },
  {
    title: "Community Resource Fair — Hayfork",
    description: "Multiple agencies present: DHHS, Housing Authority, Employment, Legal Aid, and more. All welcome.",
    eventType: "resource_fair", eventDate: d6, startTime: "10:00", endTime: "15:00",
    county: "trinity", city: "Hayfork", address: "Trinity County Fairgrounds",
    organizationName: "Trinity County DHHS", organizationPhone: "(530) 623-1265",
    needsCategories: "benefits,housing,employment,legal,medical", confidenceLevel: "verified_this_week",
    sourceType: "county_website", isFeatured: true, freeService: true,
  },

  // ── SISKIYOU COUNTY ───────────────────────────────────────────────────────
  {
    title: "Siskiyou Community Food Bank — Yreka",
    description: "Weekly food distribution. All Siskiyou County residents welcome. No documentation required.",
    eventType: "food_bank", eventDate: d2, startTime: "09:00", endTime: "12:00",
    county: "siskiyou", city: "Yreka", address: "1235 S Main St",
    organizationName: "Siskiyou Community Food Bank", organizationPhone: "(530) 842-1234",
    needsCategories: "food,meals,basic_needs", confidenceLevel: "verified_this_week",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "weekly:fri",
    freeService: true,
  },
  {
    title: "Siskiyou County DHHS — Benefits Walk-In",
    description: "Apply for Medi-Cal, CalFresh, and General Relief. Walk-ins welcome. Bring ID if available.",
    eventType: "resource_fair", eventDate: today, startTime: "08:00", endTime: "17:00",
    county: "siskiyou", city: "Yreka", address: "818 S Main St",
    organizationName: "Siskiyou County DHHS", organizationPhone: "(530) 841-2700",
    needsCategories: "benefits,medi_cal,calfresh,housing", confidenceLevel: "verified_today",
    sourceType: "county_website", isRecurring: true, recurringPattern: "weekly:mon,tue,wed,thu,fri",
    freeService: true,
  },
  {
    title: "Siskiyou County Behavioral Health — Walk-In Services",
    description: "Mental health evaluation, crisis support, and substance use counseling. Medi-Cal accepted.",
    eventType: "behavioral_health_outreach", eventDate: today, startTime: "08:00", endTime: "17:00",
    county: "siskiyou", city: "Yreka", address: "818 S Main St",
    organizationName: "Siskiyou County Behavioral Health", organizationPhone: "(530) 841-2850",
    needsCategories: "mental_health,behavioral_health,substance_use", confidenceLevel: "verified_today",
    sourceType: "county_website", isRecurring: true, recurringPattern: "weekly:mon,tue,wed,thu,fri",
    freeService: false, mediCalAccepted: true,
  },
  {
    title: "AA Meeting — Yreka Open Discussion",
    description: "Open Alcoholics Anonymous meeting. All are welcome regardless of sobriety date.",
    eventType: "recovery_meeting", eventDate: today, startTime: "18:30", endTime: "19:30",
    county: "siskiyou", city: "Yreka", address: "First Presbyterian Church, 209 W Miner St",
    organizationName: "Alcoholics Anonymous — Siskiyou Area",
    needsCategories: "recovery,aa,support_group", confidenceLevel: "verified_today",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "daily",
    freeService: true,
  },
  {
    title: "Siskiyou County Job Center",
    description: "Employment services, resume help, job listings, and CalJOBS registration. Walk-ins welcome.",
    eventType: "training", eventDate: today, startTime: "08:00", endTime: "17:00",
    county: "siskiyou", city: "Yreka", address: "818 S Main St",
    organizationName: "Siskiyou County Employment Services", organizationPhone: "(530) 841-2700",
    needsCategories: "employment,jobs,training", confidenceLevel: "verified_today",
    sourceType: "county_website", isRecurring: true, recurringPattern: "weekly:mon,tue,wed,thu,fri",
    freeService: true,
  },

  // ── MULTI-COUNTY / REGIONAL ───────────────────────────────────────────────
  {
    title: "DMV ID Outreach — Chico",
    description: "DMV representatives on-site to help obtain California ID cards and driver's licenses. Bring any documents you have.",
    eventType: "dmv_outreach", eventDate: d4, startTime: "09:00", endTime: "15:00",
    county: "butte", city: "Chico", address: "Good News Rescue Mission, 311 Salem St",
    organizationName: "California DMV / Butte County HHSA", organizationPhone: "(530) 895-4461",
    needsCategories: "id,identification,benefits,reentry", confidenceLevel: "verified_this_week",
    sourceType: "county_website", isFeatured: true, freeService: true,
  },
  {
    title: "Warming Center — Redding (Cold Weather Alert)",
    description: "Warming center open when temperatures drop below 35°F. Bring sleeping bag if possible. Pets welcome in designated area.",
    eventType: "warming_center", eventDate: today, startTime: "20:00", endTime: "07:00",
    county: "shasta", city: "Redding", address: "1500 California St (call to confirm activation)",
    organizationName: "City of Redding Emergency Services", organizationPhone: "(530) 225-4095",
    needsCategories: "shelter,emergency,homeless,warming", confidenceLevel: "pending",
    sourceType: "county_website", isFeatured: true, freeService: true,
  },
  {
    title: "Community Resource Fair — Redding",
    description: "25+ agencies providing services: housing, benefits, employment, legal, medical, and more. Free lunch provided.",
    eventType: "resource_fair", eventDate: d5, startTime: "09:00", endTime: "14:00",
    county: "shasta", city: "Redding", address: "Shasta District Fairgrounds, 1890 Briggs St",
    organizationName: "Shasta County HHSA", organizationPhone: "(530) 225-5300",
    needsCategories: "housing,benefits,employment,legal,medical,food", confidenceLevel: "verified_this_week",
    sourceType: "county_website", isFeatured: true, freeService: true,
  },
  {
    title: "Resume Workshop — Chico Career Center",
    description: "Learn how to write a resume, fill out applications, and prepare for interviews. Computers available.",
    eventType: "resume_workshop", eventDate: d3, startTime: "10:00", endTime: "12:00",
    county: "butte", city: "Chico", address: "1265 Ridgewood Dr",
    organizationName: "Butte County Employment Center", organizationPhone: "(530) 891-2760",
    needsCategories: "employment,jobs,training,education", confidenceLevel: "verified_this_week",
    sourceType: "county_website", freeService: true,
  },
  {
    title: "Peer Support Group — Recovery & Reentry",
    description: "Weekly peer support group for people in recovery and/or recently released from incarceration. Facilitated by certified peer specialists.",
    eventType: "peer_support", eventDate: d2, startTime: "14:00", endTime: "15:30",
    county: "butte", city: "Chico", address: "1297 Park Ave", locationName: "Jesus Center",
    organizationName: "Butte County Behavioral Health", organizationPhone: "(530) 891-2810",
    needsCategories: "recovery,reentry,peer_support,mental_health", confidenceLevel: "verified_this_week",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "weekly:tue",
    freeService: true,
  },
  {
    title: "Faith-Based Community Dinner — First Christian Church",
    description: "Community dinner open to all. No questions asked. Childcare available. Prayer optional.",
    eventType: "faith_based", eventDate: d3, startTime: "18:00", endTime: "19:30",
    county: "shasta", city: "Redding", address: "3385 Placer St",
    organizationName: "First Christian Church of Redding",
    needsCategories: "meals,community,faith_based", confidenceLevel: "verified_this_week",
    sourceType: "organization_direct", isRecurring: true, recurringPattern: "weekly:wed",
    freeService: true,
  },
];

console.log(`Seeding ${events.length} community events...`);
let inserted = 0;
for (const e of events) {
  try {
    await conn.execute(
      `INSERT INTO community_events 
       (title, description, eventType, eventDate, startTime, endTime, isRecurring, recurringPattern,
        county, city, address, locationName, organizationName, organizationPhone, organizationWebsite,
        needsCategories, confidenceLevel, sourceType, spotsAvailable, requiresRegistration,
        isActive, isFeatured, createdAt, updatedAt)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?,NOW(),NOW())`,
      [
        e.title, e.description || null, e.eventType, e.eventDate,
        e.startTime || null, e.endTime || null,
        e.isRecurring ? 1 : 0, e.recurringPattern || null,
        e.county, e.city || null, e.address || null, e.locationName || null,
        e.organizationName || null, e.organizationPhone || null, e.organizationWebsite || null,
        e.needsCategories || null, e.confidenceLevel || "pending",
        e.sourceType || "provider_submission",
        e.spotsAvailable || null, e.requiresRegistration ? 1 : 0,
        e.isFeatured ? 1 : 0,
      ]
    );
    inserted++;
  } catch (err) {
    console.error(`Failed to insert "${e.title}":`, err.message);
  }
}
console.log(`✓ Inserted ${inserted}/${events.length} community events`);
await conn.end();
