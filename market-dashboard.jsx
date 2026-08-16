import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ScatterChart, Scatter, ZAxis, BarChart, Bar, Cell,
  ResponsiveContainer, RadialBarChart, RadialBar,
} from "recharts";
import { TrendingUp, ShieldAlert, Building2, Gauge, ExternalLink } from "lucide-react";

// ---------------------------------------------------------------------------
// SAMPLE / ILLUSTRATIVE DATA
// Compiled for portfolio purposes — not live market data. See footer for
// guidance on wiring this up to a real feed (Alpha Vantage / Yahoo Finance).
// ---------------------------------------------------------------------------

const marketGrowth = [
  { year: 2019, sizeUSDbn: 92, cagr: null },
  { year: 2020, sizeUSDbn: 101, cagr: 9.8 },
  { year: 2021, sizeUSDbn: 118, cagr: 16.8 },
  { year: 2022, sizeUSDbn: 139, cagr: 17.8 },
  { year: 2023, sizeUSDbn: 163, cagr: 17.3 },
  { year: 2024, sizeUSDbn: 191, cagr: 17.2 },
  { year: 2025, sizeUSDbn: 221, cagr: 15.7 },
  { year: 2026, sizeUSDbn: 253, cagr: 14.5 },
];

const competitors = [
  { name: "Meridian Solar Holdings", revenueUSDm: 480, growthPct: 22, marketSharePct: 11, region: "UK" },
  { name: "Northwind Renewables", revenueUSDm: 310, growthPct: 31, marketSharePct: 7, region: "EU" },
  { name: "Solvara Energy Group", revenueUSDm: 720, growthPct: 14, marketSharePct: 16, region: "UK" },
  { name: "Aravane Power", revenueUSDm: 210, growthPct: 38, marketSharePct: 5, region: "EU" },
  { name: "Cascade Grid Partners", revenueUSDm: 890, growthPct: 9, marketSharePct: 19, region: "US" },
  { name: "Fenwick Wind Assets", revenueUSDm: 150, growthPct: 44, marketSharePct: 4, region: "UK" },
  { name: "Iberian Sun Capital", revenueUSDm: 260, growthPct: 27, marketSharePct: 6, region: "EU" },
];

const regionalRisk = [
  { region: "UK", riskIndex: 42, label: "Moderate" },
  { region: "EU", riskIndex: 58, label: "Elevated" },
  { region: "US", riskIndex: 35, label: "Moderate" },
  { region: "APAC", riskIndex: 71, label: "High" },
];

const dealReadiness = [
  { name: "Score", value: 74, fill: "#C9A227" },
];

const dueDiligenceFlags = [
  { area: "Regulatory", note: "Grid-connection permitting timelines lengthening across EU sites", severity: "Elevated" },
  { area: "Financial", note: "EBITDA margins compressing on 2 of 7 comparables year-over-year", severity: "Watch" },
  { area: "Operational", note: "Supply chain concentration in inverter components (2 suppliers)", severity: "Watch" },
  { area: "ESG", note: "All comparables report Scope 1/2 emissions; Scope 3 disclosure inconsistent", severity: "Moderate" },
];

const severityColor = {
  Elevated: "#C1554B",
  Watch: "#C9A227",
  Moderate: "#4F8C82",
};

const REGION_COLOR = { UK: "#C9A227", EU: "#4F8C82", US: "#8B97A8", APAC: "#C1554B" };

// ---------------------------------------------------------------------------

function KPI({ icon: Icon, label, value, sublabel }) {
  return (
    <div className="flex-1 min-w-[180px] bg-[#16283F] border border-[#22374F] rounded-sm p-5">
      <div className="flex items-center gap-2 text-[#8B97A8] text-xs tracking-widest uppercase mb-3">
        <Icon size={14} strokeWidth={1.75} />
        {label}
      </div>
      <div className="text-[#EDE8DD] text-3xl font-serif tabular-nums">{value}</div>
      {sublabel && <div className="text-[#8B97A8] text-xs mt-1">{sublabel}</div>}
    </div>
  );
}

