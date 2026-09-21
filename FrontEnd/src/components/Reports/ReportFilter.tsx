import { useState } from "react";
import DatePicker from "../form/date-picker";
import { useAssetSummaryReports } from "../../hooks/useReports";

interface ReportFilterProps {
  showSpeedLimit?: boolean;
  showReportType?: boolean;
}

const ReportFilter = ({
  showSpeedLimit = false,
  showReportType = false,
  onGenerate = () =>{}
}: ReportFilterProps) => {
  const [assetId, setAssetId] = useState("");
  const [reportType, setReportType] = useState("day");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [speedLimit, setSpeedLimit] = useState("");
// reusable data function formatter
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};
  const handleGenerate = () => {
    console.log({
      assetId,
      reportType,
      startDate,
      endDate,
      speedLimit,
    });
     if (!assetId || !startDate || !endDate) {
    return;
  }
   onGenerate({
        assetId: Number(assetId),
        fromDate: formatDate(startDate),
        toDate: formatDate(endDate),
        reportType,
    
});
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <div
        className={`grid grid-cols-1 gap-4 lg:items-end ${
          showSpeedLimit && showReportType
            ? "lg:grid-cols-6"
            : showSpeedLimit || showReportType
              ? "lg:grid-cols-5"
              : "lg:grid-cols-4"
        }`}
      >
        {/* Report Type */}
        {showReportType && (
          <div className="w-full">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Report Type
            </label>

            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="mb-5 h-11 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="day">Day-wise</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
        )}
        {/* Asset ID */}
        <div className="w-full">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Asset ID
          </label>

          <select
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            className="mb-5 h-11 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="">Select Asset ID</option>
            <option value="2">Asset 2</option>
            <option value="3">Asset 3</option>
            <option value="4">Asset 4</option>
            <option value="5">Asset 5</option>
            <option value="6">Asset 6</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="w-full">
          <DatePicker
            id="start-date"
            label="From"
            placeholder="Start date"
            mode="single"
            onChange={(dates) => setStartDate(dates[0])}
          />
        </div>

        {/* End Date */}
        <div className="w-full">
          <DatePicker
            id="end-date"
            label="To"
            placeholder="End date"
            mode="single"
            onChange={(dates) => setEndDate(dates[0])}
          />
        </div>

        {/* Speed Limit - ONLY SPEED VIOLATION REPORT */}
        {showSpeedLimit && (
          <div className="w-full">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Speed Limit
            </label>

            <input
              type="number"
              min="0"
              value={speedLimit}
              onChange={(e) => setSpeedLimit(e.target.value)}
              placeholder="Enter Speed Limit"
              className="mb-5 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        )}

        {/* Generate Button */}
        <div className="w-full">
          <button
            type="button"
            onClick={handleGenerate}
            className="mb-5 h-11 w-full rounded-lg bg-red-400 px-6 text-sm font-medium text-white transition hover:bg-red-300"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilter;
