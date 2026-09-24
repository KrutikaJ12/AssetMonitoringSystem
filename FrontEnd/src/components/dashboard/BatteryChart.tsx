import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";

import {
  BatteryFull,
  Zap,
  PlugZap,
  Thermometer,
  HeartPulse,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function BatteryChart() {
  // Battery Data
  const batteryValue = 68;
  const voltage = 12.6;
  const chargingStatus = "Charging";
  const temperature = 32;
  const batteryHealth = 94;
  const lastUpdated = "2 min ago";

  // Status
  const batteryStatus = "Good";

  const series = [batteryValue];

  const options: ApexOptions = {
    colors: ["#22c55e"],

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
        startAngle: -95,
        endAngle: 95,

        hollow: {
          size: "50%",
        },

        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },

        dataLabels: {
          name: {
            show: false,
          },

          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -25,
            color: "#1D2939",

            formatter: function (val) {
              return `${val}%`;
            },
          },
        },
      },
    },

    fill: {
      type: "solid",
      colors: ["#22c55e"],
    },

    stroke: {
      lineCap: "round",
    },

    labels: ["Battery"],
  };

  const [isOpen, setIsOpen] = useState(false);

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">

      <div className="rounded-2xl bg-white px-5 pt-5 pb-6 shadow-default dark:bg-gray-900 sm:px-6 sm:pt-6">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between">

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Battery Status
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Current battery information
            </p>
          </div>

          {/* Dropdown */}
          <div className="relative inline-block">

            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >

              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full items-center gap-2 font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View More
              </DropdownItem>

              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full items-center gap-2 font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Delete
              </DropdownItem>

            </Dropdown>

          </div>
        </div>

        {/* ================= BATTERY GRAPH ================= */}

        <div className="relative">

          <div className="max-h-[330px]">

            <Chart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />

          </div>

        </div>

        {/* ================= STATUS ================= */}

        <div className="flex justify-center -mt-2">

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-green-50
              px-4
              py-1.5
              text-xs
              font-medium
              text-green-600
              dark:bg-green-500/10
              dark:text-green-400
            "
          >

            <CheckCircle2 size={15} />

            <span>
              Battery {batteryStatus}
            </span>

          </div>

        </div>

        {/* ================= BATTERY INFORMATION ================= */}

        <div className="mt-6 grid grid-cols-2 gap-3">

          {/* 1. Battery Percentage */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.02]">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                <BatteryFull size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Battery
                </p>

                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {batteryValue}%
                </p>
              </div>

            </div>

          </div>

          {/* 2. Voltage */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.02]">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Zap size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Voltage
                </p>

                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {voltage} V
                </p>
              </div>

            </div>

          </div>

          {/* 3. Charging Status */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.02]">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                <PlugZap size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Charging
                </p>

                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {chargingStatus}
                </p>
              </div>

            </div>

          </div>

          {/* 4. Temperature */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.02]">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                <Thermometer size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Temperature
                </p>

                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {temperature}°C
                </p>
              </div>

            </div>

          </div>

          {/* 5. Battery Health */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.02]">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <HeartPulse size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Battery Health
                </p>

                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {batteryHealth}%
                </p>
              </div>

            </div>

          </div>

          {/* 6. Last Updated */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.02]">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                <Clock3 size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last Updated
                </p>

                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {lastUpdated}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* ================= FOOTER ================= */}

        <div className="mt-5 flex items-center justify-center gap-2">

          <span className="h-2 w-2 rounded-full bg-green-500"></span>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Battery monitoring active
          </p>

        </div>

      </div>
    </div>
  );
}