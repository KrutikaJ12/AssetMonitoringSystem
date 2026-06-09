// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import SiteSummary from "../../components/dashboard/SiteSummary";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import PageMeta from "../../components/common/PageMeta";
import StatisticsMetrics from "../../components/dashboard/StatisticsMetrics";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import StatisticsChart from "../../components/dashboard/StatisticsChart";
import { GroupIcon } from "../../icons";
const SectionCard = ({ title, children }: any) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
    <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
      {title}
    </h3>
    {children}
  </div>
);

const alerts = [
  { id: 1, title: "Low Fuel - EX010", time: "3 hours Site" },
  { id: 2, title: "Overheating - CR001", time: "25 min ago" },
  { id: 3, title: "Maintenance Due - LD001", time: "1 hour ago" },
];

const RecentAlerts = () => (
  <div>
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

const donutOptions: ApexOptions = {
  chart: { type: "donut" },
  labels: ["Running", "Idle", "Maintainence", "Offline"],
  colors: ["#dc2626", "#ef4444", "#fca5a5"],
  legend: { position: "bottom" },
};
const assetTypeOptions: ApexOptions = {
  chart: { type: "donut" },
  labels: ["Excavator", "Forklift", "Crane", "Loader", "Others"],
  colors: ["#dc2626", "#ef4444", "#fca5a5"],
  legend: { position: "bottom" },
};

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      {/* <div className="grid grid-cols-12 gap-4 md:gap-6"> */}
      {/* <div className="col-span-12 space-y-6 xl:col-span-7 border"> */}
      <div>
        <div className=" grid gap-2 w-full">
          <StatisticsMetrics />

          {/* <MonthlySalesChart /> */}
        </div>
        <div className="flex md:gap-6 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <SectionCard title="Assets Status Overview">
                <Chart
                  options={donutOptions}
                  series={[180, 45, 25, 10]}
                  type="donut"
                  height={300}
                />
              </SectionCard>
              <SectionCard title="Assets By Type" >
                <Chart
                  options={assetTypeOptions}
                  series={[85, 50, 30, 50, 24]}
                  type="donut"
                  height={300}
                />
              </SectionCard>
            </div>
            <div >
              <StatisticsChart />
            </div>
          </div>

          <SectionCard title="Recents Alerts">
            <RecentAlerts />
          </SectionCard>
        </div>
        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}

        {/* <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div> */}

        <div className="col-span-12 xl:col-span-7 mt-4">
          <SiteSummary />
        </div>
      </div>
    </>
  );
}
