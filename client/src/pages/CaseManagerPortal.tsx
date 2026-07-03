import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { ArrowLeft, Users, Heart, AlertCircle, CheckCircle, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function CaseManagerPortal() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: clients, isLoading } = trpc.caseManager.getClients.useQuery(undefined, {
    enabled: user?.role === "case_manager" || user?.role === "admin",
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">Please sign in to access the portal.</p>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== "case_manager" && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground mb-4">
              This portal is only available to case managers and organization admins.
              If you believe this is an error, please contact your administrator.
            </p>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-foreground">Pathways 360</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-brand-teal/10 text-brand-teal">
            {user.role === "admin" ? "Admin" : "Case Manager"}
          </Badge>
        </div>
      </nav>

      <div className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Case Manager Portal</h1>
              <p className="text-muted-foreground text-sm">Monitor client progress and coordinate support</p>
            </div>
          </div>
        </div>

        {/* Consent Notice */}
        <Card className="mb-6 border-brand-teal/20 bg-brand-teal/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-brand-teal flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-brand-teal">Privacy & Consent</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You can only view progress for clients who have explicitly granted you access. 
                  All data is handled with strict confidentiality in accordance with privacy laws.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clients List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-teal" />
              Your Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : !clients || clients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="font-medium text-foreground">No clients yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Clients will appear here once they grant you access in their privacy settings.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {clients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-semibold text-sm">
                        {client.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{client.name || "Anonymous"}</p>
                        <p className="text-xs text-muted-foreground">{client.email || "No email"}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-brand-teal border-brand-teal/30">
                      Consented
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resource Management for Org Admins */}
        {user.role === "admin" && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-teal" />
                Organization Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-1"
                  onClick={() => {
                    toast.info("Resource management coming soon");
                  }}
                >
                  <Building2 className="w-5 h-5 text-brand-teal" />
                  <span className="font-medium">Manage Resources</span>
                  <span className="text-xs text-muted-foreground">Add or update service listings</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-1"
                  onClick={() => {
                    toast.info("Announcements coming soon");
                  }}
                >
                  <Users className="w-5 h-5 text-brand-teal" />
                  <span className="font-medium">Send Announcement</span>
                  <span className="text-xs text-muted-foreground">Notify clients of updates</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
