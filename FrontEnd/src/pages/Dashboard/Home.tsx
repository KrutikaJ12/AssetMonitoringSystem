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
import { RecentAlerts } from "../../components/dashboard/RecentAlerts";
import { SectionCard } from "../../components/cards/SectionCard";
import WorkingHoursCard from "../../components/dashboard/WorkingHoursCard";
import { useDashboard } from "../../hooks/useDashboard";

export default function Home() {
  const { data, isLoading, error } = useDashboard();
  const assetStatusLabels =
    data?.assetStatus.map((asset) => asset.status) ?? [];
  const assetStatusSeries =
    data?.assetStatus?.map((asset) => asset.count) ?? [];
  const assetTypes = data?.assetTypes?.map((asset) => asset.assetType) ?? [];
  const assetTypesSeries = data?.assetTypes?.map((asset) => asset.count) ?? [];
  console.log("data", data);
  const adminMetrics = [
    {
      title: "Total Assets",
      value: data?.summary?.totalAssets ?? 0,
      icon: <GroupIcon />,
    },
    {
      title: "Active Assets",
      value: data?.summary?.activeAssets ?? 0,
      icon: <GroupIcon />,
    },
    {
      title: "Idle Assets",
      value: data?.summary?.idleAssets ?? 0,
      icon: <GroupIcon />,
    },
    {
      title: "Total Sites",
      value: data?.summary?.totalSites ?? 0,
      icon: <GroupIcon />,
    },
    {
      title: "Active Operators",
      value: data?.summary?.activeOperators ?? 0,
      icon: <GroupIcon />,
    },
  ];
  const donutOptions: ApexOptions = {
    chart: { type: "donut" },
    labels: assetStatusLabels,
    colors: ["#dc2626", "#ef4444", "#fca5a5"],
    legend: { position: "bottom" },
  };
  const assetTypeOptions: ApexOptions = {
    chart: { type: "donut" },
    labels: assetTypes,
    colors: ["#dc2626", "#ef4444", "#fca5a5"],
    legend: { position: "bottom" },
  };
  if (!data) {
    return <div>Loading..</div>;
  }
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
          <StatisticsMetrics metrics={adminMetrics} />

          {/* <MonthlySalesChart /> */}
        </div>
        <div className="flex md:gap-6 mb-6">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2">
              <SectionCard title="Assets Status Overview">
                <Chart
                  options={donutOptions}
                  series={assetStatusSeries}
                  type="donut"
                  height={300}
                />
              </SectionCard>
              <SectionCard title="Assets By Type">
                <Chart
                  options={assetTypeOptions}
                  series={assetTypesSeries}
                  type="donut"
                  height={300}
                />
              </SectionCard>
              <SectionCard title="Recents Alerts" actionText="View Alerts">
                <RecentAlerts data={data.recentAlerts}/>
              </SectionCard>
            </div>
            <SectionCard title="Working Hours">
              <WorkingHoursCard data={data.workingHours} />
            </SectionCard>
            <div className="">
              <StatisticsChart data={data.fuelConsumption}/>
            </div>
          </div>
        </div>
        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}

        {/* <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div> */}

        <div className="col-span-12 xl:col-span-7 mt-4">
          <SiteSummary data={data.siteSummary} />
        </div>
      </div>
    </>
  );
}
