import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function FuelConsumptionChart() {

  // =====================================================
  // 1. FUEL CONSUMPTION TREND - LINE + COLUMN CHART
  // =====================================================

  // =====================================================
// 1. FUEL CONSUMPTION TREND - STACKED COLUMN CHART
// =====================================================

// =====================================================
// 1. FUEL CONSUMPTION TREND - AREA + AVERAGE LINE
// =====================================================

const trendSeries = [
  {
    name: "Fuel Consumption",
    type: "area" as const,
    data: [320, 410, 380, 520, 470, 610, 550],
  },
  {
    name: "Average Consumption",
    type: "line" as const,
    data: [400, 400, 400, 400, 400, 400, 400],
  },
];

const trendOptions: ApexOptions = {
  chart: {
    type: "line",

    height: 300,

    toolbar: {
      show: false,
    },

    fontFamily: "Outfit, sans-serif",

    zoom: {
      enabled: false,
    },
  },

  stroke: {
    curve: "smooth",

    width: [3, 2],

    dashArray: [0, 7],
  },

  fill: {
    type: "gradient",

    gradient: {
      shadeIntensity: 1,

      opacityFrom: 0.35,

      opacityTo: 0.03,

      stops: [0, 90, 100],
    },
  },

  markers: {
    size: [4, 0],

    strokeWidth: 2,

    hover: {
      size: 6,
    },
  },

  dataLabels: {
    enabled: false,
  },

  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
    ],

    axisBorder: {
      show: false,
    },

    axisTicks: {
      show: false,
    },

    labels: {
      style: {
        fontSize: "11px",
      },
    },
  },

  yaxis: {
    min: 0,

    max: 700,

    tickAmount: 7,

    title: {
      text: "Fuel Consumption (L)",
    },

    labels: {
      formatter: (value) =>
        `${Math.round(value)}`,
    },
  },

  grid: {
    strokeDashArray: 4,

    padding: {
      left: 5,
      right: 5,
    },
  },

  annotations: {
    yaxis: [
      {
        y: 400,

        borderColor: "#9CA3AF",

        strokeDashArray: 7,

        label: {
          borderColor: "transparent",

          style: {
            fontSize: "10px",
            fontWeight: 500,
            color: "#6B7280",
            background: "transparent",
          },

          text: "Average: 400 L",
        },
      },
    ],
  },

  tooltip: {
    shared: true,

    intersect: false,

    y: {
      formatter: (value, { seriesIndex }) => {
        if (seriesIndex === 0) {
          return `${value} L`;
        }

        return `${value} L`;
      },
    },
  },

  legend: {
    show: true,

    position: "top",

    horizontalAlign: "right",

    fontSize: "11px",

    markers: {
      size: 5,
    },
  },

  responsive: [
    {
      breakpoint: 640,

      options: {
        chart: {
          height: 280,
        },

        yaxis: {
          title: {
            text: "Fuel (L)",
          },
        },

        legend: {
          position: "bottom",

          fontSize: "9px",
        },
      },
    },
  ],
};

  // =====================================================
  // 2. FUEL CONSUMPTION BY VEHICLE - DONUT CHART
  // =====================================================

const vehicleDonutSeries = [
  450,
  380,
  520,
  310,
  470,
  290,
];

const vehicleLabels = [
  "MH-01-AB-1234",
  "MH-02-CD-5678",
  "MH-03-EF-9012",
  "MH-04-GH-3456",
  "MH-05-IJ-7890",
  "MH-06-KL-1234",
];

const totalFuel = vehicleDonutSeries.reduce(
  (total, value) => total + value,
  0
);

