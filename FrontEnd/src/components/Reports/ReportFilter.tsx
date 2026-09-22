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
  onGenerate = () => {},
}: ReportFilterProps) => {
  const [assetId, setAssetId] = useState("");
  const [reportType, setReportType] = useState<"day" | "week" | "month">("day");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [speedLimit, setSpeedLimit] = useState("");
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: 3 },
    (_, index) => currentYear - 2 + index,
  );
  const getWeekStartDate = () => {
    if (!startDate) return undefined;

    const date = new Date(startDate);
    const weekNumber = Number(selectedWeek);

    date.setDate(date.getDate() + (weekNumber - 1) * 7);

    return date;
  };

  const getWeekEndDate = () => {
    const weekStart = getWeekStartDate();

    if (!weekStart) return undefined;

    const date = new Date(weekStart);
    date.setDate(date.getDate() + 6);

    return date;
  };

  const formatDisplayDate = (date?: Date) => {
    if (!date) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    // const year = String(date.getFullYear()).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const handleGenerate = () => {
    if (!assetId) {
      return;
    }

    let fromDate = "";
    let toDate = "";

    // Day-wise
    if (reportType === "day") {
      if (!startDate || !endDate) {
        return;
      }

      fromDate = formatDisplayDate(startDate);
      toDate = formatDisplayDate(endDate);
    }

    // Weekly
    if (reportType === "week") {
      if (!startDate) {
        return;
      }

      const weekStart = getWeekStartDate();
      const weekEnd = getWeekEndDate();

      if (!weekStart || !weekEnd) {
        return;
      }

      fromDate = formatDisplayDate(weekStart);
      toDate = formatDisplayDate(weekEnd);
    }

    // Monthly
    if (reportType === "month") {
      if (!selectedYear || !selectedMonth) {
        return;
      }

      const year = Number(selectedYear);
      const month = Number(selectedMonth);

      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0);

      fromDate = formatDisplayDate(monthStart);
      toDate = formatDisplayDate(monthEnd);
    }

    console.log({
      assetId: Number(assetId),
      reportType,
      fromDate,
      toDate,
    });

    onGenerate({
      assetId: Number(assetId),
      fromDate,
      toDate,
      reportType,
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <div
        className={` grid grid-cols-1 gap-4 lg:items-start ${
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
              onChange={(e) => {
                setReportType(e.target.value as "day" | "week" | "month");
                setSelectedWeek("1");
                setSelectedYear("");
                setSelectedMonth("");
                setAssetId("")
              }}
              className="mb-3 h-11 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="day">Day-wise</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
        )}
        {showReportType && reportType === "month" && (
          <>
            <div className="w-full">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Year
              </label>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="mb-5 h-11 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="">Select year</option>

                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Month
              </label>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="mb-3 h-11 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="">Select month</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
          </>
        )}
        {/* Asset ID */}
        <div className="w-full">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Asset ID
          </label>

          <select
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            className="mb-3 h-11 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
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
        {showReportType && (reportType === "week" || reportType === "day") && (
          <div className="w-full">
            <DatePicker
              id="start-date"
              label="From"
              placeholder="Start date"
              mode="single"
              onChange={(dates) => {
                setStartDate(dates[0]);
                setSelectedWeek("1");
              }}
            />
          </div>
        )}
        {showReportType && reportType === "week" && (
          <div className="w-full">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Week
            </label>

            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value) }
              className="mb-3 h-11 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="1">Week 1</option>
              <option value="2">Week 2</option>
              <option value="3">Week 3</option>
              <option value="4">Week 4</option>
              <option value="5">Week 5</option>
            </select>

            <div className=" min-h-[20px]">
              {startDate && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDisplayDate(getWeekStartDate())} →{" "}
                  {formatDisplayDate(getWeekEndDate())}
                </p>
              )}
            </div>
          </div>
        )}
        {/* End Date */}
        {reportType === "day" && (
          <div className="w-full">
            <DatePicker
              id="end-date"
              label="To"
              placeholder="End date"
              mode="single"
              onChange={(dates) => setEndDate(dates[0])}
            />
          </div>
        )}

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
         <label className="mb-2 block text-sm font-medium text-white dark:text-gray-300">
            Asset ID
          </label>
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
