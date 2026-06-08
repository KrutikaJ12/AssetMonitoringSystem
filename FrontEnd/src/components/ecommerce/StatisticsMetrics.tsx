import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import StatisticsCard from "../cards/StatisticsCard";
import Badge from "../ui/badge/Badge";

const dashboardMetrics = [
  {
    title: "Total Assets",
    value: 250,
    change: "+12.5%",
    icon: <GroupIcon />,
  },
  {
    title: "Active Assets",
    value: 180,
    change: "+8.2%",
    icon: <GroupIcon />,
  },
  {
    title: "Idle Assets",
    value: 45,
    change: "-4.3%",
    icon: <GroupIcon />,
  },
  // {
  //   title: "Maintenance Due",
  //   value: 25,
  //   change: "+3.6%",
  //   icon: <GroupIcon/>,
  // },
  {
    title: "Total Sites",
    value: 18,
    change: "+2.1%",
    icon: <GroupIcon />,
  },
  {
    title: "Active Operators",
    value: 320,
    change: "+9.7%",
    icon: <GroupIcon />,
  },
];
export default function StatisticsMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 md:gap-6 mb-6 ">
      {/* <!-- Metric Item Start --> */}

      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      {/* <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              5,359
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon />
            9.05%
          </Badge>
        </div>
      </div> */}
      {/* <!-- Metric Item End --> */}
      {dashboardMetrics.map((metric) => (
        <StatisticsCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
        />
      ))}
    </div>
  );
}
