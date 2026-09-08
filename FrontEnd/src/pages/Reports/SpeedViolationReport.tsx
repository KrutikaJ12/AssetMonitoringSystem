import { useState } from "react";
import DatePicker from "../../components/form/date-picker";

const SpeedViolationReport = () => {
  const [assetId, setAssetId] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [speedLimit, setSpeedLimit] = useState("");

  const handleGenerate = () => {
    console.log({
      assetId,
      startDate,
      endDate,
      speedLimit,
    });
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
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:items-end">

          {/* Asset ID */}
          <div className="w-full">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Asset ID
            </label>

            <select
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="h-11 mb-5 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="">Select Asset ID</option>
              <option value="ASSET-001">ASSET-001</option>
              <option value="ASSET-002">ASSET-002</option>
              <option value="ASSET-003">ASSET-003</option>
              <option value="ASSET-004">ASSET-004</option>
              <option value="ASSET-005">ASSET-005</option>
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

          {/* Speed Limit */}
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
              className="h-11 mb-5 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          {/* Generate Button */}
          <div className="w-full">
            <button
              type="button"
              onClick={handleGenerate}
              className="h-11 mb-5 w-full rounded-lg bg-brand-500 px-6 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              Generate
            </button>
          </div>

        </div>
      </div>

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
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">

                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Sr No
                </th>

                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Asset ID
                </th>

                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Date
                </th>

                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Time
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

              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-800">

                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  1
                </td>

                <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                  ASSET-001
                </td>

                <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                  08-09-2026
                </td>

                <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                  10:30 AM
                </td>

                <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                  85 km/h
                </td>

                <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                  60 km/h
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    Violation
                  </span>
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