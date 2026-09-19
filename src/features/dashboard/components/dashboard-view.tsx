import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Bus,
  Users,
  CreditCard,
  Percent,
  Clock,
  AlertCircle,
  CheckCircle2,
  Ticket,
  MapPin,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

export const DashboardView: React.FC = () => {
  const { t } = useLanguage();

  const mockKpiData = [
    {
      title: t.dashboard.kpis.dailyRevenue,
      value: formatCurrency(3850000),
      trend: "+14.2%",
      isPositive: true,
      subtitle: `${t.dashboard.kpis.revenueSubtitle} (3 370 000 FCFA)`,
      icon: CreditCard,
    },
    {
      title: t.dashboard.kpis.scheduledTrips,
      value: "28",
      trend: "+4",
      isPositive: true,
      subtitle: `18 ${t.dashboard.kpis.tripsSubtitle}`,
      icon: Bus,
    },
    {
      title: t.dashboard.kpis.passengers,
      value: "1 240",
      trend: "+8.5%",
      isPositive: true,
      subtitle: t.dashboard.kpis.passengersSubtitle,
      icon: Users,
    },
    {
      title: t.dashboard.kpis.occupancyRate,
      value: "86.4%",
      trend: "-2.1%",
      isPositive: false,
      subtitle: t.dashboard.kpis.occupancySubtitle,
      icon: Percent,
    },
  ];

  const mockUpcomingTrips = [
    {
      id: "TR-001",
      line: "Abidjan → Bouaké",
      departureTime: "08:30",
      bus: "Bus #104 (VIP 50 pl.)",
      driver: "Kouassi Jean",
      bookedSeats: 48,
      totalSeats: 50,
      price: 10000,
      status: "BOARDING" as const,
    },
    {
      id: "TR-002",
      line: "Abidjan → San-Pédro",
      departureTime: "09:00",
      bus: "Bus #208 (Clim 45 pl.)",
      driver: "Traoré Moussa",
      bookedSeats: 45,
      totalSeats: 45,
      price: 9000,
      status: "SCHEDULED" as const,
    },
    {
      id: "TR-003",
      line: "Abidjan → Yamoussoukro",
      departureTime: "09:30",
      bus: "Bus #112 (VIP 50 pl.)",
      driver: "Konan Marc",
      bookedSeats: 39,
      totalSeats: 50,
      price: 6000,
      status: "SCHEDULED" as const,
    },
    {
      id: "TR-004",
      line: "Abidjan → Korhogo",
      departureTime: "10:00",
      bus: "Bus #301 (VIP 55 pl.)",
      driver: "Ouattara Bakary",
      bookedSeats: 52,
      totalSeats: 55,
      price: 15000,
      status: "SCHEDULED" as const,
    },
  ];

  const mockRecentActivities = [
    {
      id: "act-1",
      type: "SALE",
      title: `${t.dashboard.liveActivities.sale} (2 ${t.common.seats})`,
      desc: "Billet #TKT-88492 — Abidjan → Bouaké",
      amount: "+20 000 FCFA",
      time: "3 min",
      user: "Guichetier 02",
    },
    {
      id: "act-2",
      type: "BOARDING",
      title: t.dashboard.liveActivities.boardingScan,
      desc: "Passager: Bamba Salif (Siège 14)",
      amount: t.dashboard.liveActivities.validated,
      time: "7 min",
      user: "Contrôleur Nord",
    },
    {
      id: "act-3",
      type: "SALE",
      title: t.dashboard.liveActivities.onlineSale,
      desc: "Billet #TKT-88491 — Abidjan → Yamoussoukro",
      amount: "+6 000 FCFA",
      time: "12 min",
      user: "Mobile Money",
    },
    {
      id: "act-4",
      type: "ALERT",
      title: t.dashboard.liveActivities.maintenanceAlert,
      desc: "Bus #108 — Vidange requise (10 000 km)",
      amount: t.dashboard.liveActivities.warning,
      time: "25 min",
      user: "Système",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Title and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary dark:text-slate-100 flex items-center gap-2">
            {t.dashboard.title}
          </h1>
          <p className="text-sm text-text-secondary dark:text-slate-400 mt-1">
            {t.dashboard.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="md">
            <RefreshCw className="h-4 w-4 text-text-secondary dark:text-slate-400" />
            <span>{t.dashboard.refresh}</span>
          </Button>
          <Button variant="primary" size="md">
            <Ticket className="h-4 w-4" />
            <span>{t.dashboard.sellTicket}</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mockKpiData.map((kpi, idx) => (
          <Card key={idx} className="relative overflow-hidden hover:shadow-card-hover transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary dark:text-slate-400 truncate">
                  {kpi.title}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-btn bg-primary-50 dark:bg-teal-950/60 text-primary dark:text-accent">
                  <kpi.icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-text-primary dark:text-slate-100">
                  {kpi.value}
                </span>
                <span
                  className={`inline-flex items-center text-xs font-semibold gap-0.5 ${
                    kpi.isPositive ? "text-status-success-text dark:text-emerald-400" : "text-status-danger-text dark:text-rose-400"
                  }`}
                >
                  {kpi.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {kpi.trend}
                </span>
              </div>

              <p className="text-[11px] text-text-muted dark:text-slate-500 mt-2 truncate">
                {kpi.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout: Upcoming Trips & Live Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Trips Data Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-text-primary dark:text-slate-100">
                {t.dashboard.upcomingDepartures.title}
              </h2>
              <p className="text-xs text-text-secondary dark:text-slate-400">
                {t.dashboard.upcomingDepartures.subtitle}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary dark:text-accent hover:text-primary-hover gap-1">
              <span>{t.dashboard.upcomingDepartures.viewAll}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.dashboard.upcomingDepartures.colRoute}</TableHead>
                <TableHead>{t.dashboard.upcomingDepartures.colDeparture}</TableHead>
                <TableHead>{t.dashboard.upcomingDepartures.colBusDriver}</TableHead>
                <TableHead>{t.dashboard.upcomingDepartures.colOccupancy}</TableHead>
                <TableHead>{t.dashboard.upcomingDepartures.colStatus}</TableHead>
                <TableHead className="text-right">{t.dashboard.upcomingDepartures.colAction}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUpcomingTrips.map((trip) => {
                const fillPercentage = Math.round((trip.bookedSeats / trip.totalSeats) * 100);
                const isFull = fillPercentage >= 100;

                return (
                  <TableRow key={trip.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-primary dark:text-slate-200 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-primary dark:text-accent" /> {trip.line}
                        </span>
                        <span className="text-[11px] text-text-muted dark:text-slate-500">{trip.id}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center gap-1 font-semibold text-xs text-text-primary dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        <Clock className="h-3 w-3 text-text-secondary dark:text-slate-400" />
                        {trip.departureTime}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="text-text-primary dark:text-slate-200 font-medium">{trip.bus}</span>
                        <span className="text-text-secondary dark:text-slate-400 text-[11px]">{trip.driver}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1 w-28">
                        <div className="flex justify-between text-[11px] font-medium text-text-primary dark:text-slate-200">
                          <span>{trip.bookedSeats}/{trip.totalSeats} {t.common.seats}</span>
                          <span className={isFull ? "text-status-danger font-semibold" : "text-text-secondary dark:text-slate-400"}>
                            {fillPercentage}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isFull ? "bg-status-danger" : fillPercentage > 80 ? "bg-primary dark:bg-teal-500" : "bg-accent"
                            }`}
                            style={{ width: `${fillPercentage}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {trip.status === "BOARDING" ? (
                        <Badge variant="warning">{t.dashboard.upcomingDepartures.boarding}</Badge>
                      ) : (
                        <Badge variant="info">{t.dashboard.upcomingDepartures.scheduled}</Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        {t.dashboard.upcomingDepartures.manage}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Right Col: Live Feed & Fleet Overview */}
        <div className="space-y-6">
          {/* Live Activities Feed */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">{t.dashboard.liveActivities.title}</CardTitle>
                <span className="flex h-2 w-2 rounded-full bg-status-success" />
              </div>
              <CardDescription>{t.dashboard.liveActivities.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                {mockRecentActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs border-b border-border/50 dark:border-slate-800/80 pb-3 last:border-0 last:pb-0">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-primary dark:text-accent">
                      {act.type === "SALE" ? (
                        <CreditCard className="h-3.5 w-3.5" />
                      ) : act.type === "BOARDING" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-status-success" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-status-warning" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-text-primary dark:text-slate-200 truncate">{act.title}</p>
                        <span className="font-medium text-primary dark:text-accent text-[11px] shrink-0">{act.amount}</span>
                      </div>
                      <p className="text-text-secondary dark:text-slate-400 text-[11px] truncate">{act.desc}</p>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-text-muted dark:text-slate-500">
                        <span>{act.user}</span>
                        <span>{act.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Fleet Health Widget */}
          <Card className="bg-gradient-to-br from-sidebar to-slate-900 text-white border-0 shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">{t.dashboard.fleetAvailability.title}</span>
                <Badge variant="primary" className="bg-accent/20 text-accent border-accent/30 text-[10px]">
                  12/14 {t.dashboard.fleetAvailability.ready}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-800/80 p-2.5 rounded-btn border border-slate-700/50">
                  <span className="text-lg font-bold text-white">8</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.dashboard.fleetAvailability.inTrip}</p>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-btn border border-slate-700/50">
                  <span className="text-lg font-bold text-accent">4</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.dashboard.fleetAvailability.inStation}</p>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-btn border border-slate-700/50">
                  <span className="text-lg font-bold text-status-warning">2</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.dashboard.fleetAvailability.maintenance}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
              >
                {t.dashboard.fleetAvailability.inspectFleet}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
