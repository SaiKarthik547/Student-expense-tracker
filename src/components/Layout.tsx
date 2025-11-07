import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import { UserProfile } from "./UserProfile";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <UserProfile />
      <main className="pt-20 min-h-screen">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};