import { useState } from "react";
import DatePicker from "../form/date-picker";


const ReportFilter = () => {
     const [assetId, setAssetId] = useState("");
      const [startDate, setStartDate] = useState<Date | undefined>();
      const [endDate, setEndDate] = useState<Date | undefined>();
      const [speedLimit, setSpeedLimit] = useState("");
    const handleGenerate = () => {

    }
  return (
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
                  className="h-11 mb-5 w-full rounded-lg bg-red-400 px-6 text-sm font-medium text-white transition hover:bg-brand-600"
                >
                  Generate
                </button>
              </div>
    
            </div>
          </div>
  )
}

export default ReportFilter