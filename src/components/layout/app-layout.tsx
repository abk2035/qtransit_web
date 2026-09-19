import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { cn } from "@/lib/utils";

export const AppLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 text-text-primary dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Fixed Collapsible Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area offset by Sidebar */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "pl-20" : "pl-70"
        )}
      >
        {/* Sticky Topbar */}
        <Topbar isCollapsed={isCollapsed} />

        {/* Dynamic Outlet / Page Container */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-in fade-in duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
