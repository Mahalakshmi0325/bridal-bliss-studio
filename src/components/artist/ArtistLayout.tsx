import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ArtistSidebar } from "./ArtistSidebar";
import { ArtistTopbar } from "./ArtistTopbar";
import { ArtistMobileSidebar } from "./ArtistMobileSidebar";

export function ArtistLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <ArtistSidebar />
      <ArtistMobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col">
        <ArtistTopbar onMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
