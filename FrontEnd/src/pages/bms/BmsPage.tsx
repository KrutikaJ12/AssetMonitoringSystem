import { useState } from "react";
import { useGetBmsData } from "../../hooks/useBmsInsights";
import { TabItem, Tabs } from "../../components/common/Tabs";
import LiveTracking from "../Tracking/LiveTrackingPage";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
// type TabType = "location"|"trends" | "cells";
const TABS = [
  { key: "location", label: "Location" },
  { key: "trends", label: "Trends" },
  { key: "cells", label: "Cells" },
] as const satisfies readonly TabItem[];

type TabType = (typeof TABS)[number]["key"];
const TREND_TABS = [
  { key: "soc", label: "SOC & SOH" },
  { key: "voltage", label: "Voltage" },
  { key: "current", label: "Current" },
  { key: "temperature", label: "Temperature" },
] as const satisfies readonly TabItem[];

type TrendTabType = (typeof TREND_TABS)[number]["key"];
interface BatteryInfo {
  BatteryID: string;
  BatterySerialNo: string;
  BMSIdentifier: string;
  BatteryChemistry: string;
  NominalVoltageV: number;
  RatedCapacityAh: number;
  RatedEnergyKWh: number;
  CellCount: number;
  ManufactureDate: string | null;
  InstallationDate: string | null;
}

interface LiveTelemetry {
  StateOfChargePercent: number;
  StateOfHealthPercent: number | null;
  PackVoltageV: number;
  PackCurrentA: number;
  PackPowerKW: number;
  CellVoltageMinV: number;
  CellVoltageMaxV: number;
  CellVoltageDeltaV: number;
  BatteryTemperatureC: number;
  MinimumCellTemperatureC: number;
  MaximumCellTemperatureC: number;
  IsCharging: boolean;
  IsDischarging: boolean;
  HasWarning: boolean;
  HasCriticalFault: boolean;
  AdditionalDataJson: string | null;
}

interface CellReading {
  CellReadingID: string;
  CellNo: number;
  CellVoltageV: number;
  CellTemperatureC: number;
  BalancingActive: boolean;
}
interface HistoricalTelemetry {
  BatteryTelemetryID: string;
  BatteryID: string;
  EventDateTimeUtc: string;
  PackVoltageV: number;
  PackCurrentA: number;
  PackPowerKW: number;
  StateOfChargePercent: number;
  StateOfHealthPercent: number;
  CellVoltageMinV: number;
  CellVoltageMaxV: number;
  CellVoltageAverageV: number;
  CellVoltageDeltaV: number;
  BatteryTemperatureC: number;
  IsCharging: boolean;
  IsDischarging: boolean;
  ChargeCurrentA: number;
  ChargeVoltageV: number | null;
  ChargingPowerKW: number;
  CycleCount: number;
}
interface BmsApiData {
  batteryInfo: BatteryInfo | null;
  liveTelemetry: LiveTelemetry | null;
  cellReadings: CellReading[];
  alarms: unknown[];
  historicalTelemetry: HistoricalTelemetry[];
}

