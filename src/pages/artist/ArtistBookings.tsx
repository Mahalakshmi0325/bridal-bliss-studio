import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Loader2 } from "lucide-react";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  style: string | null;
  booking_date: string;
  booking_time: string;
  location: string;
  status: string;
  message: string | null;
}

export default function ArtistBookings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!user) return;
    const { data: artist } = await supabase
      .from("artists").select("id").eq("user_id", user.id).maybeSingle();
    if (!artist) { setLoading(false); return; }

    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("artist_id", artist.id)
      .order("booking_date", { ascending: false });

    setBookings((data as Booking[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [user]);

  const updateStatus = async (id: string, status: "artist_accepted" | "cancelled" | "completed") => {
    setUpdating(id);
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Booking ${status.replace("_", " ")}.` });
      fetchBookings();
    }
    setUpdating(null);
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "pending": return "secondary";
      case "admin_verified": return "default";
      case "artist_accepted": return "default";
      case "completed": return "default";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-foreground">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-muted-foreground">No bookings assigned yet.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <Card key={b.id} className="shadow-soft">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{b.name}</CardTitle>
                  <Badge variant={statusColor(b.status)}>{b.status.replace("_", " ")}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <span>Service: {b.service}</span>
                  <span>Date: {b.booking_date}</span>
                  <span>Time: {b.booking_time}</span>
                  <span>Location: {b.location}</span>
                  <span>Phone: {b.phone}</span>
                  <span>Email: {b.email}</span>
                </div>
                {b.message && <p className="text-muted-foreground italic">"{b.message}"</p>}
                {b.status === "admin_verified" && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" onClick={() => updateStatus(b.id, "artist_accepted")} disabled={updating === b.id}>
                      <Check className="h-4 w-4 mr-1" /> Accept
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => updateStatus(b.id, "cancelled")} disabled={updating === b.id}>
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                )}
                {b.status === "artist_accepted" && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, "completed")} disabled={updating === b.id}>
                    Mark Completed
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
