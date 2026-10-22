
type AssetType = "battery" | "fuel";

interface AssetClusterProps {
  assetType: AssetType;
  chargePercent?: number;
  fuelPercent?: number;
  voltage?: number;
  current?: number;
  power?: number;
  temperature?: number;
  engineRpm?: number;
  operatingHours?: number;
  speed?: number;
  tractionOk?: boolean;
  canConnected?: boolean;
}

export default function AssetCluster({
  assetType,
  chargePercent,
  fuelPercent,
  voltage,
  current,
  power,
  temperature,
  engineRpm,
  operatingHours,
  speed,
  tractionOk = true,
  canConnected = true,
}: AssetClusterProps) {
  const isBattery = assetType === "battery";

  const gaugeValue = isBattery ? chargePercent : fuelPercent;
  const gauge = Math.min(100, Math.max(0, gaugeValue ?? 0));

  const formatValue = (value: number | undefined, decimals = 1) =>
    value == null ? "--" : value.toFixed(decimals);

  return (
    <div className="w-full  overflow-hidden rounded-[28px] border border-slate-700 bg-[#030a11] p-4 text-white shadow-2xl sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`h-3.5 w-3.5 rounded-full ${
              tractionOk
                ? "bg-teal-400 shadow-[0_0_14px_#2dd4bf]"
                : "bg-red-500 shadow-[0_0_14px_#ef4444]"
            }`}
          />
          <span className="text-sm font-medium sm:text-lg">
            {tractionOk ? "Traction OK" : "Traction Alert"}
          </span>
        </div>

        <div className="text-right">
          <span
            className={`text-sm font-bold tracking-widest sm:text-lg ${
              canConnected ? "text-yellow-400" : "text-red-400"
            }`}
          >
            CAN
          </span>
          <div
            className={`mt-1 h-1 rounded-full ${
              canConnected ? "bg-yellow-400" : "bg-red-400"
            }`}
          />
        </div>
      </div>

      {/* Gauge */}
      <div className="relative mx-auto mt-1 w-full max-w-[400px]">
        <svg
          viewBox="0 0 440 250"
          className="block w-full"
          role="img"
          aria-label={`${isBattery ? "Battery charge" : "Fuel level"} ${gauge}%`}
        >
          <defs>
            <linearGradient
              id={`clusterGauge-${assetType}`}
              x1="0"
              y1="1"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor="#00e5bb" />
              <stop offset="48%" stopColor="#00c9e9" />
              <stop offset="100%" stopColor="#087bff" />
            </linearGradient>
          </defs>

          <path
            d="M 45 220 A 175 175 0 0 1 395 220"
            fill="none"
            stroke="#102b40"
            strokeWidth="20"
            strokeLinecap="round"
          />

          <path
            d="M 45 220 A 175 175 0 0 1 395 220"
            fill="none"
            stroke={`url(#clusterGauge-${assetType})`}
            strokeWidth="20"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray={`${gauge} 100`}
          />
        </svg>

        <div className="absolute inset-x-0 top-[43%] -translate-y-1/2 text-center">
          <div className="text-5xl font-semibold sm:text-6xl">
            {gaugeValue == null ? "--" : gauge}
            <span className="ml-1 text-3xl sm:text-4xl">%</span>
          </div>
          <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
            {isBattery ? "Battery charge" : "Fuel level"}
          </div>
        </div>
      </div>

      <div className="-mt-2 h-px bg-gradient-to-r from-slate-500 via-slate-300 to-slate-500" />

      {/* Battery: voltage/current | Fuel: RPM/speed */}
      <div className="grid grid-cols-2 divide-x divide-slate-600">
        <Metric
        //   label={isBattery ? "Voltage" : "Engine RPM"}
          value={isBattery ? formatValue(voltage) : formatValue(engineRpm, 0)}
          unit={isBattery ? "V" : "RPM"}
        />

        <Metric
        //   label={isBattery ? "Current" : "Speed"}
          value={isBattery ? formatValue(current) : formatValue(speed)}
          unit={isBattery ? "A" : "km/h"}
        />
      </div>

      <div className="h-px bg-slate-700" />

      {/* Battery: power | Fuel: temperature */}
      <div className="grid grid-cols-2 divide-x divide-slate-600 py-4">
        <Metric
        //   label={isBattery ? "Power" : "Engine temperature"}
          value={
            isBattery
              ? formatValue(power, 2)
              : formatValue(temperature, 0)
          }
          unit={isBattery ? "W" : "°C"}
        />

        <Metric
        //   label={isBattery ? "Temperature" : "Operating hours"}
          value={
            isBattery
              ? formatValue(temperature, 0)
              : formatValue(operatingHours)
          }
          unit={isBattery ? "°C" : "h"}
        />
      </div>

      <div className="h-px bg-slate-700" />

      {/* Operating hours for battery assets; fuel consumption can be added later */}
      {isBattery && (
        <div className="flex items-center justify-center gap-3 pt-3">
          <span className="text-sm text-slate-400">Operating hours</span>
          <span className="text-2xl font-semibold sm:text-3xl">
            {formatValue(operatingHours)}
          </span>
          <span className="text-slate-300">h</span>
        </div>
      )}
    </div>
  );
}

interface MetricProps {
  label: string;
  value: string;
  unit: string;
}

function Metric({ label="", value, unit }: MetricProps) {
  return (
    <div className="min-w-0 px-2 py-3 text-center sm:px-4">
      <div className="text-xs text-slate-400 sm:text-sm">{label}</div>
      <div className="mt-2 whitespace-nowrap text-2xl font-semibold sm:text-3xl">
        {value}
        <span className="ml-1 text-sm font-normal text-slate-300 sm:text-lg">
          {unit}
        </span>
      </div>
    </div>
  );
}
