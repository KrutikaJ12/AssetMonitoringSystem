import { useState } from "react";
import ReportFilter from "../../components/Reports/ReportFilter";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// =======================================================
// STOP REPORT DATA TYPE
// =======================================================

interface StopReportData {
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

// =======================================================
// DUMMY DATA
// Replace this with API data later
// =======================================================

const reportsData: StopReportData[] = [
  {
    assetId: "ASSET-001",
    startDate: "08-09-2026",
    startTime: "09:00",
    startLocation: "Mumbai",
    event: "Vehicle Stopped",
    endDate: "08-09-2026",
    endTime: "10:30",
    endLocation: "Thane",
    duration: "01:30",
   
    maxSpeedLocation: "Eastern Express Highway",
    driverName: "Rahul Sharma",
  },
  {
    assetId: "ASSET-002",
    startDate: "08-09-2026",
    startTime: "10:00",
    startLocation: "Thane",
    event: "Vehicle Stopped",
    endDate: "08-09-2026",
    endTime: "12:15",
    endLocation: "Navi Mumbai",
    duration: "02:15",
   
    maxSpeedLocation: "Thane Creek Road",
    driverName: "Amit Kumar",
  },
  {
    assetId: "ASSET-003",
    startDate: "08-09-2026",
    startTime: "11:30",
    startLocation: "Navi Mumbai",
    event: "Vehicle Stopped",
    endDate: "08-09-2026",
    endTime: "13:45",
    endLocation: "Panvel",
    duration: "02:15",
    maxSpeedLocation: "Sion-Panvel Highway",
    driverName: "Vikas Singh",
  },
];

// =======================================================
// COMPONENT
// =======================================================

const StopReport = () => {
  const [assetId, setAssetId] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // =====================================================
  // GENERATE REPORT
  // =====================================================

  const handleGenerate = () => {
    console.log({
      assetId,
      startDate,
      endDate,
    });
  };

  // =====================================================
  // CSV EXPORT
  // =====================================================

  const handleExport = () => {
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
    link.download = "Stop_Report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // PDF EXPORT
  // =====================================================

  const handlePdfExport = () => {
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
      },
    });

    doc.save("Stop_Report.pdf");
  };

  // =====================================================
  // TABLE CLASSES
  // =====================================================

 const headerClass =
  "whitespace-nowrap px-1 py-3 text-center text-[9px] font-medium uppercase text-gray-500 dark:text-gray-400";

const cellClass =
  "px-2 py-3 text-center text-xs leading-tight break-words text-gray-600 dark:text-gray-400";
  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="w-full min-w-0 overflow-hidden p-4 md:p-6">
      {/* =================================================
          PAGE HEADER
      ================================================== */}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Stop Report
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Generate stop report
        </p>
      </div>

      {/* =================================================
          FILTER
      ================================================== */}

      <ReportFilter />

      {/* =================================================
          TABLE CARD
      ================================================== */}

      <div className="mt-6 w-full min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* =================================================
            TABLE HEADER
        ================================================== */}

        <div className="flex w-full min-w-0 items-center justify-between gap-4 border-b border-gray-200 px-4 py-4 dark:border-gray-800 md:px-5">
          {/* TITLE */}

          <h2 className="min-w-0 text-lg font-semibold text-gray-800 dark:text-white">
            Stop Report Records
          </h2>

          {/* EXPORT BUTTONS */}

          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            {/* PDF */}

            <button
              type="button"
              onClick={handlePdfExport}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-red-400 px-3 text-xs font-medium text-white transition hover:bg-red-300 md:px-4 md:text-sm"
            >
              Export PDF
            </button>

            {/* CSV */}

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 md:px-4 md:text-sm"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* =================================================
            TABLE
        ================================================== */}

        <div className="w-full min-w-0 overflow-hidden">
          <table className="w-full table-auto border-collapse">
            {/* TABLE HEADER */}

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

            {/* TABLE BODY */}

            <tbody>
  {reportsData.map((item, index) => (
    <tr
      key={`${item.assetId}-${index}`}
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

      <td className={cellClass}>{item.maxSpeedLocation}</td>

      <td
        className={`${cellClass} font-medium text-gray-800 dark:text-white`}
      >
        {item.driverName}
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StopReport;
