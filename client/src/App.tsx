import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import Home from "./pages/Home";
import About from "@/pages/About";
import ReferralManagement from "@/pages/ReferralManagement";
import NotesManagement from "@/pages/NotesManagement";
import ROIDashboard from "@/pages/ROIDashboard";
import PermissionControls from "@/pages/PermissionControls";
import MultiAgencyHub from "@/pages/MultiAgencyHub";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import CoachSetup from "./pages/CoachSetup";
import Goals from "./pages/Goals";
import Resources from "./pages/Resources";
import CalendarPage from "./pages/Calendar";
import Counselor from "./pages/Counselor";
import Coach from "./pages/Coach";
import CaseManagerPortal from "./pages/CaseManagerPortal";
import ProviderPortal from "./pages/ProviderPortal";
import ProviderOnboarding from "./pages/ProviderOnboarding";
import ProviderDashboardFull from "./pages/ProviderDashboardFull";
import CountyDirectory from "./pages/CountyDirectory";
import DailyFeed from "./pages/DailyFeed";
import CommunityEvents from "./pages/CommunityEvents";
import Onboarding from "./pages/Onboarding";
import ProbationPortal from "./pages/ProbationPortal";
import CounselorPortal from "./pages/CounselorPortal";
import ECMPortal from "./pages/ECMPortal";
import AdminPortal from "./pages/AdminPortal";
import Messaging from "./pages/Messaging";
import Documents from "./pages/Documents";
import Favorites from "./pages/Favorites";
import ResourceMap from "./pages/ResourceMap";
import ProviderDashboard from "./pages/ProviderDashboard";
import LoginChoice from "./pages/LoginChoice";
import ClientLogin from "./pages/ClientLogin";
import ProviderLogin from "./pages/ProviderLogin";
import MultiRoleROIDashboard from "./pages/MultiRoleROIDashboard";
import ClientSearch from "./pages/ClientSearch";
import ProviderMessaging from "./pages/ProviderMessaging";
import ProviderReferrals from "./pages/ProviderReferrals";
import ProviderAlerts from "./pages/ProviderAlerts";
import { NotificationCenter } from "./components/NotificationCenter";
import { NotificationPreferences } from "./pages/NotificationPreferences";

// ─── Session Timeout (30 min inactivity) ─────────────────────────────────────
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const WARNING_BEFORE_MS = 2 * 60 * 1000;

function SessionTimeoutGuard() {
  const { isAuthenticated, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeoutRef = useRef<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const warningRef = useRef<any>(undefined);

  const resetTimer = () => {
    window.clearTimeout(timeoutRef.current);
    window.clearTimeout(warningRef.current);
    setShowWarning(false);
    if (isAuthenticated) {
      warningRef.current = window.setTimeout(() => setShowWarning(true), SESSION_TIMEOUT_MS - WARNING_BEFORE_MS);
      timeoutRef.current = window.setTimeout(() => {
        logout?.();
      }, SESSION_TIMEOUT_MS);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      window.clearTimeout(timeoutRef.current);
      window.clearTimeout(warningRef.current);
    };
  }, [isAuthenticated]);

  if (!showWarning) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl text-center">
        <div className="text-4xl mb-3">⏱</div>
        <h2 className="font-bold text-lg mb-2">Session Expiring Soon</h2>
        <p className="text-sm text-gray-600 mb-4">You will be logged out in 2 minutes due to inactivity. Click anywhere to stay signed in.</p>
        <button onClick={resetTimer} className="w-full bg-teal-600 text-white rounded-xl py-2.5 font-medium hover:bg-teal-700 transition-colors">
          Stay Signed In
        </button>
      </div>
    </div>
  );
}

// ─── Role-Gated Portal Redirect ───────────────────────────────────────────────
function RolePortalRedirect() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const role = (user as any).role;
    if (role === "probation_officer") navigate("/probation-portal");
    else if (role === "counselor") navigate("/counselor-portal");
    else if (role === "ecm_worker") navigate("/ecm-portal");
    else if (role === "case_manager" || role === "org_admin") navigate("/provider-portal");
    else if (role === "admin") navigate("/admin-portal");
    else navigate("/dashboard");
  }, [isAuthenticated, user]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/login" component={LoginChoice} />
      <Route path="/login/client" component={ClientLogin} />
      <Route path="/login/provider" component={ProviderLogin} />
      <Route path="/portal-redirect" component={RolePortalRedirect} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/assessment" component={Assessment} />
      <Route path="/coach-setup" component={CoachSetup} />
      <Route path="/goals" component={Goals} />
      <Route path="/resources" component={Resources} />
      <Route path="/resource-map" component={ResourceMap} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/counselor" component={Counselor} />
      <Route path="/coach" component={Coach} />
      <Route path="/messaging" component={Messaging} />
      <Route path="/documents" component={Documents} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/provider-dashboard" component={ProviderDashboard} />
      <Route path="/referral-management/:clientId" component={(props: any) => <ReferralManagement clientId={parseInt(props.params.clientId || '0')} />} />
      <Route path="/notes-management/:clientId" component={(props: any) => <NotesManagement clientId={parseInt(props.params.clientId || '0')} />} />
      <Route path="/roi-dashboard" component={ROIDashboard} />
      <Route path="/multi-role-roi" component={MultiRoleROIDashboard} />
      <Route path="/client-search" component={() => <ClientSearch />} />
      <Route path="/provider-messaging" component={ProviderMessaging} />
      <Route path="/provider-referrals" component={ProviderReferrals} />
      <Route path="/provider-alerts" component={ProviderAlerts} />
      <Route path="/permission-controls" component={PermissionControls} />
      <Route path="/multi-agency-hub" component={MultiAgencyHub} />
      <Route path="/portal" component={CaseManagerPortal} />
        <Route path="/provider-portal" component={ProviderPortal} />
        <Route path="/provider-onboarding" component={ProviderOnboarding} />
        <Route path="/provider-dashboard" component={ProviderDashboardFull} />
        <Route path="/provider-search" component={ProviderDashboardFull} />
      <Route path="/probation-portal" component={ProbationPortal} />
      <Route path="/counselor-portal" component={CounselorPortal} />
      <Route path="/ecm-portal" component={ECMPortal} />
      <Route path="/admin-portal" component={AdminPortal} />
      <Route path="/county-directory" component={CountyDirectory} />
      <Route path="/daily-feed" component={DailyFeed} />
      <Route path="/community-events" component={CommunityEvents} />
      <Route path="/profile" component={Profile} />
      <Route path="/notification-preferences" component={NotificationPreferences} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <SessionTimeoutGuard />
          <div className="fixed top-4 right-4 z-40">
            <NotificationCenter />
          </div>
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
