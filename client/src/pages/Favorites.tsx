import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ArrowLeft, Heart, Clock, Phone, Globe, MapPin, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function Favorites() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const { data: favs = [], refetch: refetchFavs } = trpc.favorites.list.useQuery(undefined, { enabled: isAuthenticated });
  const { data: recent = [] } = trpc.favorites.recentlyViewed.useQuery(undefined, { enabled: isAuthenticated });

  const removeMutation = trpc.favorites.remove.useMutation({
    onSuccess: () => { toast.success("Removed from favorites"); refetchFavs(); },
    onError: (e) => toast.error(e.message),
  });

  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Please sign in to view favorites.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-bold text-lg">Saved Resources</h1>
            <p className="text-xs text-muted-foreground">Your favorites and recently viewed</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-6">
        {/* Favorites */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-red-500" />
            <h2 className="font-semibold">Favorites ({favs.length})</h2>
          </div>
          {favs.length === 0 ? (
            <div className="bg-white rounded-xl border p-6 text-center text-muted-foreground">
              <Heart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No favorites yet. Save resources from the Resource Navigator.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("/resources")}>Browse Resources</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {favs.map((fav: any) => (
                <div key={fav.id} className="bg-white rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{fav.resource?.name || fav.resourceName}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="secondary" className="text-xs capitalize">{(fav.resource?.category || "resource").replace(/_/g, " ")}</Badge>
                      </div>
                      {(fav.resource?.address || fav.resource?.city) && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{[fav.resource?.address, fav.resource?.city].filter(Boolean).join(", ")}
                        </p>
                      )}
                      {fav.resource?.phone && (
                        <a href={`tel:${fav.resource.phone}`} className="text-xs text-teal-600 flex items-center gap-1 mt-1 hover:underline">
                          <Phone className="w-3 h-3" />{fav.resource.phone}
                        </a>
                      )}
                    </div>
                    <button onClick={() => removeMutation.mutate({ resourceId: fav.resourceId })} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {fav.resource?.website && (
                    <a href={fav.resource.website} target="_blank" rel="noopener noreferrer" className="mt-2 text-xs text-blue-600 flex items-center gap-1 hover:underline">
                      <ExternalLink className="w-3 h-3" /> Visit Website
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recently Viewed */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold">Recently Viewed</h2>
          </div>
          {recent.length === 0 ? (
            <div className="bg-white rounded-xl border p-4 text-center text-muted-foreground text-sm">
              No recently viewed resources yet.
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((item: any) => (
                <div key={item.id} className="bg-white rounded-xl border p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.resource?.name || item.resourceName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{(item.resource?.category || "").replace(/_/g, " ")}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(item.viewedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
