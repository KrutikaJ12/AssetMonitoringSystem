import { Link, useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

// =========================================================
// REPORT DETAILS API RESPONSE
// =========================================================
interface ReportDetailsData {
  siteName: string;
  vehicaleNo: string;
  startDate: string;
  endDate: string;
  duration: string;
}

// =========================================================
// ASSET MOVEMENT DATA
// API se baad me ye data aayega
// =========================================================
interface AssetMovement {
  time: string;
  location: string;
  status: "START" | "MOVING" | "STOP";
  latitude?: number;
  longitude?: number;
}

// =========================================================
// REPORT DETAILS PAGE
// =========================================================
export default function ReportDetails() {
  const { vehicleNo } = useParams();
  const location = useLocation();

  // =========================================================
  // BACK PATH
  // Summary se aaye -> Summary
  // Daily Usage se aaye -> Daily Usage
  // =========================================================
  const backPath =
    location.state?.from || "/admin/reports/summary";

  // =========================================================
  // STATES
  // =========================================================
  const [report, setReport] =
    useState<ReportDetailsData | null>(null);

  const [movementData, setMovementData] =
    useState<AssetMovement[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================================
  // FETCH REPORT DETAILS
  // =========================================================
  const fetchReportDetails = async () => {
    try {
      setLoading(true);
      setError("");

      // =====================================================
      // STATIC REPORT DATA
      // API AANE KE BAAD YAHAN API CALL LAGANI HAI
      // =====================================================
      const staticReport: ReportDetailsData = {
        siteName: "Mumbai",
        vehicaleNo: vehicleNo || "MH43CK3346",
        startDate: "2026-06-15 08:00 AM",
        endDate: "2026-06-15 05:30 PM",
        duration: "9h 30m",
      };

      // =====================================================
      // SAMPLE ASSET MOVEMENT DATA
      // API AANE KE BAAD ISKO API RESPONSE SE REPLACE KARNA
      // =====================================================
      const staticMovementData: AssetMovement[] = [
        {
          time: "08:00 AM",
          location: "Mumbai - Warehouse",
          status: "START",
          latitude: 19.076,
          longitude: 72.8777,
        },
        {
          time: "09:15 AM",
          location: "Andheri",
          status: "MOVING",
          latitude: 19.1197,
          longitude: 72.8468,
        },
        {
          time: "11:00 AM",
          location: "Bandra",
          status: "MOVING",
          latitude: 19.0596,
          longitude: 72.8295,
        },
        {
          time: "01:30 PM",
          location: "Thane",
          status: "MOVING",
          latitude: 19.2183,
          longitude: 72.9781,
        },
        {
          time: "03:45 PM",
          location: "Bhiwandi",
          status: "MOVING",
          latitude: 19.2813,
          longitude: 73.0483,
        },
        {
          time: "05:30 PM",
          location: "Mumbai - Warehouse",
          status: "STOP",
          latitude: 19.076,
          longitude: 72.8777,
        },
      ];

      // =====================================================
      // API LOADING SIMULATION
      // =====================================================
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      setReport(staticReport);
      setMovementData(staticMovementData);

      // =====================================================
      // FUTURE API
      // =====================================================
      //
      // const response = await fetch(
      //   `YOUR_API_URL/reports/${vehicleNo}`
      // );
      //
      // if (!response.ok) {
      //   throw new Error("Failed to fetch report");
      // }
      //
      // const data = await response.json();
      //
      // setReport(data.report);
      // setMovementData(data.movements);
      //
      // =====================================================
    } catch (err) {
      console.error(
        "Error fetching report details:",
        err
      );

      setError("Failed to load report details.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD DATA
  // =========================================================
  useEffect(() => {
    if (vehicleNo) {
      fetchReportDetails();
    }
  }, [vehicleNo]);

  // =========================================================
  // GRAPH OPTIONS
  // =========================================================
  const movementChartOptions: ApexOptions = {
    chart: {
      type: "line",

      toolbar: {
        show: false,
      },

      zoom: {
        enabled: false,
      },
    },

    stroke: {
      curve: "smooth",
      width: 3,
    },

    markers: {
      size: 6,

      hover: {
        size: 8,
      },
    },

    xaxis: {
      categories: movementData.map(
        (item) => item.time
      ),

      title: {
        text: "Time",
      },

      labels: {
        rotate: -45,
      },
    },

    yaxis: {
      title: {
        text: "Location",
      },

      min: 1,

      max:
        movementData.length > 0
          ? movementData.length
          : 1,

      tickAmount:
        movementData.length > 1
          ? movementData.length - 1
          : 1,

      labels: {
        formatter: (value: number) => {
          const index =
            Math.round(value) - 1;

          return (
            movementData[index]?.location || ""
          );
        },
      },
    },

    tooltip: {
      custom: ({
        dataPointIndex,
      }) => {
        const item =
          movementData[dataPointIndex];

        if (!item) {
          return "";
        }

        return `
          <div style="
            padding: 12px;
            min-width: 180px;
          ">
            <div style="
              font-weight: 600;
              margin-bottom: 6px;
            ">
              ${item.location}
            </div>

            <div style="margin-bottom: 4px;">
              Time: ${item.time}
            </div>

            <div style="margin-bottom: 4px;">
              Status: ${item.status}
            </div>

            ${
              item.latitude !== undefined
                ? `
                  <div style="margin-bottom: 4px;">
                    Latitude: ${item.latitude}
                  </div>
                `
                : ""
            }

            ${
              item.longitude !== undefined
                ? `
                  <div>
                    Longitude: ${item.longitude}
                  </div>
                `
                : ""
            }
          </div>
        `;
      },
    },

    grid: {
      strokeDashArray: 4,
    },
  };

  // =========================================================
  // GRAPH SERIES
  // =========================================================
  const movementChartSeries = [
    {
      name: "Asset Movement",

      data: movementData.map(
        (_, index) => index + 1
      ),
    },
  ];

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">

        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading report details...
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================
  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">

          <p className="text-sm text-red-600 dark:text-red-400">
            {error || "Report not found."}
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================
  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900 sm:p-6">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Report Details
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Asset movement and journey details
          </p>

        </div>

        {/* =================================================
            BACK BUTTON
        ================================================== */}
        <Link
          to={backPath}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          ← Back to Reports
        </Link>

      </div>

      {/* =====================================================
          ASSET SUMMARY
      ====================================================== */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* ASSET ID */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Asset ID
          </p>

          <p className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">
            {report.vehicaleNo}
          </p>

        </div>

        {/* SITE */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Site Name
          </p>

          <p className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">
            {report.siteName}
          </p>

        </div>

        {/* START */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Started At
          </p>

          <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-white">
            {report.startDate}
          </p>

        </div>

        {/* STOP */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Stopped At
          </p>

          <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-white">
            {report.endDate}
          </p>

        </div>

      </div>

      {/* =====================================================
          ASSET JOURNEY GRAPH
      ====================================================== */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">

        <div className="mb-5">

          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Asset Journey Timeline
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track asset start time, movement locations,
            and stop time.
          </p>

        </div>

        <div className="w-full">

          <Chart
            options={movementChartOptions}
            series={movementChartSeries}
            type="line"
            height={450}
          />

        </div>

      </div>

      {/* =====================================================
          MOVEMENT DETAILS TABLE
      ====================================================== */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

        {/* TABLE HEADER */}
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Movement Details
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Complete asset movement history
              </p>

            </div>

            {/* TOTAL DURATION */}
            <div className="rounded-lg bg-gray-50 px-4 py-2 dark:bg-gray-700/50">

              <span className="text-xs text-gray-500 dark:text-gray-400">
                Total Duration
              </span>

              <p className="font-semibold text-gray-800 dark:text-white">
                {report.duration}
              </p>

            </div>

          </div>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[750px] text-left text-sm">

            <thead className="bg-gray-50 dark:bg-gray-700/50">

              <tr>

                <th className="px-5 py-4 font-medium text-gray-500 dark:text-gray-300">
                  Time
                </th>

                <th className="px-5 py-4 font-medium text-gray-500 dark:text-gray-300">
                  Location
                </th>

                <th className="px-5 py-4 font-medium text-gray-500 dark:text-gray-300">
                  Status
                </th>

                <th className="px-5 py-4 font-medium text-gray-500 dark:text-gray-300">
                  Latitude
                </th>

                <th className="px-5 py-4 font-medium text-gray-500 dark:text-gray-300">
                  Longitude
                </th>

              </tr>

            </thead>

            <tbody>

              {movementData.map(
                (item, index) => (
                  <tr
                    key={`${item.time}-${index}`}
                    className="border-t border-gray-100 dark:border-gray-700"
                  >

                    {/* TIME */}
                    <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                      {item.time}
                    </td>

                    {/* LOCATION */}
                    <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                      {item.location}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          item.status === "START"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : item.status === "STOP"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {item.status}
                      </span>

                    </td>

                    {/* LATITUDE */}
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                      {item.latitude ?? "-"}
                    </td>

                    {/* LONGITUDE */}
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                      {item.longitude ?? "-"}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}