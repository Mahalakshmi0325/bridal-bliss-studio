import { useEffect, useState } from "react";
import { CalendarCheck, Star, DollarSign, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function ArtistDashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ bookings: 0, reviews: 0, earnings: 0, pending: 0 });

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      // Get artist record
      const { data: artist } = await supabase
        .from("artists")
        .select("id, rating, total_reviews")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!artist) return;

      const { count: bookingCount } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("artist_id", artist.id);

      const { count: pendingCount } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("artist_id", artist.id)
        .eq("status", "admin_verified");

      const { data: billingData } = await supabase
        .from("billing")
        .select("total, booking_id")
        .eq("payment_status", "paid");

      // Filter billing to only this artist's bookings
      const { data: artistBookings } = await supabase
        .from("bookings")
        .select("id")
        .eq("artist_id", artist.id);

      const artistBookingIds = new Set(artistBookings?.map((b) => b.id) || []);
      const totalEarnings = billingData
        ?.filter((b) => artistBookingIds.has(b.booking_id))
        .reduce((sum, b) => sum + Number(b.total), 0) || 0;

      setStats({
        bookings: bookingCount || 0,
        reviews: artist.total_reviews || 0,
        earnings: totalEarnings,
        pending: pendingCount || 0,
      });
    };

    fetchStats();
  }, [user]);

  const cards = [
    { title: "Total Bookings", value: stats.bookings, icon: CalendarCheck, color: "text-primary" },
    { title: "Pending Requests", value: stats.pending, icon: Clock, color: "text-accent" },
    { title: "Reviews", value: stats.reviews, icon: Star, color: "text-gold" },
    { title: "Total Earnings", value: `₹${stats.earnings.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
  ];

  return (
    <div className="space-y-8">
      <h2 className="font-display text-2xl font-semibold text-foreground">Welcome Back!</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title} className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
