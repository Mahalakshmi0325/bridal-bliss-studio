import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, DollarSign } from "lucide-react";

interface BillingRecord {
  id: string;
  amount: number;
  tax: number | null;
  total: number;
  payment_status: string;
  created_at: string;
}

export default function ArtistEarnings() {
  const { user } = useAuth();
  const [records, setRecords] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: artist } = await supabase.from("artists").select("id").eq("user_id", user.id).maybeSingle();
      if (!artist) { setLoading(false); return; }
      const { data: bookings } = await supabase.from("bookings").select("id").eq("artist_id", artist.id);
      const ids = bookings?.map((b) => b.id) || [];
      if (ids.length === 0) { setLoading(false); return; }
      const { data } = await supabase.from("billing").select("*").in("booking_id", ids).eq("payment_status", "paid").order("created_at", { ascending: false });
      setRecords((data as BillingRecord[]) || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const totalEarnings = records.reduce((sum, r) => sum + Number(r.total), 0);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-foreground">Earnings</h2>
      <Card className="shadow-soft max-w-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
          <DollarSign className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent><p className="text-3xl font-bold text-foreground">₹{totalEarnings.toLocaleString()}</p></CardContent>
      </Card>
      {records.length > 0 && (
        <div className="grid gap-3">
          {records.map((r) => (
            <Card key={r.id} className="shadow-soft">
              <CardContent className="pt-4 flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                <span className="font-semibold text-foreground">₹{Number(r.total).toLocaleString()}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
