import { useState } from "react";
import ReportFilter from "../../components/Reports/ReportFilter";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// =======================================================
// SPEED VIOLATION DATA TYPE
// =======================================================
interface SpeedViolationData {
  assetId: string;
  department: string;
  date: string;
  time: string;
  location: string;
  speed: string;
  speedLimit: string;
  status: string;
  driverName: string;
}
 // =====================================================
  // DUMMY DATA
  // Replace this with your API data later
  // =====================================================
  const reportsData: SpeedViolationData[] = [
    {
      assetId: "ASSET-001",
      department: "Logistics",
      date: "08-09-2026",
      time: "10:30 AM",
      location: "Mumbai",
      speed: "85 km/h",
      speedLimit: "60 km/h",
      status: "Violation",
      driverName: "Rahul Sharma",
    },
    {
      assetId: "ASSET-002",
      department: "Transport",
      date: "08-09-2026",
      time: "11:15 AM",
      location: "Thane",
      speed: "92 km/h",
      speedLimit: "60 km/h",
      status: "Violation",
      driverName: "Amit Kumar",
    },
    {
      assetId: "ASSET-003",
      department: "Operations",
      date: "08-09-2026",
      time: "12:45 PM",
      location: "Navi Mumbai",
      speed: "78 km/h",
      speedLimit: "60 km/h",
      status: "Violation",
      driverName: "Vikas Singh",
    },
  ];

const SpeedViolationReport = () => {
  const [assetId, setAssetId] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [speedLimit, setSpeedLimit] = useState("");
 

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
    const headers = [
      "Sr No",
      "Asset ID",
      "Department",
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
        item.department,
        item.date,
        item.time,
        item.location,
        item.speed,
        item.speedLimit,
        item.status,
        item.driverName,
      ]
        .map((value) => `"${value ?? ""}"`)
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
    const doc = new jsPDF("landscape");

    // PDF Title
    doc.setFontSize(16);
    doc.text("Speed Violation Report", 14, 15);

    // PDF Table
    autoTable(doc, {
      startY: 25,

      head: [
        [
          "Sr No",
          "Asset ID",
          "Department",
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
        item.department,
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
      },
    });

    doc.save("Speed_Violation_Report.pdf");
  };

  return (
    <div className="w-full p-4 md:p-6">

      {/* =================================================
          PAGE HEADER
      ================================================== */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Speed Violation Report
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Generate speed violation report
        </p>
      </div>

      {/* Filter Card */}
      <ReportFilter />
      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">


        {/* =================================================
            TABLE HEADER
        ================================================== */}
        <div className="flex w-full items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">

          {/* LEFT - TITLE */}
          <h2 className="whitespace-nowrap text-lg font-semibold text-gray-800 dark:text-white">
            Speed Violation Records
          </h2>

          {/* RIGHT - EXPORT BUTTONS */}
          <div className="flex shrink-0 items-center gap-3">

            {/* Export PDF */}
            <button
              type="button"
              onClick={handlePdfExport}
              className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg bg-red-400 px-4 text-sm font-medium text-white transition hover:bg-red-300"
            >
              Export PDF
            </button>

            {/* Export CSV */}
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Export CSV
            </button>

          </div>
        </div>

        {/* =================================================
            TABLE
        ================================================== */}
        <div className="w-full overflow-hidden">

          <table className="w-full table-auto border-collapse">

            {/* =================================================
                TABLE HEADER
            ================================================== */}
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">

                <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Sr No
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Asset ID
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Department
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Date
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Time
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Location
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Speed
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Speed Limit
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Status
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Driver Name
                </th>

              </tr>
            </thead>

            {/* =================================================
                TABLE BODY
            ================================================== */}
            <tbody>

              {reportsData.map((item, index) => (
                <tr
                  key={`${item.assetId}-${index}`}
                  className="border-b border-gray-100 dark:border-gray-800"
                >

                  {/* Sr No */}
                  <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-700 dark:text-gray-300">
                    {index + 1}
                  </td>

                  {/* Asset ID */}
                  <td className="whitespace-nowrap px-3 py-4 text-xs font-medium text-gray-800 dark:text-white">
                    {item.assetId}
                  </td>

                  {/* Department */}
                  <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-600 dark:text-gray-400">
                    {item.department}
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-600 dark:text-gray-400">
                    {item.date}
                  </td>

                  {/* Time */}
                  <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-600 dark:text-gray-400">
                    {item.time}
                  </td>

                  {/* Location */}
                  <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-600 dark:text-gray-400">
                    {item.location}
                  </td>

                  {/* Speed */}
                  <td className="whitespace-nowrap px-3 py-4 text-xs font-medium text-gray-800 dark:text-white">
                    {item.speed}
                  </td>

                  {/* Speed Limit */}
                  <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-600 dark:text-gray-400">
                    {item.speedLimit}
                  </td>

                  {/* Status */}
                  <td className="whitespace-nowrap px-3 py-4">
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

                  {/* Driver Name */}
                  <td className="whitespace-nowrap px-3 py-4 text-xs font-medium text-gray-800 dark:text-white">
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

export default SpeedViolationReport;
