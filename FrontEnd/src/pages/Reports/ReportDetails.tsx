import { Link, useLocation, useSearchParams } from "react-router";
import Chart from "react-apexcharts";
import type { ApexAxisChartSeries, ApexOptions } from "apexcharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useAssetReportDetails } from "../../hooks/useReports";
import { useEffect, useState } from "react";

// =========================================================
// TYPES
// =========================================================

interface ApiReportData {
  summary: {
    AssetID: string | number;
    SiteName: string | null;
    StartedAt: string | null;
    StoppedAt: string | null;
    TotalWorking: string | null;
  } | null;

  operationCalendar: {
    ReportDate: string;
    WorkingHours: string;
    FuelConsumedLitres: number | null;
  }[];

  serviceTimePeriods: {
    StatusCode: string;
    StartDateTimeUtc: string;
    EndDateTimeUtc: string | null;
    Duration: string | null;
    IsOpen: number;
  }[];

  assetDetails: {
    EventTime: string;
    Status: string;
    Latitude: number | null;
    Longitude: number | null;
    Duration: string | null;
  }[];
}

interface ReportDetailsData {
  siteName: string;
  assetId: string;
  startDate: string;
  endDate: string;
  duration: string;
  totalWorking: string;

  movements: {
    time: string;
    location: string;
    status: string;
    latitude: number | null;
    longitude: number | null;
    duration: string;
  }[];

  weeklyWorking: {
    date: string;
    day: string;
    dayNumber: number | string;
    workingMinutes: number;
    workingHours: number;
    workingTime: string;
    fuelConsumed: string;
    isToday: boolean;
  }[];

  serviceTimePeriods: {
    status: string;
    startTime: string;
    endTime: string | null;
    duration: string;
    isOpen: boolean;
  }[];
}

// =========================================================
// HELPERS
// =========================================================

const parseWorkingHours = (value: string | null | undefined): number => {
  if (!value) return 0;

  const match = value.match(/(\d+)h\s+(\d+)m/i);

  if (!match) return 0;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  return hours + minutes / 60;
};

const formatDateTime = (value: string | null | undefined): string => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const formatCalendarDate = (
  value: string,
): {
  day: string;
  dayNumber: number;
} => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      day: "",
      dayNumber: 0,
    };
  }

  return {
    day: date.toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "UTC",
    }),
    dayNumber: date.getUTCDate(),
  };
};

