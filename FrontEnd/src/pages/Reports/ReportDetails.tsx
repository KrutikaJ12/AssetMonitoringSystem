import { Link, useLocation, useParams } from "react-router";
import Chart from "react-apexcharts";
import type { ApexAxisChartSeries, ApexOptions } from "apexcharts";

import { useAssetReportDetails } from "../../hooks/useReports";

// =========================================================
// TYPES
// =========================================================

interface AssetMovement {
  time: string;
  location: string;
  status: "START" | "MOVING" | "STOP";
  latitude?: number | null;
  longitude?: number | null;
}

interface WeeklyWorking {
  date: string;
  day: string;
  dayNumber?: string | number;
  workingMinutes: number;
  workingHours: number;
  workingTime: string;
  fuelConsumed?: string;
  isToday?: boolean;
}

interface ReportDetailsData {
  siteName: string;
  vehicaleNo: string;
  startDate: string;
  endDate: string;
  duration: string;
  totalWorking: string;
  totalWorkingMinutes: number;
  movements: AssetMovement[];
  weeklyWorking: WeeklyWorking[];
}

// =========================================================
// API DATA TYPES
// =========================================================

interface ApiMovement {
  Time: string;
  Location: string;
  Status: "START" | "MOVING" | "STOP";
  Latitude?: number | null;
  Longitude?: number | null;
}

interface ApiWeeklyWorking {
  Date: string;
  Day: string;
  WorkingMinutes: number;
  WorkingHours: number;
  WorkingTime: string;
  FuelConsumed?: string;
  IsToday?: boolean;
}

interface ApiReportData {
  SiteName: string;
  AssetID: string;
  StartDate: string;
  EndDate: string;
  Duration: string;
  TotalWorking?: string;
  TotalWorkingMinutes?: number;
  Movements?: ApiMovement[];
  WeeklyWorking?: ApiWeeklyWorking[];
}

// =========================================================
// HELPERS
// =========================================================

const timeToMinutes = (time: string): number => {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);

  if (!match) {
    return 0;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3]?.toUpperCase();

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

const getCalendarCardStyle = (hours: number) => {
  if (hours >= 10) {
    return {
      bg: "bg-orange-100/70 dark:bg-orange-950/40",
      border: "border-orange-200 dark:border-orange-900/50",
      hoursBg: "bg-orange-200/50 dark:bg-orange-900/60",
      fuelBg: "bg-orange-200/50 dark:bg-orange-900/60",
    };
  }
  if (hours > 6) {
    return {
      bg: "bg-amber-100/70 dark:bg-amber-950/40",
      border: "border-amber-200 dark:border-amber-900/50",
      hoursBg: "bg-amber-200/50 dark:bg-amber-900/60",
      fuelBg: "bg-amber-200/50 dark:bg-amber-900/60",
    };
  }
  if (hours >= 0.5) {
    return {
      bg: "bg-blue-100/70 dark:bg-blue-950/40",
      border: "border-blue-200 dark:border-blue-900/50",
      hoursBg: "bg-blue-200/50 dark:bg-blue-900/60",
      fuelBg: "bg-blue-200/50 dark:bg-blue-900/60",
    };
  }
  return {
    bg: "bg-gray-50 dark:bg-gray-800/60",
    border: "border-gray-200 dark:border-gray-700",
    hoursBg: "bg-gray-100 dark:bg-gray-700/60",
    fuelBg: "bg-gray-100 dark:bg-gray-700/60",
  };
};

// =========================================================
// COMPONENT
// =========================================================

