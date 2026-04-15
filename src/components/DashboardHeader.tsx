import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DashboardHeader = () => {
  const { profile, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold gradient-text">TaskFlow</h1>
          <Badge variant="outline" className="gap-1 text-xs">
            {role === "admin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
            {role ?? "user"}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {profile?.display_name ?? profile?.email}
          </span>
          {role === "admin" && (
            <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
              Admin Panel
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
