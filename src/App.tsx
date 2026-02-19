import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Artists from "./pages/Artists";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { ArtistLayout } from "@/components/artist/ArtistLayout";
import ArtistDashboardHome from "./pages/artist/ArtistDashboardHome";
import ArtistBookings from "./pages/artist/ArtistBookings";
import ArtistAvailability from "./pages/artist/ArtistAvailability";
import ArtistMessages from "./pages/artist/ArtistMessages";
import ArtistReviews from "./pages/artist/ArtistReviews";
import ArtistEarnings from "./pages/artist/ArtistEarnings";
import ArtistProfile from "./pages/artist/ArtistProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public / Customer routes */}
            <Route path="/" element={<Index />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Artist routes */}
            <Route
              path="/artist-dashboard"
              element={
                <ProtectedRoute allowedRoles={["artist"]}>
                  <ArtistLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ArtistDashboardHome />} />
              <Route path="bookings" element={<ArtistBookings />} />
              <Route path="availability" element={<ArtistAvailability />} />
              <Route path="messages" element={<ArtistMessages />} />
              <Route path="reviews" element={<ArtistReviews />} />
              <Route path="earnings" element={<ArtistEarnings />} />
              <Route path="profile" element={<ArtistProfile />} />
            </Route>

            {/* Admin routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