export default function ReportDetails() {
  const { assetId } = useParams();
  const location = useLocation();

  const backPath = location.state?.from || "/admin/reports/summary";

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useAssetReportDetails(assetId);

  const apiData = response?.data as ApiReportData | undefined;

  // =======================================================
  // LOADING & ERROR STATES
  // =======================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading report details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !apiData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            {error instanceof Error
              ? error.message
              : "Report details not found."}
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAP API RESPONSE
  // =========================================================

  const report: ReportDetailsData = {
    siteName: apiData.SiteName || "-",
    vehicaleNo: apiData.AssetID || "-",
    startDate: apiData.StartDate || "-",
    endDate: apiData.EndDate || "-",
    duration: apiData.Duration || "0h 0m",
    totalWorking: apiData.TotalWorking || "0h 0m",
    totalWorkingMinutes: Number(apiData.TotalWorkingMinutes || 0),

    movements: (apiData.Movements || []).map((item) => ({
      time: item.Time || "-",
      location: item.Location || "Unknown",
      status: item.Status,
      latitude:
        item.Latitude !== null && item.Latitude !== undefined
          ? Number(item.Latitude)
          : null,
      longitude:
        item.Longitude !== null && item.Longitude !== undefined
          ? Number(item.Longitude)
          : null,
    })),

    weeklyWorking: (apiData.WeeklyWorking || []).map((item) => ({
      date: item.Date,
      day: item.Day,
      dayNumber: item.Date ? new Date(item.Date).getDate() : "",
      workingMinutes: Number(item.WorkingMinutes || 0),
      workingHours: Number(item.WorkingHours || 0),
      workingTime: item.WorkingTime || "0h 0m",
      fuelConsumed: item.FuelConsumed || "-L",
      isToday: item.IsToday || false,
    })),
  };

  // =========================================================
  // FALLBACK DATA WITH LATITUDE & LONGITUDE
  // =========================================================

  const dummyMovementData: AssetMovement[] = [
    {
      time: "00:30 AM",
      location: "Mumbai Port Yard",
      status: "START",
      latitude: 18.9438,
      longitude: 72.8359,
    },
    {
      time: "04:00 AM",
      location: "Vashi Check Naka",
      status: "MOVING",
      latitude: 19.0432,
      longitude: 72.9813,
    },
    {
      time: "07:00 AM",
      location: "Navi Mumbai Hub",
      status: "MOVING",
      latitude: 19.033,
      longitude: 73.0297,
    },
    {
      time: "08:15 AM",
      location: "Taloja Industrial Zone",
      status: "MOVING",
      latitude: 19.052,
      longitude: 73.1118,
    },
    {
      time: "08:30 AM",
      location: "Panvel Logistics Park",
      status: "MOVING",
      latitude: 18.9894,
      longitude: 73.1175,
    },
    {
      time: "09:30 AM",
      location: "Kalamboli Yard",
      status: "MOVING",
      latitude: 19.0212,
      longitude: 73.1089,
    },
    {
      time: "10:00 AM",
      location: "JNW Port Road",
      status: "STOP",
      latitude: 18.9525,
      longitude: 72.95,
    },
  ];

  const movementData =
    report.movements.length > 0 ? report.movements : dummyMovementData;

  const dummyWeeklyWorkingData: WeeklyWorking[] = [
    {
      date: "2026-09-03",
      day: "Sun",
      dayNumber: "3",
      workingMinutes: 617,
      workingHours: 10.29,
      workingTime: "10.29h",
      fuelConsumed: "180.4L",
    },
    {
      date: "2026-09-04",
      day: "Mon",
      dayNumber: "4",
      workingMinutes: 663,
      workingHours: 11.06,
      workingTime: "11.06h",
      fuelConsumed: "168.3L",
    },
    {
      date: "2026-09-05",
      day: "Tues",
      dayNumber: "5",
      workingMinutes: 496,
      workingHours: 8.28,
      workingTime: "8.28h",
      fuelConsumed: "97.7L",
    },
    {
      date: "2026-09-06",
      day: "Wed",
      dayNumber: "6",
      workingMinutes: 567,
      workingHours: 9.45,
      workingTime: "9.45h",
      fuelConsumed: "-L",
    },
    {
      date: "2026-09-07",
      day: "Thur",
      dayNumber: "7",
      workingMinutes: 271,
      workingHours: 4.52,
      workingTime: "4.52h",
      fuelConsumed: "58.57L",
      isToday: true,
    },
    {
      date: "2026-09-08",
      day: "Fri",
      dayNumber: "8",
      workingMinutes: 0,
      workingHours: 0,
      workingTime: "-h",
      fuelConsumed: "-L",
    },
    {
      date: "2026-09-09",
      day: "Sat",
      dayNumber: "9",
      workingMinutes: 0,
      workingHours: 0,
      workingTime: "-h",
      fuelConsumed: "-L",
    },
  ];

  const weeklyWorkingData =
    report.weeklyWorking.length > 0
      ? report.weeklyWorking
      : dummyWeeklyWorkingData;

  const displayTotalWorking =
    report.totalWorkingMinutes > 0 ? report.totalWorking : "43h 20m";

  // =========================================================
  // SERVICE TIME PERIOD ANALYSIS CHART
  // =========================================================

  const timelineRows = ["03", "04", "05", "06", "07"];

  const serviceTimelineSeries: ApexAxisChartSeries = [
    {
      name: "Actual operation duration",
      data: movementData.map((item, index) => {
        const start = timeToMinutes(item.time);
        const nextItem = movementData[index + 1];
        let end = nextItem ? timeToMinutes(nextItem.time) : start + 45;

        if (end <= start) {
          end = start + 45;
        }

        return {
          x: timelineRows[index % timelineRows.length],
          y: [start, end],
          fillColor: "#2563eb",
        };
      }),
    },
  ];

  const serviceTimelineOptions: ApexOptions = {
    chart: {
      type: "rangeBar",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "60%",
        borderRadius: 1,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: "numeric",
      min: 0,
      max: 24 * 60,
      tickAmount: 12,
      labels: {
        formatter: (val) => {
          const hour = Math.floor(Number(val) / 60);
          return hour % 2 === 0 ? `${hour}` : "";
        },
        style: {
          colors: "#6b7280",
          fontSize: "12px",
        },
      },
      axisBorder: { show: true, color: "#e5e7eb" },
      axisTicks: { show: false },
    },
    yaxis: {
      categories: timelineRows,
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
          fontWeight: 600,
        },
      },
    },
    grid: {
      borderColor: "#f3f4f6",
      strokeDashArray: 0,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      row: {
        colors: ["#f9fafb", "#ffffff"],
        opacity: 0.5,
      },
    },
    tooltip: {
      enabled: true,
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const item = w.config.series[seriesIndex].data[dataPointIndex];
        return `<div class="p-2 text-xs font-semibold">Day ${item.x}: Active operation</div>`;
      },
    },
    legend: { show: false },
  };

  // =========================================================
  // UI RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 dark:bg-gray-900 sm:p-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Report Details
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Asset movement and journey details
          </p>
        </div>

        <Link
          to={backPath}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          ← Back to Reports
        </Link>
      </div>

      {/* SUMMARY TOP CARDS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Asset ID</p>
          <p className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">
            {report.vehicaleNo}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Site Name</p>
          <p className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">
            {report.siteName}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Started At</p>
          <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-white">
            {report.startDate}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Stopped At</p>
          <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-white">
            {report.endDate}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Working
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">
            {displayTotalWorking}
          </p>
        </div>
      </div>

      {/* SECTION 1: EQUIPMENT OPERATION CALENDAR */}
      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
          Equipment Operation Calendar
        </h2>

        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {weeklyWorkingData.map((item, index) => {
            const styles = getCalendarCardStyle(item.workingHours);

            return (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <span className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {item.day}
                </span>

                <div
                  className={`w-full rounded-xl border p-1.5 sm:p-2 transition-all ${styles.bg} ${styles.border}`}
                >
                  <div className="my-1 flex items-center justify-center">
                    {item.isToday ? (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-sm">
                        {item.dayNumber}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {item.dayNumber}
                      </span>
                    )}
                  </div>

                  <div
                    className={`mt-2 rounded-md py-1 text-xs font-medium text-gray-700 dark:text-gray-200 ${styles.hoursBg}`}
                  >
                    {item.workingHours > 0 ? `${item.workingHours}h` : "-h"}
                  </div>

                  <div
                    className={`mt-1 truncate rounded-md py-1 text-[11px] font-medium text-gray-600 dark:text-gray-300 ${styles.fuelBg}`}
                  >
                    {item.fuelConsumed || "-L"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-2.5 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <span className="h-4 w-6 rounded border border-orange-200 bg-orange-100 dark:border-orange-900 dark:bg-orange-950" />
            <span>Daily working hours ≥ 10 hours</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-4 w-6 rounded border border-amber-200 bg-amber-100 dark:border-amber-900 dark:bg-amber-950" />
            <span>6 hours &lt; Daily working hours &lt; 10 hours</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-4 w-6 rounded border border-blue-200 bg-blue-100 dark:border-blue-900 dark:bg-blue-950" />
            <span>0.5 hours ≤ Daily working hours ≤ 6 hours</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-4 w-6 rounded border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800" />
            <span>Daily working hours ≤ 0.5 hours</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: SERVICE TIME PERIOD ANALYSIS */}
      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Service time period analysis
        </h2>

        <div className="relative pl-1">
          <span className="absolute -top-1 left-0 text-xs text-gray-400 dark:text-gray-500">
            Day
          </span>
          <Chart
            options={serviceTimelineOptions}
            series={serviceTimelineSeries}
            type="rangeBar"
            height={220}
          />
        </div>

        <div className="mt-4 flex flex-col gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <span className="h-3.5 w-5 rounded-xs bg-blue-600" />
            <span>Actual operation duration</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-3.5 w-5 rounded-xs bg-amber-500" />
            <span>Idle duration</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-3.5 w-5 rounded-xs bg-gray-300 dark:bg-gray-600" />
            <span>Downtime</span>
          </div>
        </div>
      </div>

      {/* MOVEMENT DATA TABLE WITH LATITUDE & LONGITUDE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Asset Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Complete asset movement history
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 px-4 py-2 dark:bg-gray-700/50">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Total Duration
              </span>
              <p className="font-semibold text-gray-800 dark:text-white">
                {report.duration}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-5 py-4 font-medium text-gray-500 dark:text-gray-300">
                  Time
                </th>
                <th className="px-5 py-4 font-medium text-gray-500 dark:text-gray-300">
                  Location
                </th>
                <th className="px-5 py-4 font-medium text-gray-500 dark:text-gray-300">
                  Status
                </th>
                <th className="px-5 py-4 font-medium text-gray-500 dark:text-gray-300">
                  Latitude
                </th>
                <th className="px-5 py-4 font-medium text-gray-500 dark:text-gray-300">
                  Longitude
                </th>
              </tr>
            </thead>

            <tbody>
              {movementData.map((item, index) => (
                <tr
                  key={`${item.time}-${index}`}
                  className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                >
                  <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                    {item.time}
                  </td>
                  <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                    {item.location}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        item.status === "START"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : item.status === "STOP"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                    {item.latitude !== null && item.latitude !== undefined
                      ? item.latitude.toFixed(4)
                      : "-"}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                    {item.longitude !== null && item.longitude !== undefined
                      ? item.longitude.toFixed(4)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}