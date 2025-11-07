import { Home, BarChart3, CreditCard, PiggyBank, Upload, MapPin, User, LogOut, MoreVertical, TestTube2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Testing", path: "/testing", icon: TestTube2 },
  { name: "Bank Info", path: "/bank-info", icon: CreditCard },
  { name: "Budgets", path: "/budgets", icon: PiggyBank },
  { name: "Import", path: "/import", icon: Upload },
  { name: "Location", path: "/location", icon: MapPin },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Test Transactions", path: "/test-transactions", icon: TestTube2 },
];

export default function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="text-xl font-bold text-primary simple-hover"
          >
            💰 Student Finance
          </Link>
          
          <div className="flex items-center space-x-2">
            {/* Desktop Navigation - Show main pages */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.slice(0, 3).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                   className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium simple-hover ${
                     location.pathname === item.path
                       ? 'bg-primary/10 text-primary border border-primary/20'
                       : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                   }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>

            {/* More Menu for additional pages */}
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover:bg-muted/50 simple-hover"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-48 animate-fade-in simple-shadow"
              >
                {/* Show all pages on mobile, additional pages on desktop */}
                {navItems.slice(3).map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center w-full px-2 py-2 transition-all duration-200 ${
                        location.pathname === item.path
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-2 py-2 text-destructive hover:bg-destructive/10 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}