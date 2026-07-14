import {
  Clock,
  Target,
  TrendingUp,
  Play,
  Pause,
  Wrench,
  XCircle,
} from "lucide-react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function WorkingHoursCard({data}:any) {
  const series = [75];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#ef4444"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };
  let topAssets=data?.topAssets;
  const maxHours = Math.max(
  ...topAssets.map((asset) => asset.workingHours)
);
   topAssets=topAssets.map((asset)=>({
    ...asset,
     percentage: (asset.workingHours / maxHours) * 100,
   }))
  return (
    <div className="flex justify-evenly w-full">
      <div className=" border shadow-xl shadow-gray-200 rounded-xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between ">
          <div>
            <p className="text-sm text-gray-500">Monthly asset utilization</p>
          </div>

          <select className="rounded-lg border px-3 py-2 text-sm">
            <option>Today </option>
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>

        {/* Circle */}

        <div className="mt-8 flex justify-center">
          {/* <div className="flex h-56 w-56 items-center justify-center rounded-full border-[14px] border-blue-500">
          <div className="text-center">
            <p className="text-gray-500 text-sm">This Month</p>

            <h1 className="text-5xl font-bold">
              1,284
            </h1>

            <p className="text-lg font-medium text-gray-500">
              Hours
            </p>

            <p className="mt-2 text-blue-600 font-semibold">
              85%
            </p>
          </div>
        </div> */}
          <div className="max-h-[330px]" id="chartDarkStyle">
            <Chart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>
        </div>

        {/* Summary */}

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-xl border p-4">
            <Target className="mb-2 text-blue-600" />
            <p className="text-sm text-gray-500">Target</p>
            <h3 className="text-xl font-semibold">1500 h</h3>
          </div>

          <div className="rounded-xl border p-4">
            <Clock className="mb-2 text-purple-600" />
            <p className="text-sm text-gray-500">Remaining</p>
            <h3 className="text-xl font-semibold">216 h</h3>
          </div>

          <div className="rounded-xl border p-4">
            <TrendingUp className="mb-2 text-green-600" />
            <p className="text-sm text-gray-500">Avg / Day</p>
            <h3 className="text-xl font-semibold">42.8 h</h3>
          </div>
        </div>
        {/* Status */}

        
      </div>

      {/* Top Assets */}
      <div className="border shadow-xl shadow-gray-200 rounded-xl p-8">
        <div className="mt-8 grid grid-cols-2 gap-4 ">
          <div className="flex items-center justify-between rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <Play className="text-green-600" />
              <span>Running</span>
            </div>

            <span className="font-semibold">{data?.summary.workingHours} h</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <Pause className="text-yellow-500" />
              <span>Idle</span>
            </div>

            <span className="font-semibold">{data?.summary.idleHours} h</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <Wrench className="text-blue-600" />
              <span>Maintenance</span>
            </div>

            <span className="font-semibold">90 h</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <XCircle className="text-red-600" />
              <span>Offline</span>
            </div>

            <span className="font-semibold">{data?.summary.offlineHours} h</span>
          </div>
        </div>
        <hr className="text-gray-600 my-6"></hr>
      <div className="pb-4">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-semibold">Top Assets by Working Hours</h3>

          <button className="text-sm font-medium text-blue-600">
            View All
          </button>
        </div>

        <div className="space-y-5">
          {topAssets?.map((asset) => (
            <div key={asset.assetId}>
              <div className="mb-2 flex justify-between">
                <span>{asset.assetName}</span>

                <span className="font-semibold">{asset.workingHours} h</span>
              </div>

              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{
                    width: `${asset.percentage}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      
    </div>
  );
}