const formatDurationFromDates = (
  start: string | null | undefined,
  end: string | null | undefined,
): string => {
  if (!start || !end) return "-";

  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();

  if (Number.isNaN(startTime) || Number.isNaN(endTime) || endTime < startTime) {
    return "-";
  }

  const totalMinutes = Math.floor((endTime - startTime) / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
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

const getStatusColor = (status: string): string => {
  switch (status.toUpperCase()) {
    case "RUNNING":
      return "#2563eb";

    case "IDLE":
      return "#f59e0b";

    case "STOPPED":
      return "#9ca3af";

    default:
      return "#6b7280";
  }
};

const getStatusBadgeClass = (status: string): string => {
  switch (status.toUpperCase()) {
    case "RUNNING":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";

    case "IDLE":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";

    case "STOPPED":
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  }
};

const timeToMinutes = (value: string): number => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  return date.getUTCHours() * 60 + date.getUTCMinutes();
};

// =========================================================
// COMPONENT
// =========================================================

export default function ReportDetails() {
  const [searchParams] = useSearchParams();

  const assetId = searchParams.get("assetId");
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const reportType = searchParams.get("reportType");

  const location = useLocation();

  const backPath = location.state?.from || "/admin/reports/summary";
  const [selectedDate, setSelectedDate] = useState<string>("");
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useAssetReportDetails({
    assetId: Number(assetId),
    fromDate: fromDate || "",
    toDate: toDate || "",
    reportType: reportType as "day" | "week" | "month",
  });

  useEffect(() => {
    const firstDate = response?.data?.operationCalendar?.[0]?.ReportDate;

    if (firstDate) {
      setSelectedDate(firstDate.slice(0, 10));
    }
  }, [response]);
  const apiData = response?.data as ApiReportData | undefined;

  // =======================================================
  // LOADING STATE
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

  // =======================================================
  // ERROR STATE
  // =======================================================

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
    // ================= SUMMARY =================

    siteName: apiData.summary?.SiteName || "-",

    assetId:
      apiData.summary?.AssetID !== undefined &&
      apiData.summary?.AssetID !== null
        ? String(apiData.summary.AssetID)
        : assetId || "-",

    startDate: apiData.summary?.StartedAt || "-",

    endDate: apiData.summary?.StoppedAt || "-",

    duration: formatDurationFromDates(
      apiData.summary?.StartedAt,
      apiData.summary?.StoppedAt,
    ),

    totalWorking: apiData.summary?.TotalWorking || "0h 0m",

    // ================= ASSET DETAILS =================

    movements: (apiData.assetDetails || []).map((item) => ({
      time: item.EventTime || "-",
      location: "-",
      status: item.Status || "-",
      latitude:
        item.Latitude !== null && item.Latitude !== undefined
          ? Number(item.Latitude)
          : null,
      longitude:
        item.Longitude !== null && item.Longitude !== undefined
          ? Number(item.Longitude)
          : null,
      duration: item.Duration || "-",
    })),

    // ================= OPERATION CALENDAR =================

    weeklyWorking: (apiData.operationCalendar || []).map((item) => {
      const calendarDate = formatCalendarDate(item.ReportDate);
      const workingHours = parseWorkingHours(item.WorkingHours);

      return {
        date: item.ReportDate,
        day: calendarDate.day,
        dayNumber: calendarDate.dayNumber,
        workingMinutes: Math.round(workingHours * 60),
        workingHours,
        workingTime: item.WorkingHours || "0h 0m",
        fuelConsumed:
          item.FuelConsumedLitres !== null &&
          item.FuelConsumedLitres !== undefined
            ? `${item.FuelConsumedLitres}L`
            : "-L",
        isToday: false,
      };
    }),

    // ================= SERVICE TIME PERIODS =================

    serviceTimePeriods: (apiData.serviceTimePeriods || []).map((item) => ({
      status: item.StatusCode || "-",
      startTime: item.StartDateTimeUtc,
      endTime: item.EndDateTimeUtc,
      duration: item.Duration || "-",
      isOpen: item.IsOpen === 1,
    })),
  };

  const movementData = report.movements;
  const weeklyWorkingData = report.weeklyWorking;
  const displayTotalWorking = report.totalWorking || "0h 0m";

  // =====================================================
  // CSV EXPORT FUNCTION
  // =====================================================

  const handleExport = () => {
    if (!movementData.length) return;

    const headers = [
      "Time",
      "Location",
      "Status",
      "Latitude",
      "Longitude",
      "Duration",
    ];

    const csvRows = movementData.map((item) =>
      [
        formatDateTime(item.time),
        item.location,
        item.status,
        item.latitude ?? "-",
        item.longitude ?? "-",
        item.duration,
      ]
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(","),
    );

    const csvContent = [
      headers.map((header) => `"${header}"`).join(","),
      ...csvRows,
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Asset_Details_${report.assetId}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // =====================================================
  // PDF EXPORT FUNCTION
  // =====================================================

  const handlePdfExport = () => {
    if (!movementData.length) return;

    const doc = new jsPDF("landscape");

    doc.setFontSize(16);
    doc.text(`Asset Details Report - ${report.assetId}`, 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [
        [
          "Time",
          "Location",
          "Status",
          "Latitude",
          "Longitude",
          "Duration",
        ],
      ],
      body: movementData.map((item) => [
        formatDateTime(item.time),
        item.location,
        item.status,
        item.latitude !== null ? item.latitude.toFixed(4) : "-",
        item.longitude !== null ? item.longitude.toFixed(4) : "-",
        item.duration,
      ]),
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
      },
      headStyles: {
        fontSize: 8,
        fontStyle: "bold",
        halign: "center",
      },
    });

    doc.save(`Asset_Details_${report.assetId}.pdf`);
  };

  // =========================================================
  // SERVICE TIME PERIOD ANALYSIS CHART
  // =========================================================
  const selectedServicePeriods = report.serviceTimePeriods.filter((item) => {
    if (!selectedDate) return false;

    const itemDate = new Date(item.startTime);

    if (Number.isNaN(itemDate.getTime())) {
      return false;
    }

    const year = itemDate.getUTCFullYear();
    const month = String(itemDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(itemDate.getUTCDate()).padStart(2, "0");

    const itemDateString = `${year}-${month}-${day}`;

    return itemDateString === selectedDate.slice(0, 10);
  });

  const serviceTimelineData = selectedServicePeriods
    .map((item) => {
      const startDate = new Date(item.startTime);

      if (Number.isNaN(startDate.getTime())) {
        return null;
      }

      const start = timeToMinutes(item.startTime);
      let end: number;

      if (item.endTime) {
        end = timeToMinutes(item.endTime);
      } else {
        end = 24 * 60;
      }

      if (end <= start) {
        end = start + 1;
      }

      return {
        x: startDate.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          timeZone: "UTC",
        }),
        y: [start, end],
        fillColor: getStatusColor(item.status),
        status: item.status,
        duration: item.duration,
        isOpen: item.isOpen,
        startTime: item.startTime,
        endTime: item.endTime,
      };
    })
    .filter(
      (
        item,
      ): item is {
        x: string;
        y: number[];
        fillColor: string;
        status: string;
        duration: string;
        isOpen: boolean;
        startTime: string;
        endTime: string | null;
      } => item !== null,
    );

  const serviceTimelineSeries: ApexAxisChartSeries = [
    {
      name: "Service time",
      data: serviceTimelineData,
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
      axisBorder: {
        show: true,
        color: "#e5e7eb",
      },
      axisTicks: { show: false },
    },
    yaxis: {
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
        const item = w.config.series[seriesIndex].data[dataPointIndex] as {
          x: string;
          y: [number, number];
          status?: string;
          duration?: string;
          isOpen?: boolean;
          startTime?: string;
          endTime?: string | null;
        };

        if (!item) return "";

        const status = item.status || "-";
        const duration = item.isOpen ? "Open interval" : item.duration || "-";

        return `
          <div class="p-3 text-xs">
            <div class="mb-1 font-semibold">${status}</div>
            <div>Day: ${item.x}</div>
            <div>Start: ${formatDateTime(item.startTime)}</div>
            <div>End: ${
              item.endTime ? formatDateTime(item.endTime) : "Ongoing"
            }</div>
            <div>Duration: ${duration}</div>
          </div>
        `;
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
            {report.assetId}
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
            {formatDateTime(report.startDate)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Stopped At</p>

          <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-white">
            {formatDateTime(report.endDate)}
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

        {weeklyWorkingData.length > 0 ? (
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {weeklyWorkingData.map((item, index) => {
              const styles = getCalendarCardStyle(item.workingHours);

              return (
                <div
                  key={`${item.date}-${index}`}
                  className="flex flex-col items-center text-center"
                >
                  <span className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {item.day}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedDate(item.date.slice(0, 10))}
                    className={`w-full rounded-xl border p-1.5 transition-all sm:p-2 ${
                      styles.bg
                    } ${styles.border} ${
                      selectedDate === item.date.slice(0, 10)
                        ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800"
                        : ""
                    }`}
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
                      {item.workingTime || "-"}
                    </div>

                    <div
                      className={`mt-1 truncate rounded-md py-1 text-[11px] font-medium text-gray-600 dark:text-gray-300 ${styles.fuelBg}`}
                    >
                      {item.fuelConsumed || "-L"}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No operation calendar data available.
          </p>
        )}

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

        {serviceTimelineData.length > 0 ? (
          <>
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
                <span>Running duration</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-3.5 w-5 rounded-xs bg-amber-500" />
                <span>Idle duration</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-3.5 w-5 rounded-xs bg-gray-300 dark:bg-gray-600" />
                <span>Stopped duration</span>
              </div>
            </div>
          </>
        ) : (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No service time period data available.
          </p>
        )}
      </div>

      {/* ASSET DETAILS TABLE */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Asset Details
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Complete asset movement history
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* PDF EXPORT BUTTON */}
              <button
                type="button"
                onClick={handlePdfExport}
                disabled={!movementData.length}
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
              >
                Export PDF
              </button>

              {/* CSV EXPORT BUTTON */}
              <button
                type="button"
                onClick={handleExport}
                disabled={!movementData.length}
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Export CSV
              </button>

              {/* TOTAL DURATION */}
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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
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

                <th className="px-5 py-4 font-medium text-gray-500 dark:text-gray-300">
                  Duration
                </th>
              </tr>
            </thead>

            <tbody>
              {movementData.length > 0 ? (
                movementData.map((item, index) => (
                  <tr
                    key={`${item.time}-${index}`}
                    className="border-t border-gray-100 hover:bg-gray-50/50 dark:border-gray-700 dark:hover:bg-gray-700/30"
                  >
                    <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                      {formatDateTime(item.time)}
                    </td>

                    <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                      {item.location}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(
                          item.status,
                        )}`}
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

                    <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                      {item.duration}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No asset detail data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}