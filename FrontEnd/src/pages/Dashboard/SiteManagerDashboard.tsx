import { SectionCard } from "../../components/cards/SectionCard";
import ProgressRow from "../../components/common/ProgressRow";
import AssetAllocationTable from "../../components/dashboard/AssetAllocationTable";
import CountryMap from "../../components/dashboard/CountryMap";
import { RecentAlerts } from "../../components/dashboard/RecentAlerts";
import StatisticsMetrics from "../../components/dashboard/StatisticsMetrics";
// import UtilizationCard from "../../components/dashboard/UtilizationCard";
import { GroupIcon } from "../../icons";
const siteManagerMetrics = [
  {
    title: "Site Assets",
    value: 25,
    icon: <GroupIcon />,
  },
  {
    title: "Active Assets",
    value: 18,
    icon: <GroupIcon />,
  },
  {
    title: "Idle Assets",
    value: 4,
    icon: <GroupIcon />,
  },
  {
    title: "Maintenance Due",
    value: 3,
    icon: <GroupIcon />,
  },
  {
    title: "Operators",
    value: 12,
    icon: <GroupIcon />,
  },
];
const utilizationData = [
  { label: "EX001", value: 82, color: "bg-green-500" },
  { label: "EX002", value: 65, color: "bg-yellow-500" },
  { label: "CR001", value: 21, color: "bg-red-500" },
  { label: "FL001", value: 73, color: "bg-green-500" },
  { label: "LD001", value: 50, color: "bg-yellow-500" },
];
const operatorData = [
  { label: "Rajesh Kumar", value: 82 },
  { label: "Suresh Patel", value: 65 },
  { label: "Sunil Yadav", value: 73 },
  { label: "Amit Singh", value: 41 },
  { label: "Mahesh Das", value: 3 },
];
const SiteManagerDashboard = () => {
  return (
    <div>
      <div className="mb-6">
        <select className="rounded-lg border border-gray-300 px-3 py-2 w-[50%]">
          <option>Mumbai Site</option>
          <option>Pune Site</option>
          <option>Delhi Site</option>
        </select>
      </div>
      {/* kpi Cards */}
      <StatisticsMetrics metrics={siteManagerMetrics} />
     <div className="flex flex-col lg:flex-row gap-3 w-full">
  <div className="w-full lg:w-1/2">
    <AssetAllocationTable />
  </div>

  <div className="w-full lg:w-1/2">
    <SectionCard title="Live Asset Map">
      <div className="w-full h-[168px]">
        <CountryMap mapColor="#E5E7EB" />
      </div>
    </SectionCard>
  </div>
</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full mt-6">
        <SectionCard title="Today's Utilization">
          <div className="space-y-4">
            {utilizationData.map((item) => (
              <ProgressRow
                key={item.label}
                label={item.label}
                value={item.value}
                color={item.color}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Operator Productivity">
          <div className="space-y-4">
            {operatorData.map((item) => (
              <ProgressRow
                key={item.label}
                label={item.label}
                value={item.value}
                suffix=" hrs"
              />
            ))}
          </div>
        </SectionCard>

        {/* Recent Alerts */}
        {/* <div className=' border border-blue-600 '>Map</div> */}
        <SectionCard title="Site Alerts" actionText="View All Alerts">
          <RecentAlerts />
        </SectionCard>
      </div>
    </div>
  );
};

export default SiteManagerDashboard;
