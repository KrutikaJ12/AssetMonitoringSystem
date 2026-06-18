import { SectionCard } from "../../components/cards/SectionCard";
import AssignedAssetCard from "../../components/dashboard/AssignedAssetCard";
import FuelConsumptionChart from "../../components/dashboard/FuelConsumptionChart";
// import MonthlyTarget from "../../components/dashboard/FuelConsumptionChart";
import { RecentAlerts } from "../../components/dashboard/RecentAlerts";
import Badge from "../../components/ui/badge/Badge";
import { GroupIcon } from "../../icons";
const healthData = [
  { label: "Fuel Level", value: "75%" },
  { label: "Engine Status", value: "ON" },
  { label: "Temperature", value: "85°C" },
  { label: "Hydraulic Pressure", value: "Normal" },
];
const summaryData = [
  {
    label: "Working Hours",
    value: "6.5 hrs",
  },
  {
    label: "Idle Hours",
    value: "1.2 hrs",
  },
  {
    label: "Total Hours",
    value: "7.7 hrs",
  },
];
const tasks = [
  {
    id: 1,
    title: "Digging at Zone A",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Material Loading",
    status: "Completed",
  },
  {
    id: 3,
    title: "Site Cleaning",
    status: "Pending",
  },
];
const OperatorDashboard = () => {
  return (
    <div className=" grid grid-cols-1 lg:grid-cols-3 gap-4">
      <SectionCard title="My Assigned Asset">
        <AssignedAssetCard />
      </SectionCard>
      <SectionCard title="Asset Health">
        <div>
          {healthData.map((data) => (
            <div className="flex items-center gap-3 p-2 rounded-lg mb-2">
              <GroupIcon className="text-[#ef4444] size-6 dark:text-white/90" />
              <div className="flex-1">{data.label}</div>
              <Badge>{data.value}</Badge>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Today's Summary">
        <div>
          {summaryData.map((data) => (
            <div className="flex justify-between bg-blue-50 p-4  rounded-lg mb-2">
              <GroupIcon className="text-[#ef4444] size-6 dark:text-white/90" />
              <div>{data.label}</div>
              <div className="font-bold">{data.value}</div>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Fuel level">
      <FuelConsumptionChart/>
      </SectionCard>
      <SectionCard title="Today's Tasks">
        <div>
          {tasks.map((data) => (
            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg mb-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200">
                {data.id}
              </div>

              <div className="flex-1">{data.title}</div>

              <Badge>{data.status}</Badge>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Recent Alerts" actionText="View All Alerts">
        <RecentAlerts />
      </SectionCard>
    </div>
  );
};

export default OperatorDashboard;
