
import { useState } from "react";
import ReportFilter from "../../components/Reports/ReportFilter";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useSpeedViolationReports } from "../../hooks/useReports";

// =======================================================
// SPEED VIOLATION DATA TYPE
// =======================================================

interface SpeedViolationData {
  id?: number;
  assetId: string;
  date: string;
  time: string;
  location: string;
  speed: string | number;
  speedLimit: string | number;
  status: string;
  driverName: string;
}

// =======================================================
// COMPONENT
// =======================================================

const SpeedViolationReport = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useSpeedViolationReports();

  const [assetId, setAssetId] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [speedLimit, setSpeedLimit] = useState("");

  // =====================================================
  // API DATA
  // =====================================================

const reportsData: SpeedViolationData[] = (response?.data ?? []).map(
  (item: any) => ({
    id: item.Id,
    assetId: item.AssetId,
    date: item.Date,
    time: item.Time,
    location: item.Location,
    speed: item.Speed,
    speedLimit: item.SpeedLimit,
    status: item.Status,
    driverName: item.DriverName,
  })
);
  console.log("Speed Violation API Response:", response);
  console.log("Speed Violation Reports:", reportsData);

  // =====================================================
  // GENERATE REPORT
  // =====================================================

  const handleGenerate = () => {
    console.log({
      assetId,
      startDate,
      endDate,
      speedLimit,
    });
  };

  // =====================================================
  // CSV EXPORT FUNCTION
  // =====================================================

  const handleExport = () => {
    if (!reportsData.length) {
      return;
    }

    const headers = [
      "Sr No",
      "Asset ID",
      "Date",
      "Time",
      "Location",
      "Speed",
      "Speed Limit",
      "Status",
      "Driver Name",
    ];

    const csvRows = reportsData.map((item, index) =>
      [
        index + 1,
        item.assetId,
        item.date,
        item.time,
        item.location,
        item.speed,
        item.speedLimit,
        item.status,
        item.driverName,
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
    link.download = "Speed_Violation_Report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // PDF EXPORT FUNCTION
  // =====================================================

  const handlePdfExport = () => {
    if (!reportsData.length) {
      return;
    }

    const doc = new jsPDF("landscape");

    doc.setFontSize(16);
    doc.text("Speed Violation Report", 14, 15);

    autoTable(doc, {
      startY: 25,

      head: [
        [
          "Sr No",
          "Asset ID",
          "Date",
          "Time",
          "Location",
          "Speed",
          "Speed Limit",
          "Status",
          "Driver Name",
        ],
      ],

      body: reportsData.map((item, index) => [
        index + 1,
        item.assetId,
        item.date,
        item.time,
        item.location,
        item.speed,
        item.speedLimit,
        item.status,
        item.driverName,
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

    doc.save("Speed_Violation_Report.pdf");
  };

  // =====================================================
  // TABLE CLASSES
  // =====================================================

  const headerClass =
    "whitespace-nowrap px-1 py-3 text-center text-[9px] font-medium uppercase text-gray-500 dark:text-gray-400";

  const cellClass =
    "px-2 py-3 text-center text-xs leading-tight break-words text-gray-600 dark:text-gray-400";

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <div className="w-full p-4 md:p-6">
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading speed violation reports...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {
    return (
      <div className="w-full p-4 md:p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center dark:border-red-900/50 dark:bg-red-500/10">
          <p className="text-sm text-red-600 dark:text-red-400">
            Unable to fetch speed violation reports.
          </p>

          {error instanceof Error && (
            <p className="mt-1 text-xs text-red-500">
              {error.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="w-full p-4 md:p-6">

      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Speed Violation Report
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Generate speed violation report
        </p>
      </div>

      {/* FILTER */}
      <ReportFilter showSpeedLimit={true} />

      {/* TABLE CARD */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

        {/* TABLE HEADER */}
        <div className="flex w-full items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">

          <h2 className="whitespace-nowrap text-lg font-semibold text-gray-800 dark:text-white">
            Speed Violation Records
          </h2>

          <div className="flex shrink-0 items-center gap-3">

            {/* PDF */}
            <button
              type="button"
              onClick={handlePdfExport}
              disabled={!reportsData.length}
              className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg bg-red-400 px-4 text-sm font-medium text-white transition hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Export PDF
            </button>

            {/* CSV */}
            <button
              type="button"
              onClick={handleExport}
              disabled={!reportsData.length}
              className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Export CSV
            </button>

          </div>
        </div>

        {/* TABLE */}
        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto border-collapse">

            {/* HEADER */}
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className={headerClass}>Sr No</th>
                <th className={headerClass}>Asset ID</th>
                <th className={headerClass}>Date</th>
                <th className={headerClass}>Time</th>
                <th className={headerClass}>Location</th>
                <th className={headerClass}>Speed</th>
                <th className={headerClass}>Speed Limit</th>
                <th className={headerClass}>Status</th>
                <th className={headerClass}>Driver Name</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>

              {reportsData.length > 0 ? (
                reportsData.map((item, index) => (
                  <tr
                    key={item.id ?? `${item.assetId}-${index}`}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td className={cellClass}>
                      {index + 1}
                    </td>

                    <td
                      className={`${cellClass} font-medium text-gray-800 dark:text-white`}
                    >
                      {item.assetId}
                    </td>

                    <td className={cellClass}>
                      {item.date}
                    </td>

                    <td className={cellClass}>
                      {item.time}
                    </td>

                    <td className={cellClass}>
                      {item.location}
                    </td>

                    <td
                      className={`${cellClass} font-medium text-gray-800 dark:text-white`}
                    >
                      {item.speed}
                    </td>

                    <td className={cellClass}>
                      {item.speedLimit}
                    </td>

                    <td className="px-2 py-2 text-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${
                          item.status === "Violation"
                            ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                            : "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                        }`}
                      >
                        {item.status}
                      </span>
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
                    colSpan={9}
                    className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No speed violation records found.
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

export default SpeedViolationReport;
