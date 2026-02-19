import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ArtistAvailability() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [artistId, setArtistId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("artists").select("id, available").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) { setAvailable(data.available); setArtistId(data.id); }
      setLoading(false);
    });
  }, [user]);

  const toggleAvailability = async (checked: boolean) => {
    if (!artistId) return;
    setAvailable(checked);
    const { error } = await supabase.from("artists").update({ available: checked }).eq("id", artistId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setAvailable(!checked);
    } else {
      toast({ title: "Updated", description: `You are now ${checked ? "available" : "unavailable"}.` });
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-foreground">Availability</h2>
      <Card className="shadow-soft max-w-md">
        <CardHeader><CardTitle className="text-base">Availability Status</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-4">
          <Switch checked={available} onCheckedChange={toggleAvailability} id="avail" />
          <Label htmlFor="avail" className="text-sm">{available ? "Available for bookings" : "Not available"}</Label>
        </CardContent>
      </Card>
    </div>
  );
}
