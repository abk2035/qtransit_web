import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Route,
  Bus,
  Users2,
  Ticket,
  Receipt,
  UserSquare2,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/context/auth-context";
import { UserProfileModal } from "@/features/auth/components/user-profile-modal";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const navSections = [
    {
      sectionTitle: t.nav.main,
      items: [
        { title: t.nav.dashboard, href: "/", icon: LayoutDashboard },
      ],
    },
    {
      sectionTitle: t.nav.operations,
      items: [
        { title: t.nav.trips, href: "/trips", icon: Route },
        { title: t.nav.fleet, href: "/fleet", icon: Bus, badge: "12" },
        { title: t.nav.employees, href: "/employees", icon: Users2 },
      ],
    },
    {
      sectionTitle: t.nav.ticketing,
      items: [
        { title: t.nav.counterSales, href: "/ticketing", icon: Ticket },
        { title: t.nav.tickets, href: "/tickets", icon: Receipt },
      ],
    },
    {
      sectionTitle: t.nav.management,
      items: [
        { title: t.nav.customers, href: "/customers", icon: UserSquare2 },
        { title: t.nav.agencies, href: "/agencies", icon: Building2 },
        { title: t.nav.settings, href: "/settings", icon: Settings },
      ],
    },
  ];

  const roleLabel = user ? t.roles[user.role] || user.role : "";
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : "QT";

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col bg-sidebar text-sidebar-text border-r border-sidebar-border transition-all duration-300 ease-in-out select-none",
          isCollapsed ? "w-20" : "w-70"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between px-4 border-b border-sidebar-border/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-primary text-white shadow-md">
              <Bus className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  QTransit <span className="text-[10px] font-semibold bg-accent/20 text-accent px-1.5 py-0.5 rounded">ERP</span>
                </span>
                <span className="text-xs text-text-muted truncate">TransExpress SA</span>
              </div>
            )}
          </div>

          {/* Collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-sidebar-text hover:text-white hover:bg-sidebar-hover transition-colors"
            title={isCollapsed ? "Agrandir le menu" : "Réduire le menu"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && section.sectionTitle && (
                <h4 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  {section.sectionTitle}
                </h4>
              )}
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-medium transition-all group relative",
                      isActive
                        ? "bg-primary text-white shadow-sm font-semibold"
                        : "text-slate-300 hover:bg-sidebar-hover hover:text-white"
                    )
                  }
                  title={isCollapsed ? item.title : undefined}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-105")} />
                  {!isCollapsed && (
                    <span className="flex-1 truncate">{item.title}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-accent">
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && item.badge && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {/* User / Session Footer */}
        {user && (
          <div className="p-3 border-t border-sidebar-border/60">
            <div className={cn(
              "flex items-center gap-2 rounded-btn p-2 bg-sidebar-hover/60",
              isCollapsed ? "justify-center" : "justify-between"
            )}>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2.5 overflow-hidden text-left hover:opacity-90 transition-opacity flex-1 min-w-0"
                title={t.nav.profile}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-700 text-white text-xs font-semibold">
                  {initials}
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-white truncate">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-[11px] text-accent flex items-center gap-1 truncate">
                      <ShieldCheck className="h-3 w-3 shrink-0" />
                      <span className="truncate">{roleLabel}</span>
                    </span>
                  </div>
                )}
              </button>

              {!isCollapsed && (
                <button
                  onClick={logout}
                  className="text-sidebar-text hover:text-status-danger transition-colors p-1.5 rounded-lg hover:bg-slate-800 shrink-0"
                  title={t.nav.logout}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};