function formatDate(date: string | null | undefined) {
  if (!date) return "--";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function BmsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("location");
  const [threshold, setThreshold] = useState<number>(0.5);
  const [activeTrendTab, setActiveTrendTab] = useState<TrendTabType>("soc");
  const assetId = new URLSearchParams(window.location.search).get("vehicleId");

  const { data: response, isLoading, isError, error } = useGetBmsData(assetId);

  /*
   * Supports both response shapes:
   * 1. { success: true, data: {...} }
   * 2. Axios response: { data: { success: true, data: {...} } }
   */
  const apiData = (response?.data?.data ?? response?.data ?? response) as
    | BmsApiData
    | undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading BMS insights...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-red-600">
          {error instanceof Error ? error.message : "Failed to load BMS data."}
        </p>
      </div>
    );
  }

  if (!assetId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Asset ID is missing from the URL.
        </p>
      </div>
    );
  }

  const battery = apiData?.batteryInfo;
  const telemetry = apiData?.liveTelemetry;
  const cells = apiData?.cellReadings ?? [];
  const history = apiData?.historicalTelemetry ?? [];
  if (!battery || !telemetry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          No BMS data available for this asset.
        </p>
      </div>
    );
  }

  // Parse additional BMS information.
  let additionalData: { BMSManufacturer?: string } = {};

  try {
    additionalData = telemetry.AdditionalDataJson
      ? JSON.parse(telemetry.AdditionalDataJson)
      : {};
  } catch {
    additionalData = {};
  }

  // Derive charging / discharging mode from API values.
  const mode = telemetry.IsCharging
    ? "Charging (+)"
    : telemetry.IsDischarging
      ? "Discharging (-)"
      : "Idle";

  // Current is positive while charging and negative while discharging.
  const current = telemetry.IsDischarging
    ? -Math.abs(telemetry.PackCurrentA)
    : telemetry.IsCharging
      ? Math.abs(telemetry.PackCurrentA)
      : telemetry.PackCurrentA;

  // Calculate cell temperature difference from the latest cell readings.
  const cellTemperatures = cells
    .map((cell) => Number(cell.CellTemperatureC))
    .filter(Number.isFinite);

  const maxCellTemperature =
    cellTemperatures.length > 0
      ? Math.max(...cellTemperatures)
      : telemetry.MaximumCellTemperatureC;

  const minCellTemperature =
    cellTemperatures.length > 0
      ? Math.min(...cellTemperatures)
      : telemetry.MinimumCellTemperatureC;

  const cellVoltages = cells
    .map((cell) => Number(cell.CellVoltageV))
    .filter(Number.isFinite);

  const maxCellVoltage =
    cellVoltages.length > 0
      ? Math.max(...cellVoltages)
      : telemetry.CellVoltageMaxV;

  const minCellVoltage =
    cellVoltages.length > 0
      ? Math.min(...cellVoltages)
      : telemetry.CellVoltageMinV;

  const voltageBalanceStatus = telemetry.HasCriticalFault ? "CRITICAL" : "OK";

  const tempStatus =
    telemetry.HasWarning || telemetry.HasCriticalFault ? "WARNING" : "OK";

  const batteryData = {
    soc: telemetry.StateOfChargePercent,
    mode,
    voltageBalanceStatus,
    voltageDelta: telemetry.CellVoltageDeltaV,
    tempStatus,
    maxTemp: telemetry.MaximumCellTemperatureC,
    packVoltage: telemetry.PackVoltageV,
    batteryTemp: telemetry.BatteryTemperatureC,
    current,
    soh: telemetry.StateOfHealthPercent,
    cellVoltageDelta: telemetry.CellVoltageDeltaV,
    cellTempDelta: maxCellTemperature - minCellTemperature,
    estimatedMode: "--",
    batteryInfo: battery.BatterySerialNo,
    productionDate: formatDate(battery.ManufactureDate),
    manufacturer: additionalData.BMSManufacturer || battery.BMSIdentifier,
    typeCapacityRating: `${battery.BatteryChemistry} / ${battery.RatedCapacityAh} Ah`,
    maxCellVoltage,
    minCellVoltage,
    maxCellTemperature,
    minCellTemperature,
  };

  // Gauge needle angle calculation (-200A to +200A mapped to -90deg to +90deg).
  const clampedCurrent = Math.max(-200, Math.min(200, batteryData.current));
  const needleAngle = (clampedCurrent / 200) * 90;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: LIVE OVERVIEW */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-semibold text-slate-700">
              Live Overview
            </h1>
          </div>

          {/* State of Charge Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                State of Charge
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                {batteryData.soc >= 80
                  ? "High"
                  : batteryData.soc >= 40
                    ? "Moderate"
                    : "Low"}
              </span>
            </div>

            {/* Battery Bar */}
            <div className="flex items-center">
              <div className="relative h-14 w-full rounded-lg border border-slate-300 bg-slate-100 overflow-hidden p-1">
                <div
                  className="h-full rounded-md bg-emerald-500 transition-all duration-500 flex items-center justify-center"
                  style={{
                    width: `${Math.max(0, Math.min(100, batteryData.soc))}%`,
                  }}
                >
                  <span className="text-base font-bold text-slate-900">
                    {batteryData.soc}%
                  </span>
                </div>
              </div>
              <div className="h-6 w-1.5 rounded-r bg-slate-300 ml-0.5" />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">Mode</span>
              <span className="font-semibold text-slate-700">
                {batteryData.mode}
              </span>
            </div>

            {/* Status Badges */}
            <div className="space-y-2 pt-1">
              <div
                className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${
                  batteryData.voltageBalanceStatus === "CRITICAL"
                    ? "border-red-400 bg-red-50 text-red-600"
                    : "border-emerald-400 bg-emerald-50 text-emerald-600"
                }`}
              >
                Voltage Balance: {batteryData.voltageBalanceStatus} (Δ{" "}
                {batteryData.voltageDelta.toFixed(3)}V)
              </div>

              <div>
                <span
                  className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${
                    batteryData.tempStatus === "WARNING"
                      ? "border-amber-400 bg-amber-50 text-amber-600"
                      : "border-emerald-400 bg-emerald-50 text-emerald-600"
                  }`}
                >
                  Temp Status: {batteryData.tempStatus} ({batteryData.maxTemp}
                  °C)
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-1">
              Status based on the latest BMS telemetry.
            </p>
          </div>

          {/* 2-Column Metric Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              title="Pack Voltage"
              value={`${batteryData.packVoltage.toFixed(2)} V`}
              subtitle="Total pack voltage"
            />

            <MetricCard
              title="Battery Temp"
              value={`${batteryData.batteryTemp.toFixed(1)} °C`}
              subtitle="Battery temperature"
            />

            <MetricCard
              title="Current"
              value={`${batteryData.current.toFixed(2)} A`}
              subtitle="Charge (+) / Discharge (-)"
            />

            <MetricCard
              title="SOH"
              value={batteryData.soh !== null ? `${batteryData.soh}%` : "--"}
              subtitle="State of health"
            />

            <MetricCard
              title="Cell Voltage Δ"
              value={`${batteryData.cellVoltageDelta.toFixed(3)} V`}
              subtitle="Max cell V - Min cell V"
            />

            <MetricCard
              title="Cell Temp Δ"
              value={`${batteryData.cellTempDelta.toFixed(1)} °C`}
              subtitle="Max cell T - Min cell T"
            />

            <MetricCard
              title="Estimated Modes"
              value={batteryData.estimatedMode}
              subtitle="Not available from API"
            />

            <MetricCard
              title="Battery Info"
              value={batteryData.batteryInfo}
              subtitle={`Production Date: ${batteryData.productionDate}`}
            />

            <MetricCard
              title="Manufacturer"
              value={batteryData.manufacturer}
              subtitle="BMS manufacturer"
            />

            <MetricCard
              title="Type / Capacity / Rating"
              value={battery.BatteryChemistry}
              subtitle={`${battery.RatedCapacityAh} Ah / ${battery.NominalVoltageV} V / ${battery.RatedEnergyKWh} kWh`}
            />
          </div>

          {/* Current Gauge Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">
                Current Gauge
              </span>
              <span className="text-xs text-slate-500">{batteryData.mode}</span>
            </div>

            <div className="flex flex-col items-center justify-center py-2">
              <svg viewBox="0 0 240 135" className="w-full max-w-[260px]">
                <path
                  d="M 20 120 A 100 100 0 0 1 220 120"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="24"
                />

                <line
                  x1="120"
                  y1="8"
                  x2="120"
                  y2="32"
                  stroke="#64748b"
                  strokeWidth="2"
                />

                <text x="38" y="114" fontSize="9" fill="#475569">
                  -200
                </text>
                <text x="52" y="75" fontSize="9" fill="#475569">
                  -120
                </text>
                <text x="84" y="47" fontSize="9" fill="#475569">
                  -40
                </text>
                <text x="142" y="47" fontSize="9" fill="#475569">
                  40
                </text>
                <text x="172" y="75" fontSize="9" fill="#475569">
                  120
                </text>
                <text x="184" y="114" fontSize="9" fill="#475569">
                  200
                </text>

                <g transform={`rotate(${needleAngle} 120 120)`}>
                  <polygon points="117,120 123,120 120,30" fill="#0284c7" />
                  <circle cx="120" cy="120" r="6" fill="#0f172a" />
                </g>
              </svg>

              <div className="text-center -mt-2">
                <div className="text-lg font-bold text-slate-800">
                  {batteryData.current.toFixed(1)} A
                </div>
                <div className="text-[11px] text-slate-400">
                  {batteryData.mode}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TRENDS & CELLS */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-700">
                Trends & Cells
              </h2>
              <p className="text-xs text-slate-400">
                Latest telemetry snapshot
              </p>
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Cells: {cells.length}
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            {/* Top 4 Summary Cards */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <SummaryHighlightCard
                label="Max Cell V"
                value={`${batteryData.maxCellVoltage.toFixed(3)} V`}
                sub="Latest snapshot"
              />

              <SummaryHighlightCard
                label="Min Cell V"
                value={`${batteryData.minCellVoltage.toFixed(3)} V`}
                sub="Latest snapshot"
              />

              <SummaryHighlightCard
                label="Max Cell T"
                value={`${batteryData.maxCellTemperature.toFixed(1)} °C`}
                sub="Latest snapshot"
              />

              <SummaryHighlightCard
                label="Min Cell T"
                value={`${batteryData.minCellTemperature.toFixed(1)} °C`}
                sub="Latest snapshot"
              />
            </div> */}
            {/* Tabs */}
            {/* <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("location")}
                className={`rounded-full px-4 py-1 text-xs font-medium border transition ${
                  activeTab === "location"
                    ? "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Location
              </button>
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
            </div> */}
            <Tabs
              tabs={[...TABS]}
              active={activeTab}
              onChange={(key) => setActiveTab(key as TabType)}
            />
            {activeTab === "trends" && (
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

                {/* Trend Chart Placeholders */}
                {history.length > 0 ? (
                  <div className="space-y-4">
                    <Tabs
                      tabs={[...TREND_TABS]}
                      active={activeTrendTab}
                      onChange={(key) => setActiveTrendTab(key as TrendTabType)}
                    />

                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                      {activeTrendTab === "soc" && (
                        <div>
                          <h3 className="text-sm font-semibold text-slate-700">
                            State of Charge & Health
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">
                            Historical SOC and SOH readings
                          </p>
                          {history.length > 0 ? (
                            <BmsTrendChart
                              title="State of Charge & Health"
                              unit="%"
                              history={history}
                              color="#0d9488"
                              secondColor="#6366f1"
                              fields={[
                                { name: "SOC", key: "StateOfChargePercent" },
                                { name: "SOH", key: "StateOfHealthPercent" },
                              ]}
                            />
                          ) : (
                            <p className="text-xs text-slate-400 mt-4">
                              No historical telemetry available.
                            </p>
                          )}
                        </div>
                      )}

                      {activeTrendTab === "voltage" && (
                        <div>
                          <h3 className="text-sm font-semibold text-slate-700">
                            Pack Voltage
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">
                            Historical battery pack voltage
                          </p>
                          {history.length > 0 ? (
                            <BmsTrendChart
                              title="Pack Voltage"
                              unit="V"
                              history={history}
                              color="#0284c7"
                              fields={[
                                { name: "Voltage", key: "PackVoltageV" },
                              ]}
                            />
                          ) : (
                            <p className="text-xs text-slate-400 mt-4">
                              No historical telemetry available.
                            </p>
                          )}
                        </div>
                      )}

                      {activeTrendTab === "current" && (
                        <div>
                          <h3 className="text-sm font-semibold text-slate-700">
                            Charging / Discharging Current
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">
                            Historical battery current
                          </p>
                          {history.length > 0 ? (
                            <BmsTrendChart
                              title="Charging / Discharging Current"
                              unit="A"
                              history={history}
                              color="#8b5cf6"
                              fields={[
                                { name: "Current", key: "PackCurrentA" },
                              ]}
                            />
                          ) : (
                            <p className="text-xs text-slate-400 mt-4">
                              No historical telemetry available.
                            </p>
                          )}
                        </div>
                      )}

                      {activeTrendTab === "temperature" && (
                        <div>
                          <h3 className="text-sm font-semibold text-slate-700">
                            Battery Temperature
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">
                            Historical battery temperature
                          </p>
                          {history.length > 0 ? (
                            <BmsTrendChart
                              title="Battery Temperature"
                              unit="°C"
                              history={history}
                              color="#ea580c"
                              fields={[
                                {
                                  name: "Temperature",
                                  key: "BatteryTemperatureC",
                                },
                              ]}
                            />
                          ) : (
                            <p className="text-xs text-slate-400 mt-4">
                              No historical telemetry available.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                    <p className="text-xs font-semibold text-slate-600">
                      No historical telemetry available
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Historical battery trends will appear when telemetry
                      records are available.
                    </p>
                  </div>
                )}
              </>
            )}
            {activeTab === "location" && (
              <>
                <div>
                  <LiveTracking />
                </div>
              </>
            )}

            {activeTab === "cells" && (
              <div className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-xs font-semibold text-slate-700 mb-3">
                  Individual Cell Voltages & Temperatures
                </h3>

                {cells.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                    {cells.map((cell) => (
                      <div
                        key={cell.CellReadingID}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-center"
                      >
                        <div className="text-[11px] text-slate-400">
                          Cell {cell.CellNo}
                        </div>

                        <div className="text-xs font-bold text-slate-800 mt-0.5">
                          {Number(cell.CellVoltageV).toFixed(3)} V
                        </div>

                        <div className="text-[11px] text-emerald-600 mt-0.5">
                          {Number(cell.CellTemperatureC).toFixed(1)}°C
                        </div>

                        {cell.BalancingActive && (
                          <div className="text-[10px] font-medium text-sky-600 mt-1">
                            Balancing
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    No individual cell readings available.
                  </p>
                )}
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

type TrendField = {
  name: string;
  key: keyof HistoricalTelemetry;
};

function BmsTrendChart({
  title,
  unit,
  history,
  color,
  secondColor,
  fields,
}: {
  title: string;
  unit: string;
  history: HistoricalTelemetry[];
  color: string;
  secondColor?: string;
  fields: TrendField[];
}) {
  const series = fields.map((field) => ({
    name: field.name,
    data: history.map((item) => ({
      x: new Date(item.EventDateTimeUtc).getTime(),
      y: Number(item[field.key]),
    })),
  }));

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 280,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: secondColor ? [color, secondColor] : [color],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 3,
      hover: { size: 5 },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false,
        format: "dd MMM",
        style: { colors: "#94a3b8", fontSize: "11px" },
      },
    },
    yaxis: {
      title: {
        text: unit,
      },
      labels: {
        style: { colors: "#94a3b8" },
        formatter: (value) => value.toFixed(1),
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy, HH:mm",
      },
      y: {
        formatter: (value) => `${value.toFixed(2)} ${unit}`,
      },
    },
    legend: {
      show: fields.length > 1,
      position: "top",
      horizontalAlign: "right",
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 4,
    },
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">{title}</h3>

      <Chart options={options} series={series} type="line" height={280} />
    </div>
  );
}
