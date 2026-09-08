import { useState } from "react";
import DatePicker from "../../components/form/date-picker";
import ReportFilter from "../../components/Reports/ReportFilter";
import { Download } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Reports {
  siteName: string;
  vehicaleNo: string;
  startDate: string;
  endDate: string;
  duration: string;
}

const reportsData: Reports[] = [
  {
    siteName: "Mumbai",
    vehicaleNo: "MH43CK3346",
    startDate: "2026-06-15 08:00 AM",
    endDate: "2026-06-15 05:30 PM",
    duration: "9h 30m",
  },
  {
    siteName: "Pune",
    vehicaleNo: "MH12AB5678",
    startDate: "2026-06-14 07:45 AM",
    endDate: "2026-06-14 04:15 PM",
    duration: "8h 30m",
  },
  {
    siteName: "Nashik",
    vehicaleNo: "MH15XY9087",
    startDate: "2026-06-13 09:00 AM",
    endDate: "2026-06-13 06:00 PM",
    duration: "9h",
  },
  {
    siteName: "Nagpur",
    vehicaleNo: "MH31PQ1122",
    startDate: "2026-06-12 08:30 AM",
    endDate: "2026-06-12 05:00 PM",
    duration: "8h 30m",
  },
  {
    siteName: "Mumbai",
    vehicaleNo: "MH01ZZ7788",
    startDate: "2026-06-11 07:00 AM",
    endDate: "2026-06-11 03:30 PM",
    duration: "8h 30m",
  },
];
const SpeedViolationReport = () => {
  const [assetId, setAssetId] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [speedLimit, setSpeedLimit] = useState("");
  const { hasPermission } = useAuth();
  const handleGenerate = () => {
    console.log({
      assetId,
      startDate,
      endDate,
      speedLimit,
    });
  };

  // ================= xL EXPORT FUNCTION =================
  const handleExport = () => {
    const headers = [
      "Site Name",
      "Vehicle No",
      "Start Date",
      "End Date",
      "Duration",
    ];

    const csvData = reportsData
      .map((rdata) =>
        [
          rdata.siteName,
          rdata.vehicaleNo,
          rdata.startDate,
          rdata.endDate,
          rdata.duration,
        ].join(","),
      )
      .join("\n");

    const blob = new Blob([[headers.join(","), csvData].join("\n")], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reports_data.csv";
    link.click();

    // setToastType("success");
    // setToastMessage("Data exported successfully!");
    // setTimeout(() => setToastMessage(null), 3000);
  };

  // ================= PDF EXPORT FUNCTION =================
  const handlePdfExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Vehicle Reports", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Site Name", "Vehicle No", "Start Date", "End Date", "Duration"]],
      body: reportsData.map((item) => [
        item.siteName,
        item.vehicaleNo,
        item.startDate,
        item.endDate,
        item.duration,
      ]),
      theme: "grid",
    });

    doc.save("Vehicle_Reports.pdf");
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
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


  {/* Table Header */}
  <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
      Speed Violation Records
    </h2>
  </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Sr No
                </th>

          <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">
            Asset ID
          </th>

          {/* Department */}
          <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">
            Department
          </th>

          <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">
            Date
          </th>

          <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">
            Time
          </th>

          {/* Location */}
          <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">
            Location
          </th>

          <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">
            Speed
          </th>

          <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">
            Speed Limit
          </th>

          <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">
            Status
          </th>

          {/* Driver Name */}
          <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">
            Driver Name
          </th>

        </tr>
      </thead>

      <tbody>
        <tr className="border-b border-gray-100 dark:border-gray-800">

          {/* Sr No */}
          <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
            1
          </td>

          {/* Asset ID */}
          <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
            ASSET-001
          </td>

          {/* Department */}
          <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
            Logistics
          </td>

          {/* Date */}
          <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
            08-09-2026
          </td>

          {/* Time */}
          <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
            10:30 AM
          </td>

          {/* Location */}
          <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
            Mumbai
          </td>

          {/* Speed */}
          <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
            85 km/h
          </td>

          {/* Speed Limit */}
          <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
            60 km/h
          </td>

          {/* Status */}
          <td className="px-5 py-4">
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
              Violation
            </span>
          </td>

          {/* Driver Name */}
          <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
            Rahul Sharma
          </td>

        </tr>
      </tbody>

    </table>
  </div>
</div>
</div>
  );
};

export default SpeedViolationReport;
