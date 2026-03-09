import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/analyze", label: "Check Offer" },
    { to: "/reports", label: "Scam Reports" },
    ...(user ? [{ to: "/report", label: "Report Scam" }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <Shield className="h-6 w-6 text-primary" />
          <span>ScamShield</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to}>
              <Button variant={isActive(l.to) ? "secondary" : "ghost"} size="sm">
                {l.label}
              </Button>
            </Link>
          ))}
          {user ? (
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              Sign Out
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="hero" size="sm">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-card p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>
                <Button variant={isActive(l.to) ? "secondary" : "ghost"} className="w-full justify-start">
                  {l.label}
                </Button>
              </Link>
            ))}
            {user ? (
              <Button variant="outline" onClick={() => { signOut(); setMobileOpen(false); }}>Sign Out</Button>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)}>
                <Button variant="hero" className="w-full">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
