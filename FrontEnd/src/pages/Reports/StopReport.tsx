import { useEffect, useState } from "react";
import ReportFilter from "../../components/Reports/ReportFilter";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useStopReports } from "../../hooks/useReports";

interface StopReportData {
  id?: number;
  assetId: string;
  startDate: string;
  startTime: string;
  startLocation: string;
  event: string;
  endDate: string;
  endTime: string;
  endLocation: string;
  duration: string;
  maxSpeedLocation: string;
  driverName: string;
}

const StopReport = () => {
  const [assetId] = useState("");
  const [startDate] = useState<Date | undefined>();
  const [endDate] = useState<Date | undefined>();

  console.log("====================================");
  console.log("STOP REPORT COMPONENT RENDERED");
  console.log("====================================");

  const {
    data: response,
    isLoading,
    isError,
    error,
    isFetching,
    status,
  } = useStopReports();

  // ==========================================
  // API DEBUG LOGS
  // ==========================================

  console.log("STOP REPORT - QUERY STATUS:", status);
  console.log("STOP REPORT - IS LOADING:", isLoading);
  console.log("STOP REPORT - IS FETCHING:", isFetching);
  console.log("STOP REPORT - IS ERROR:", isError);
  console.log("STOP REPORT - ERROR:", error);
  console.log("STOP REPORT - RAW RESPONSE:", response);

  useEffect(() => {
    console.log("====================================");
    console.log("STOP REPORT API RESPONSE CHANGED");
    console.log("====================================");
    console.log("RAW RESPONSE:", response);

    if (response) {
      console.log("SUCCESS:", response?.success);
      console.log("DATA:", response?.data);
      console.log(
        "DATA LENGTH:",
        Array.isArray(response?.data) ? response.data.length : "NOT ARRAY"
      );
    }
  }, [response]);

  const reportsData: StopReportData[] = (response?.data ?? []).map(
    (item: any) => {
      console.log("STOP REPORT API ITEM:", item);

      return {
        id: item.Id,
        assetId: item.AssetId ?? "",
        startDate: item.StartDate
          ? new Date(item.StartDate).toLocaleDateString("en-GB")
          : "",
        startTime: item.StartTime ?? "",
        startLocation: item.StartLocation ?? "",
        event: item.Event ?? "",
        endDate: item.EndDate
          ? new Date(item.EndDate).toLocaleDateString("en-GB")
          : "",
        endTime: item.EndTime ?? "",
        endLocation: item.EndLocation ?? "",
        duration: item.Duration ?? "",
        maxSpeedLocation: item.MaxSpeedLocation ?? "",
        driverName: item.DriverName ?? "",
      };
    }
  );

  console.log("====================================");
  console.log("STOP REPORT MAPPED DATA");
  console.log("====================================");
  console.log("REPORTS DATA:", reportsData);
  console.log("REPORTS DATA LENGTH:", reportsData.length);

  const handleGenerate = () => {
    console.log("STOP REPORT - GENERATE CLICKED");
    console.log({
      assetId,
      startDate,
      endDate,
    });
  };

  const handleExport = () => {
    console.log("STOP REPORT - CSV EXPORT CLICKED");

    if (!reportsData.length) {
      console.log("STOP REPORT - NO DATA TO EXPORT");
      return;
    }

    const headers = [
      "Sr No",
      "Asset ID",
      "Start Date",
      "Start Time",
      "Start Location",
      "Event",
      "End Date",
      "End Time",
      "End Location",
      "Duration",
      "Max Speed Location",
      "Driver Name",
    ];

    const csvRows = reportsData.map((item, index) =>
      [
        index + 1,
        item.assetId,
        item.startDate,
        item.startTime,
        item.startLocation,
        item.event,
        item.endDate,
        item.endTime,
        item.endLocation,
        item.duration,
        item.maxSpeedLocation,
        item.driverName,
      ]
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(",")
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
    link.download = "Stop_Report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handlePdfExport = () => {
    console.log("STOP REPORT - PDF EXPORT CLICKED");

    if (!reportsData.length) {
      console.log("STOP REPORT - NO DATA TO EXPORT");
      return;
    }

    const doc = new jsPDF("landscape");

    doc.setFontSize(16);
    doc.text("Stop Report", 14, 15);

    autoTable(doc, {
      startY: 25,

      head: [
        [
          "Sr No",
          "Asset ID",
          "Start Date",
          "Start Time",
          "Start Location",
          "Event",
          "End Date",
          "End Time",
          "End Location",
          "Duration",
          "Max Speed Location",
          "Driver Name",
        ],
      ],

      body: reportsData.map((item, index) => [
        index + 1,
        item.assetId,
        item.startDate,
        item.startTime,
        item.startLocation,
        item.event,
        item.endDate,
        item.endTime,
        item.endLocation,
        item.duration,
        item.maxSpeedLocation,
        item.driverName,
      ]),

      theme: "grid",

      styles: {
        fontSize: 7,
        cellPadding: 2.5,
        overflow: "linebreak",
      },

      headStyles: {
        fontSize: 7,
        fontStyle: "bold",
        halign: "center",
      },
    });

    doc.save("Stop_Report.pdf");
  };

  const headerClass =
    "whitespace-nowrap px-1 py-3 text-center text-[9px] font-medium uppercase text-gray-500 dark:text-gray-400";

  const cellClass =
    "px-2 py-3 text-center text-xs leading-tight break-words text-gray-600 dark:text-gray-400";

  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {
    console.log("STOP REPORT - LOADING API...");

    return (
      <div className="w-full min-w-0 overflow-hidden p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Stop Report
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Generate stop report
          </p>
        </div>

        <ReportFilter />

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading stop reports...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (isError) {
    console.error("====================================");
    console.error("STOP REPORT API ERROR");
    console.error("====================================");
    console.error(error);

    return (
      <div className="w-full min-w-0 overflow-hidden p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Stop Report
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Generate stop report
          </p>
        </div>

        <ReportFilter />

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-500/10">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Failed to load stop reports.
          </p>

          <p className="mt-1 text-xs text-red-500 dark:text-red-400">
            {error instanceof Error
              ? error.message
              : "Something went wrong while fetching the data."}
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="w-full min-w-0 overflow-hidden p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Stop Report
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Generate stop report
        </p>
      </div>

      <ReportFilter />

      <div className="mt-6 w-full min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex w-full min-w-0 items-center justify-between gap-4 border-b border-gray-200 px-4 py-4 dark:border-gray-800 md:px-5">
          <h2 className="min-w-0 text-lg font-semibold text-gray-800 dark:text-white">
            Stop Report Records
          </h2>

          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={handlePdfExport}
              disabled={!reportsData.length}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-red-400 px-3 text-xs font-medium text-white transition hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-50 md:px-4 md:text-sm"
            >
              Export PDF
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={!reportsData.length}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 md:px-4 md:text-sm"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="w-full min-w-0 overflow-hidden">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className={headerClass}>Sr No</th>
                <th className={headerClass}>Asset ID</th>
                <th className={headerClass}>Start Date</th>
                <th className={headerClass}>Start Time</th>
                <th className={headerClass}>Start Location</th>
                <th className={headerClass}>Event</th>
                <th className={headerClass}>End Date</th>
                <th className={headerClass}>End Time</th>
                <th className={headerClass}>End Location</th>
                <th className={headerClass}>Duration</th>
                <th className={headerClass}>Max Speed Location</th>
                <th className={headerClass}>Driver Name</th>
              </tr>
            </thead>

            <tbody>
              {reportsData.length > 0 ? (
                reportsData.map((item, index) => (
                  <tr
                    key={item.id ?? `${item.assetId}-${index}`}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td className={cellClass}>{index + 1}</td>

                    <td
                      className={`${cellClass} font-medium text-gray-800 dark:text-white`}
                    >
                      {item.assetId}
                    </td>

                    <td className={cellClass}>{item.startDate}</td>
                    <td className={cellClass}>{item.startTime}</td>
                    <td className={cellClass}>{item.startLocation}</td>

                    <td className="px-2 py-3 text-center">
                      <span className="inline-flex max-w-full rounded-full bg-blue-50 px-2 py-1 text-[10px] font-medium leading-tight text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        {item.event}
                      </span>
                    </td>

                    <td className={cellClass}>{item.endDate}</td>
                    <td className={cellClass}>{item.endTime}</td>
                    <td className={cellClass}>{item.endLocation}</td>

                    <td
                      className={`${cellClass} font-medium text-gray-800 dark:text-white`}
                    >
                      {item.duration}
                    </td>

                    <td className={cellClass}>
                      {item.maxSpeedLocation}
                    </td>

                    <td
                      className={`${cellClass} font-medium text-gray-800 dark:text-white`}
                    >
                      {item.driverName}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No stop report records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StopReport;