import { GroupIcon } from "../../icons";

// const alerts = [
//   {
//     id: 1,
//     title: "Low Fuel - EX010",
//     description: "Fuel level has dropped below 15%",
//     time: "3 hours ago",
//     priority: "High",
//     color: "bg-red-100 text-red-600",
//   },
//   {
//     id: 2,
//     title: "Overheating - CR001",
//     description: "Engine temperature exceeded threshold",
//     time: "25 min ago",
//     priority: "Critical",
//     color: "bg-red-200 text-red-700",
//   },
//   {
//     id: 3,
//     title: "Maintenance Due - LD001",
//     description: "Scheduled maintenance is due today",
//     time: "1 hour ago",
//     priority: "Medium",
//     color: "bg-yellow-100 text-yellow-600",
//   },
// ];

const colorMap = {
  High: "bg-red-100 text-red-600",
  Critical: "bg-red-300 text-red-700",
  Medium: "bg-yellow-100 text-yellow-600",
};
export const RecentAlerts = ({data}:any) => (
  <div className="space-y-3">
    {data.map((alert) => (
      <div
        key={alert.id}
        className="rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800">
              <GroupIcon className="text-[#ef4444] size-6 dark:text-white/90" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                {alert.alertType}-{alert.assetName}
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                {alert.alertMessage}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {alert.time}
              </p>
            </div>
          </div>

          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[alert.alertLevel]}`}
          >
            {alert.alertLevel}
          </span>
        </div>
      </div>
    ))} 
  </div>
);