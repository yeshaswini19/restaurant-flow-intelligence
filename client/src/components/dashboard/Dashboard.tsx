"use client";

import Hero from "./Hero";
import StatsGrid from "./StatsGrid";
import AnalyticsCharts from "./AnalyticsCharts";
import KitchenFlow from "./KitchenFlow";
import RecentOrders from "./RecentOrders";
import LowStockAlerts from "./LowStockAlerts";
import AICopilot from "./AICopilot";

export default function Dashboard() {
  return (
    <main className="space-y-10">
      <Hero />

      <AICopilot />
      
      <StatsGrid />

      <AnalyticsCharts />

      <KitchenFlow />

      <RecentOrders />

      <LowStockAlerts />
    </main>
  );
}