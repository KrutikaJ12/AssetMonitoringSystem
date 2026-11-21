import React, { useState } from "react";

type TabType = "trends" | "cells";

interface BmsLiveMetrics {
  soc: number;
  mode: "Charging (+)" | "Discharging (-)" | "Idle";
  voltageBalanceStatus: "CRITICAL" | "OK";
  voltageDelta: number;
  tempStatus: "OK" | "WARNING";
  maxTemp24h: number;
  packVoltage: number;
  batteryTemp: number;
  current: number;
  soh: number | null;
  cellVoltageDelta: number;
  cellTempDelta: number;
  estimatedMode: string;
  batteryInfo: string;
  productionDate: string;
  manufacturer: string;
  typeCapacityRating: string;
  maxCellV24h: number;
  minCellV24h: number;
  maxCellT24h: number;
  minCellT24h: number;
  totalPoints: number;
}

const mockBmsData: BmsLiveMetrics = {
  soc: 86,
  mode: "Charging (+)",
  voltageBalanceStatus: "CRITICAL",
  voltageDelta: 3.275,
  tempStatus: "OK",
  maxTemp24h: 26,
  packVoltage: 49.1,
  batteryTemp: 20.8,
  current: 2.9835,
  soh: null,
  cellVoltageDelta: 3.275,
  cellTempDelta: 3.0,
  estimatedMode: "--",
  batteryInfo: "Demo",
  productionDate: "--",
  manufacturer: "Demo",
  typeCapacityRating: "Demo / Demo",
  maxCellV24h: 3.277,
  minCellV24h: 3.273,
  maxCellT24h: 26.0,
  minCellT24h: 19.0,
  totalPoints: 631,
};

