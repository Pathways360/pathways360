import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import CoachSetup from "./pages/CoachSetup";
import Goals from "./pages/Goals";
import Resources from "./pages/Resources";
import CalendarPage from "./pages/Calendar";
import Counselor from "./pages/Counselor";
import Coach from "./pages/Coach";
import CaseManagerPortal from "./pages/CaseManagerPortal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/assessment" component={Assessment} />
      <Route path="/coach-setup" component={CoachSetup} />
      <Route path="/goals" component={Goals} />
      <Route path="/resources" component={Resources} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/counselor" component={Counselor} />
      <Route path="/coach" component={Coach} />
      <Route path="/portal" component={CaseManagerPortal} />
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
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
