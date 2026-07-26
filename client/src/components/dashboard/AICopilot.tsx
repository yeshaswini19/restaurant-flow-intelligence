"use client";

import { useEffect, useState } from "react";
import { BrainCircuit, AlertTriangle, TrendingUp, ShoppingCart } from "lucide-react";

type AIResponse = {
  healthScore: number;
  summary: string;
  risks: string[];
  opportunities: string[];
  recommendations: string[];
};

export default function AICopilot() {
  const [data, setData] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  async function loadInsights() {
    try {
      const res = await fetch("http://localhost:5000/ai/insights");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-3xl border border-cyan-500/20 bg-white/5 p-8">
        <p className="text-slate-400">Generating AI insights...</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded-3xl border border-red-500/20 bg-white/5 p-8">
        <p className="text-red-400">Unable to load AI insights.</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-white/5 p-8">
      <div className="flex items-center gap-3 mb-8">
        <BrainCircuit className="text-cyan-400" size={30} />
        <div>
          <h2 className="text-3xl font-bold text-white">
            KitchenPulse AI Copilot
          </h2>
          <p className="text-slate-400">
            Live operational intelligence
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-2xl bg-cyan-500/10 p-6">
        <p className="text-sm text-slate-400">Restaurant Health</p>

        <h3 className="mt-2 text-5xl font-bold text-cyan-400">
          {data.healthScore}/100
        </h3>

        <p className="mt-4 text-slate-300">
          {data.summary}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-2xl bg-slate-900/70 p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-400" />
            <h3 className="font-semibold text-white">Risks</h3>
          </div>

          <ul className="space-y-2">
            {data.risks.map((risk, index) => (
              <li key={index} className="text-slate-300">
                • {risk}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-slate-900/70 p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-400" />
            <h3 className="font-semibold text-white">
              Opportunities
            </h3>
          </div>

          <ul className="space-y-2">
            {data.opportunities.map((item, index) => (
              <li key={index} className="text-slate-300">
                • {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-slate-900/70 p-6">
          <div className="mb-4 flex items-center gap-2">
            <ShoppingCart className="text-yellow-400" />
            <h3 className="font-semibold text-white">
              Recommendations
            </h3>
          </div>

          <ul className="space-y-2">
            {data.recommendations.map((item, index) => (
              <li key={index} className="text-slate-300">
                • {item}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}