export default function BmsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("trends");
  const [threshold, setThreshold] = useState<number>(0.5);

  const data = mockBmsData;

  // Gauge needle angle calculation (-200A to +200A mapped to -90deg to +90deg)
  const clampedCurrent = Math.max(-200, Math.min(200, data.current));
  const needleAngle = (clampedCurrent / 200) * 90;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: LIVE OVERVIEW */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-semibold text-slate-700">Live Overview</h1>
          </div>

          {/* State of Charge Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">State of Charge</span>
              <span className="text-xs font-semibold text-emerald-600">High</span>
            </div>

            {/* Battery Bar */}
            <div className="flex items-center">
              <div className="relative h-14 w-full rounded-lg border border-slate-300 bg-slate-100 overflow-hidden p-1">
                <div
                  className="h-full rounded-md bg-emerald-500 transition-all duration-500 flex items-center justify-center"
                  style={{ width: `${data.soc}%` }}
                >
                  <span className="text-base font-bold text-slate-900">{data.soc}%</span>
                </div>
              </div>
              <div className="h-6 w-1.5 rounded-r bg-slate-300 ml-0.5" />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">Mode</span>
              <span className="font-semibold text-slate-700">{data.mode}</span>
            </div>

            {/* Status Badges */}
            <div className="space-y-2 pt-1">
              <div
                className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${
                  data.voltageBalanceStatus === "CRITICAL"
                    ? "border-red-400 bg-red-50 text-red-600"
                    : "border-emerald-400 bg-emerald-50 text-emerald-600"
                }`}
              >
                Voltage Balance: {data.voltageBalanceStatus} (Δ {data.voltageDelta.toFixed(3)}V)
              </div>

              <div>
                <span className="inline-block rounded-full border border-emerald-400 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  Temp Status: {data.tempStatus} ({data.maxTemp24h}°C)
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-1">
              Health badges update from latest cell snapshot + 24h max temp.
            </p>
          </div>

          {/* 2-Column Metric Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              title="Pack Voltage"
              value={`${data.packVoltage.toFixed(2)} V`}
              subtitle="Total pack voltage"
            />
            <MetricCard
              title="Battery Temp"
              value={`${data.batteryTemp.toFixed(1)} °C`}
              subtitle="Main / average"
            />
            <MetricCard
              title="Current"
              value={`${data.current.toFixed(4)} A`}
              subtitle="Charge (+) / Discharge (-)"
            />
            <MetricCard
              title="SOH"
              value={data.soh !== null ? `${data.soh}%` : "--"}
              subtitle="State of health"
            />
            <MetricCard
              title="Cell Voltage Δ"
              value={`${data.cellVoltageDelta.toFixed(3)} V`}
              subtitle="max(cellV) - min(cellV)"
            />
            <MetricCard
              title="Cell Temp Δ"
              value={`${data.cellTempDelta.toFixed(1)} °C`}
              subtitle="max(cellT) - min(cellT)"
            />
            <MetricCard
              title="Estimated Modes"
              value={data.estimatedMode}
              subtitle="Based on SOC + capacity"
            />
            <MetricCard
              title="Battery Info"
              value={data.batteryInfo}
              subtitle={`Production Date: ${data.productionDate}`}
            />
            <MetricCard
              title="Manufacturer"
              value={data.manufacturer}
              subtitle="Battery maker"
            />
            <MetricCard
              title="Type / Capacity / Rating"
              value="Demo"
              subtitle={data.typeCapacityRating}
            />
          </div>

          {/* Current Gauge Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">Current Gauge</span>
              <span className="text-xs text-slate-500">{data.mode}</span>
            </div>

            <div className="flex flex-col items-center justify-center py-2">
              <svg viewBox="0 0 240 135" className="w-full max-w-[260px]">
                {/* Semi-circle Arc Background */}
                <path
                  d="M 20 120 A 100 100 0 0 1 220 120"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="24"
                />
                {/* Center Tick */}
                <line x1="120" y1="8" x2="120" y2="32" stroke="#64748b" strokeWidth="2" />

                {/* Scale Labels */}
                <text x="38" y="114" fontSize="9" fill="#475569">-200</text>
                <text x="52" y="75" fontSize="9" fill="#475569">-120</text>
                <text x="84" y="47" fontSize="9" fill="#475569">-40</text>
                <text x="142" y="47" fontSize="9" fill="#475569">40</text>
                <text x="172" y="75" fontSize="9" fill="#475569">120</text>
                <text x="184" y="114" fontSize="9" fill="#475569">200</text>

                {/* Needle */}
                <g transform={`rotate(${needleAngle} 120 120)`}>
                  <polygon points="117,120 123,120 120,30" fill="#0284c7" />
                  <circle cx="120" cy="120" r="6" fill="#0f172a" />
                </g>
              </svg>

              <div className="text-center -mt-2">
                <div className="text-lg font-bold text-slate-800">
                  {data.current.toFixed(1)} A
                </div>
                <div className="text-[11px] text-slate-400">{data.mode}</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TRENDS & CELLS */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Trends & Cells</h2>
              <p className="text-xs text-slate-400">Range: last 24 hours</p>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Points: {data.totalPoints}
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            {/* Top 4 Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <SummaryHighlightCard
                label="Max Cell V"
                value={`${data.maxCellV24h.toFixed(3)} V`}
                sub="Last 24h"
              />
              <SummaryHighlightCard
                label="Min Cell V"
                value={`${data.minCellV24h.toFixed(3)} V`}
                sub="Last 24h"
              />
              <SummaryHighlightCard
                label="Max Cell T"
                value={`${data.maxCellT24h.toFixed(1)} °C`}
                sub="Last 24h"
              />
              <SummaryHighlightCard
                label="Min Cell T"
                value={`${data.minCellT24h.toFixed(1)} °C`}
                sub="Last 24h"
              />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("trends")}
                className={`rounded-full px-4 py-1 text-xs font-medium border transition ${
                  activeTab === "trends"
                    ? "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Trends
              </button>
              <button
                onClick={() => setActiveTab("cells")}
                className={`rounded-full px-4 py-1 text-xs font-medium border transition ${
                  activeTab === "cells"
                    ? "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Cells
              </button>
            </div>

            {activeTab === "trends" ? (
              <>
                {/* Timeline Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-700">
                      Timeline Controls
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Tune charge / idle / discharge classification
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                      Threshold: {threshold.toFixed(1)}A
                    </span>
                    <input
                      type="range"
                      min={0.1}
                      max={5.0}
                      step={0.1}
                      value={threshold}
                      onChange={(e) => setThreshold(parseFloat(e.target.value))}
                      className="w-36 accent-sky-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 2x3 Trend Chart Placeholders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ChartBox title="SOC Trend (%)" subtitle="Time markers are sampled" />
                  <ChartBox title="Pack Voltage (V)" subtitle="Over selected range" />
                  <ChartBox title="Current (A)" subtitle="Charge / Discharge" />
                  <ChartBox title="Battery Temp (°C)" subtitle="Main / average" />
                  <ChartBox
                    title="Charging / Discharging Timeline"
                    subtitle="Based on current"
                  />
                  <ChartBox title="Cell Imbalance ΔV Trend (V)" subtitle="ΔV trend" />
                </div>

                {/* Bottom Full-Width Scatter Chart */}
                <ChartBox
                  title="Smart View: SOC vs Voltage"
                  subtitle="Point cloud"
                  heightClass="h-52"
                />
              </>
            ) : (
              /* CELLS TAB VIEW */
              <div className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-xs font-semibold text-slate-700 mb-3">
                  Individual Cell Voltages & Temperatures
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                  {Array.from({ length: 16 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-center"
                    >
                      <div className="text-[11px] text-slate-400">Cell {idx + 1}</div>
                      <div className="text-xs font-bold text-slate-800 mt-0.5">
                        3.27{(idx % 5) + 3} V
                      </div>
                      <div className="text-[11px] text-emerald-600 mt-0.5">
                        22.{idx % 9}°C
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Sub-components --- */

function MetricCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
      <div className="text-xs font-medium text-slate-500">{title}</div>
      <div className="mt-1 text-base font-bold text-slate-800">{value}</div>
      <div className="mt-1 text-[11px] text-slate-400">{subtitle}</div>
    </div>
  );
}

function SummaryHighlightCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-3">
      <div className="text-[11px] font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-base font-bold text-slate-800">{value}</div>
      <div className="mt-0.5 text-[11px] text-slate-400">{sub}</div>
    </div>
  );
}

function ChartBox({
  title,
  subtitle,
  heightClass = "h-44",
}: {
  title: string;
  subtitle: string;
  heightClass?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3.5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-700">{title}</span>
        <span className="text-[11px] text-slate-400">{subtitle}</span>
      </div>
      <div
        className={`${heightClass} flex items-center justify-center rounded border border-dashed border-slate-200 bg-slate-50/50 text-xs text-slate-400`}
      >
        Chart Component ({title})
      </div>
    </div>
  );
}