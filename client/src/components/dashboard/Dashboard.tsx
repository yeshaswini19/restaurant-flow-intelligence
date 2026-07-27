"use client";

import Hero from "./Hero";
import StatsGrid from "./StatsGrid";
import AnalyticsCharts from "./AnalyticsCharts";
import KitchenFlow from "./KitchenFlow";
import RecentOrders from "./RecentOrders";
import LowStockAlerts from "./LowStockAlerts";
import AICopilot from "./AICopilot";
import AIChat from "./AIChat";

export default function Dashboard() {
  return (
    <main className="space-y-10">
      <Hero />

      <div className="grid gap-6 lg:grid-cols-2">
        <AICopilot />
        <AIChat />
      </div>

      <StatsGrid />

      <AnalyticsCharts />

      <KitchenFlow />

      <RecentOrders />

      <LowStockAlerts />
    </main>
  );
}