import { GroupIcon } from "../../icons";

const alerts = [
  { id: 1, title: "Low Fuel - EX010", time: "3 hours ago " },
  { id: 2, title: "Overheating - CR001", time: "25 min ago" },
  { id: 3, title: "Maintenance Due - LD001", time: "1 hour ago" },
];


export const RecentAlerts = () => (
  <div className="">
    
    {alerts.map((alert) => (
      <div key={alert.id} className=" flex gap-4 mt-2">
        <div className=" flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-[#ef4444] size-6 dark:text-white/90" />
          </div>
        <div>
          <h1 className="text-[15px]">{alert.title}</h1>
          <p className="text-sm">{alert.time}</p>
        </div>
      </div>
    ))}
  </div>
);