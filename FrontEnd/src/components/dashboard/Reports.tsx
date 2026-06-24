import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { SectionCard } from "../cards/SectionCard";
import DatePicker from "../form/date-picker";
import { useState } from "react";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
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
// =======================================================




const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  return (
    <div>
      <div className="flex w-full gap-5">
        <div className="flex flex-col gap-1  ml-3">
          <label>Vehicle No:</label>
          <input
            placeholder="Vehicle No"
            className="border h-10 rounded-lg pl-2"
          />
        </div>
        <DatePicker
          id="start-date"
          label="From"
          placeholder="Start date"
          mode="single"
          onChange={(dates) => setStartDate(dates[0])}
        />

        <DatePicker
          id="end-date"
          label="To"
          placeholder="End date"
          mode="single"
          onChange={(dates) => setEndDate(dates[0])}
        />
        <Button className="h-11 mt-6 " >
          Generate
        </Button>
      </div>
      <SectionCard>
        <div className="mb-5 flex justify-start gap-6">
          <button
            onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-400 transition"
        >
          <Download size={16} />
          Export
        </button>

        <button
  onClick={handlePdfExport}
  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-400 transition"
>
  <Download size={16} />
  Pdf
</button>
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Site Name
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Vehicle No
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Start Date
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  End Date
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Duration
                </TableCell>
                {/* <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  View
                </TableCell> */}
                {/* <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Fuel Consumption
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Utilization
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  View
                </TableCell> */}
              </TableRow>
            </TableHeader>

            {/* Table Body */}

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {reportsData.map((site) => (
                <TableRow className="">
                  {/* <TableCell className="py-3"> */}
                  {/* <div className="flex items-center gap-3">
                      {/* <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img
                        src={site.image}
                        className="h-[50px] w-[50px]"
                        alt={site.name}
                      />
                    </div> */}
                  {/* </div>  */}
                  {/* </TableCell> */}
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {site.siteName}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {site.vehicaleNo}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {site.startDate}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {site.endDate}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {site.duration}
                  </TableCell>

                  {/* <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        site.status === "Active"
                          ? "success"
                          : site.status === "Maintenance"
                            ? "warning"
                            : "error"
                      }
                    >
                      {site.status}
                    </Badge>
                  </TableCell> */}
                  {/* <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Eye />
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
};

export default Reports;
