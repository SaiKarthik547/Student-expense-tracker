import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-4 right-4 z-40">
        <div className="w-10 h-10 rounded-full bg-primary/20 animate-pulse"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="fixed top-4 right-4 z-40 bg-card border border-border p-2 rounded-lg simple-shadow">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-sm font-bold text-primary-foreground">
            {user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-foreground">
            {user.email?.split('@')[0]}
          </p>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
      </div>
    </div>
  );
};