function CustomTooltip({ active, payload, label, suffix = "" }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-[#0F1B2D] border border-[#C9A227]/40 rounded-sm px-3 py-2 text-xs">
      <div className="text-[#8B97A8] mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="text-[#EDE8DD] tabular-nums">
          {p.name ? `${p.name}: ` : ""}{p.value}{suffix}
        </div>
      ))}
    </div>
  );
}

export default function MarketDashboard() {
  const [hoveredCompetitor, setHoveredCompetitor] = useState(null);
  const latestCagr = marketGrowth[marketGrowth.length - 1].cagr;
  const totalMarket = marketGrowth[marketGrowth.length - 1].sizeUSDbn;
  const avgRisk = useMemo(
    () => Math.round(regionalRisk.reduce((s, r) => s + r.riskIndex, 0) / regionalRisk.length),
    []
  );

  return (
    <div className="min-h-screen bg-[#0F1B2D] p-6 md:p-10 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Inter:wght@400;500;600&display=swap');
        .font-serif { font-family: 'Source Serif 4', Georgia, serif; }
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 border-b border-[#22374F] pb-6">
        <div className="text-[#C9A227] text-xs tracking-[0.2em] uppercase mb-2">
          Sector Intelligence Briefing — Prepared for Portfolio Review
        </div>
        <h1 className="text-[#EDE8DD] font-serif text-3xl md:text-4xl">
          Renewable Energy Infrastructure
        </h1>
        <p className="text-[#8B97A8] text-sm mt-2 max-w-2xl">
          Solar and wind generation assets, UK/EU/US mid-market. Compiled as an
          illustrative investment-research exercise, structured the way a PE
          analyst would brief an investment committee.
        </p>
      </div>

      {/* KPI Strip */}
      <div className="max-w-6xl mx-auto flex flex-wrap gap-4 mb-8">
        <KPI icon={TrendingUp} label="Market Size (2026)" value={`$${totalMarket}bn`} sublabel="Global, illustrative" />
        <KPI icon={Gauge} label="YoY Growth" value={`${latestCagr}%`} sublabel="Trailing CAGR" />
        <KPI icon={Building2} label="Tracked Comparables" value={competitors.length} sublabel="Mid-market operators" />
        <KPI icon={ShieldAlert} label="Avg. Regulatory Risk" value={avgRisk} sublabel="Index, 0–100 scale" />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Market growth chart */}
        <div className="lg:col-span-2 bg-[#16283F] border border-[#22374F] rounded-sm p-5">
          <div className="text-[#EDE8DD] font-serif text-lg mb-1">Market Growth Trajectory</div>
          <div className="text-[#8B97A8] text-xs mb-4">Global market size, USD billions, 2019–2026</div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={marketGrowth}>
              <defs>
                <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A227" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#C9A227" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#22374F" vertical={false} />
              <XAxis dataKey="year" stroke="#8B97A8" fontSize={12} tickLine={false} axisLine={{ stroke: "#22374F" }} />
              <YAxis stroke="#8B97A8" fontSize={12} tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<CustomTooltip suffix="bn" />} />
              <Area type="monotone" dataKey="sizeUSDbn" name="Market size" stroke="#C9A227" strokeWidth={2} fill="url(#growthFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Deal readiness gauge — signature element */}
        <div className="bg-[#16283F] border border-[#22374F] rounded-sm p-5 flex flex-col">
          <div className="text-[#EDE8DD] font-serif text-lg mb-1">Deal Readiness Score</div>
          <div className="text-[#8B97A8] text-xs mb-2">Composite: growth, risk, competitive intensity</div>
          <div className="flex-1 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                innerRadius="70%" outerRadius="100%" data={dealReadiness}
                startAngle={90} endAngle={-270}
              >
                <RadialBar dataKey="value" cornerRadius={20} background={{ fill: "#22374F" }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <div className="text-[#EDE8DD] font-serif text-4xl tabular-nums">74</div>
              <div className="text-[#8B97A8] text-[10px] uppercase tracking-widest">of 100</div>
            </div>
          </div>
          <div className="text-[#8B97A8] text-xs mt-2 leading-relaxed">
            Strong growth momentum offset by elevated permitting risk in two
            core regions. Warrants further diligence, not a pass/fail signal.
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Competitive landscape scatter */}
        <div className="lg:col-span-2 bg-[#16283F] border border-[#22374F] rounded-sm p-5">
          <div className="text-[#EDE8DD] font-serif text-lg mb-1">Competitive Landscape</div>
          <div className="text-[#8B97A8] text-xs mb-4">Revenue vs. growth rate, bubble size = market share</div>
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid stroke="#22374F" />
              <XAxis type="number" dataKey="revenueUSDm" name="Revenue" unit="m" stroke="#8B97A8" fontSize={12} tickLine={false} axisLine={{ stroke: "#22374F" }} />
              <YAxis type="number" dataKey="growthPct" name="Growth" unit="%" stroke="#8B97A8" fontSize={12} tickLine={false} axisLine={false} width={40} />
              <ZAxis type="number" dataKey="marketSharePct" range={[80, 400]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3", stroke: "#22374F" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-[#0F1B2D] border border-[#C9A227]/40 rounded-sm px-3 py-2 text-xs">
                      <div className="text-[#EDE8DD] font-medium mb-1">{d.name}</div>
                      <div className="text-[#8B97A8]">Revenue: ${d.revenueUSDm}m</div>
                      <div className="text-[#8B97A8]">Growth: {d.growthPct}%</div>
                      <div className="text-[#8B97A8]">Share: {d.marketSharePct}%</div>
                    </div>
                  );
                }}
              />
              <Scatter data={competitors} onMouseEnter={(d) => setHoveredCompetitor(d.name)}>
                {competitors.map((c, i) => (
                  <Cell key={i} fill={REGION_COLOR[c.region]} fillOpacity={0.85} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-xs text-[#8B97A8]">
            {Object.entries(REGION_COLOR).map(([region, color]) => (
              <div key={region} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
                {region}
              </div>
            ))}
          </div>
        </div>

        {/* Regional risk bar */}
        <div className="bg-[#16283F] border border-[#22374F] rounded-sm p-5">
          <div className="text-[#EDE8DD] font-serif text-lg mb-1">Regulatory Risk by Region</div>
          <div className="text-[#8B97A8] text-xs mb-4">Index, 0 (low) – 100 (high)</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={regionalRisk} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid stroke="#22374F" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="#8B97A8" fontSize={12} tickLine={false} axisLine={{ stroke: "#22374F" }} />
              <YAxis type="category" dataKey="region" stroke="#8B97A8" fontSize={12} tickLine={false} axisLine={false} width={45} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="riskIndex" name="Risk index" radius={[0, 3, 3, 0]}>
                {regionalRisk.map((r, i) => (
                  <Cell key={i} fill={r.riskIndex > 60 ? "#C1554B" : r.riskIndex > 45 ? "#C9A227" : "#4F8C82"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Due diligence flags */}
      <div className="max-w-6xl mx-auto bg-[#16283F] border border-[#22374F] rounded-sm p-5 mb-8">
        <div className="text-[#EDE8DD] font-serif text-lg mb-1">Due Diligence Flags</div>
        <div className="text-[#8B97A8] text-xs mb-4">Items warranting further review before an IC decision</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dueDiligenceFlags.map((f, i) => (
            <div key={i} className="border border-[#22374F] rounded-sm p-3 flex gap-3">
              <span
                className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm h-fit whitespace-nowrap"
                style={{ background: `${severityColor[f.severity]}22`, color: severityColor[f.severity] }}
              >
                {f.severity}
              </span>
              <div>
                <div className="text-[#EDE8DD] text-sm font-medium">{f.area}</div>
                <div className="text-[#8B97A8] text-xs mt-0.5">{f.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / methodology note */}
      <div className="max-w-6xl mx-auto border-t border-[#22374F] pt-5 text-[#8B97A8] text-xs leading-relaxed">
        <div className="flex items-start gap-2">
          <ExternalLink size={14} className="mt-0.5 shrink-0" />
          <p>
            <span className="text-[#C9A227]">Methodology:</span> figures above are
            illustrative sample data built for portfolio demonstration, not a live
            feed. To wire this to real data, replace the arrays at the top of the
            file with a call to a market data API (e.g. Alpha Vantage, Yahoo
            Finance) and a pandas script to reshape the response into the same
            shape. See the accompanying README for the swap-in steps.
          </p>
        </div>
      </div>
    </div>
  );
}