const vehicleDonutOptions: ApexOptions = {
  chart: {
    type: "donut",
    height: 330,
    fontFamily: "Outfit, sans-serif",

    toolbar: {
      show: false,
    },
  },

  labels: vehicleLabels,

  // ==========================================
  // SLICE LABEL
  // ==========================================

  dataLabels: {
    enabled: true,

    // Slice ke andar percentage
    formatter: function (value) {
      return `${Number(value).toFixed(0)}%`;
    },

    style: {
      fontSize: "11px",
      fontWeight: 600,
    },

    dropShadow: {
      enabled: false,
    },
  },

  // ==========================================
  // DONUT
  // ==========================================

  plotOptions: {
    pie: {
      expandOnClick: true,

      donut: {
        size: "40%",

        labels: {
          show: true,

          name: {
            show: true,

            fontSize: "12px",
            fontWeight: 500,

            offsetY: -5,

            color: "#6B7280",
          },

          value: {
            show: true,

            fontSize: "18px",
            fontWeight: 600,

            offsetY: 5,

            formatter: function (value) {
              return `${Number(value).toLocaleString(
                "en-IN"
              )} L`;
            },
          },

          total: {
            show: true,

            showAlways: true,

            label: "Total Fuel",

            fontSize: "12px",
            fontWeight: 500,

            color: "#6B7280",

            formatter: function () {
              return `${totalFuel.toLocaleString(
                "en-IN"
              )} L`;
            },
          },
        },
      },
    },
  },

  // ==========================================
  // HOVER
  // ==========================================

  tooltip: {
    enabled: true,

    custom: function ({
      series,
      seriesIndex,
      w,
    }) {
      const vehicle =
        w.globals.labels[seriesIndex];

      const fuel =
        series[seriesIndex];

      const percentage =
        (fuel / totalFuel) * 100;

      return `
        <div
          style="
            padding: 10px 14px;
            font-family: Outfit, sans-serif;
            background: #ffffff;
            border: 1px solid #E5E7EB;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          "
        >
          <div
            style="
              font-size: 12px;
              font-weight: 500;
              color: #6B7280;
              margin-bottom: 5px;
            "
          >
            ${vehicle}
          </div>

          <div
            style="
              font-size: 14px;
              font-weight: 600;
              color: #111827;
              margin-bottom: 3px;
            "
          >
            Fuel Consumed:
            ${fuel.toLocaleString("en-IN")} L
          </div>

          <div
            style="
              font-size: 12px;
              color: #6B7280;
            "
          >
            Share:
            ${percentage.toFixed(1)}%
          </div>
        </div>
      `;
    },
  },

  // ==========================================
  // LABELS / LEGEND BELOW DONUT
  // ==========================================

  legend: {
    show: true,

    position: "bottom",

    horizontalAlign: "center",

    fontSize: "10px",

    itemMargin: {
      horizontal: 8,
      vertical: 5,
    },

    formatter: function (
      seriesName,
      opts
    ) {
      const index = opts.seriesIndex;

      const fuel =
        vehicleDonutSeries[index];

      const percentage =
        (fuel / totalFuel) * 100;

      return `${seriesName} - ${percentage.toFixed(
        0
      )}% (${fuel.toLocaleString("en-IN")} L)`;
    },
  },

  responsive: [
    {
      breakpoint: 640,

      options: {
        chart: {
          height: 350,
        },

        legend: {
          position: "bottom",

          horizontalAlign: "center",

          fontSize: "9px",

          itemMargin: {
            horizontal: 5,
            vertical: 4,
          },
        },

        plotOptions: {
          pie: {
            donut: {
              size: "55%",
            },
          },
        },
      },
    },
  ],
};
  // =====================================================
  // 3. VEHICLE-WISE FUEL CONSUMPTION
  // HORIZONTAL BAR CHART
  // =====================================================

  const vehicleWiseSeries = [
    {
      name: "Fuel Consumption",
      data: [
        520,
        470,
        450,
        380,
        310,
        290,
      ],
    },
  ];

  const vehicleWiseOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 300,

      toolbar: {
        show: false,
      },

      fontFamily: "Outfit, sans-serif",
    },

    plotOptions: {
      bar: {
        horizontal: true,

        borderRadius: 5,

        barHeight: "55%",
      },
    },

    dataLabels: {
      enabled: true,

      formatter: (value) => `${value} L`,

      style: {
        fontSize: "12px",
      },
    },

    xaxis: {
      categories: [
        "Truck 103",
        "Truck 105",
        "Truck 101",
        "Truck 102",
        "Truck 104",
        "Truck 106",
      ],

      title: {
        text: "Fuel Consumption (Litres)",
      },

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },
    },

    grid: {
      strokeDashArray: 4,
    },

    tooltip: {
      y: {
        formatter: (value) => `${value} L`,
      },
    },
  };


  // =====================================================
  // 4. FUEL EFFICIENCY - RADIAL BAR
  // =====================================================

  const efficiencySeries = [82];

  const efficiencyOptions: ApexOptions = {
    chart: {
      type: "radialBar",
      height: 300,

      toolbar: {
        show: false,
      },

      fontFamily: "Outfit, sans-serif",
    },

    plotOptions: {
      radialBar: {
        startAngle: -135,

        endAngle: 135,

        hollow: {
          size: "65%",
        },

        track: {
          strokeWidth: "100%",
        },

        dataLabels: {
          name: {
            show: true,

            offsetY: -10,

            fontSize: "14px",
          },

          value: {
            show: true,

            fontSize: "28px",

            fontWeight: 600,

            formatter: () => "8.2 KM/L",
          },
        },
      },
    },

    labels: ["Fuel Efficiency"],

    stroke: {
      lineCap: "round",
    },

    responsive: [
      {
        breakpoint: 640,

        options: {
          chart: {
            height: 280,
          },
        },
      },
    ],
  };


  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

      {/* ================================================= */}
      {/* 1. FUEL CONSUMPTION TREND */}
      {/* ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

        <div className="px-5 py-4">

          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Fuel Consumption Trend
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monthly fuel consumption and average
          </p>

        </div>

        <div className="px-5 pb-5">

          <Chart
            options={trendOptions}
            series={trendSeries}
            type="line"
            height={300}
          />

        </div>

      </div>


      {/* ================================================= */}
      {/* 2. FUEL CONSUMPTION BY VEHICLE */}
      {/* ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

        <div className="px-5 py-4">

          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Fuel Consumption by Vehicle
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Vehicle fuel distribution
          </p>

        </div>

        <div className="px-5 pb-5">

          <Chart
            options={vehicleDonutOptions}
            series={vehicleDonutSeries}
            type="donut"
            height={300}
          />

        </div>

      </div>


      {/* ================================================= */}
      {/* 3. VEHICLE-WISE FUEL CONSUMPTION */}
      {/* ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

        <div className="px-5 py-4">

          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Vehicle-wise Fuel Consumption
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Compare fuel usage by vehicle
          </p>

        </div>

        <div className="px-5 pb-5">

          <Chart
            options={vehicleWiseOptions}
            series={vehicleWiseSeries}
            type="bar"
            height={300}
          />

        </div>

      </div>


      {/* ================================================= */}
      {/* 4. FUEL EFFICIENCY */}
      {/* ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

        <div className="px-5 py-4">

          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Fuel Efficiency
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Overall vehicle fuel efficiency
          </p>

        </div>

        <div className="px-5 pb-5">

          <Chart
            options={efficiencyOptions}
            series={efficiencySeries}
            type="radialBar"
            height={300}
          />

        </div>

      </div>

    </div>
  );
}