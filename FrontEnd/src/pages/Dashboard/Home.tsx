import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SiteSummary from "../../components/dashboard/SiteSummary";
import PageMeta from "../../components/common/PageMeta";
import StatisticsMetrics from "../../components/dashboard/StatisticsMetrics";
import BatteryChart from "../../components/dashboard/BatteryChart";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import StatisticsChart from "../../components/dashboard/StatisticsChart";
import { GroupIcon } from "../../icons";
import { RecentAlerts } from "../../components/dashboard/RecentAlerts";
import { SectionCard } from "../../components/cards/SectionCard";
import WorkingHoursCard from "../../components/dashboard/WorkingHoursCard";
import { useDashboard } from "../../hooks/useDashboard";

/* =========================================================
   NOTIFICATION TYPE
========================================================= */

type DashboardNotification = {
  id: string | number;
  title: string;
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  createdAt?: string;
};

/* =========================================================
   DUMMY NOTIFICATION API
========================================================= */

const getNotifications = async (): Promise<
  DashboardNotification[]
> => {
  return [
    {
      id: Date.now(),

      title: "Idle Asset Alert",

      description:
        "Asset VC-1001 has been idle for more than 30 minutes.",

      severity: "High",

      createdAt: new Date().toISOString(),
    },
  ];
};

/* =========================================================
   HOME COMPONENT
========================================================= */

export default function Home() {
  /* =======================================================
     DASHBOARD DATA
  ======================================================= */

  const { data, isLoading, error } = useDashboard();

  /* =======================================================
     NOTIFICATION PERMISSION
  ======================================================= */

  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");

  /* =======================================================
     CHECK BROWSER NOTIFICATION SUPPORT
  ======================================================= */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!("Notification" in window)) {
      console.warn(
        "This browser does not support notifications."
      );

      return;
    }

    setNotificationPermission(Notification.permission);

    /*
     * Try automatic permission request.
     *
     * If browser blocks automatic permission request,
     * user can click Enable Notifications button.
     */

    if (Notification.permission === "default") {
      Notification.requestPermission()
        .then((permission) => {
          setNotificationPermission(permission);
        })
        .catch((err) => {
          console.error(
            "Notification permission error:",
            err
          );
        });
    }
  }, []);

  /* =======================================================
     REAL TIME NOTIFICATION
     
     EVERY 1 SECOND:
     1. Dummy API
     2. Toast
     3. Browser notification
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const checkNotifications = async () => {
      try {
        const alerts = await getNotifications();

        if (!mounted) {
          return;
        }

        alerts.forEach((alert) => {
          /* =================================================
             ONLY HIGH / CRITICAL
          ================================================= */

          if (
            alert.severity !== "High" &&
            alert.severity !== "Critical"
          ) {
            return;
          }

          /* =================================================
             TOAST NOTIFICATION
          ================================================= */

          toast.error(
            `${alert.title}: ${alert.description}`,
            {
              position: "top-right",

              autoClose: 1000,

              closeOnClick: true,

              pauseOnHover: false,

              draggable: true,

              newestOnTop: true,

              /*
               * Unique ID.
               *
               * Every second new Toast.
               */
              toastId: `asset-alert-${Date.now()}`,
            }
          );

          /* =================================================
             BROWSER NOTIFICATION
          ================================================= */

          if (
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            try {
              const browserNotification =
                new Notification(alert.title, {
                  body: alert.description,

                  icon: "/favicon.ico",

                  /*
                   * Unique tag.
                   *
                   * Every second new browser notification.
                   */
                  tag: `asset-alert-${Date.now()}`,

                  requireInteraction: false,
                });

              /* =============================================
                 CLICK
              ============================================= */

              browserNotification.onclick = () => {
                window.focus();

                browserNotification.close();
              };

              /* =============================================
                 AUTO CLOSE
              ============================================= */

              window.setTimeout(() => {
                browserNotification.close();
              }, 1000);
            } catch (browserError) {
              console.error(
                "Browser notification error:",
                browserError
              );
            }
          }
        });
      } catch (notificationError) {
        console.error(
          "Notification API Error:",
          notificationError
        );
      }
    };

    /* =====================================================
       FIRST CHECK
    ===================================================== */

    checkNotifications();

    /* =====================================================
       EVERY 1 SECOND
    ===================================================== */

    const intervalId = window.setInterval(() => {
      checkNotifications();
    }, 1000);

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      mounted = false;

      window.clearInterval(intervalId);
    };
  }, []);

  /* =======================================================
     ENABLE BROWSER NOTIFICATIONS
  ======================================================= */

  const enableNotifications = async () => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window)
    ) {
      toast.error(
        "Your browser does not support notifications."
      );

      return;
    }

    try {
      const permission =
        await Notification.requestPermission();

      setNotificationPermission(permission);

      if (permission === "granted") {
        toast.success(
          "Browser notifications enabled successfully!",
          {
            position: "top-right",

            autoClose: 3000,
          }
        );

        return;
      }

      toast.warning(
        "Browser notification permission was not granted.",
        {
          position: "top-right",

          autoClose: 5000,
        }
      );
    } catch (err) {
      console.error(
        "Enable notification error:",
        err
      );

      toast.error(
        "Unable to enable browser notifications."
      );
    }
  };

  /* =======================================================
     TEST BROWSER NOTIFICATION
  ======================================================= */

  const handleTestNotification = async () => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window)
    ) {
      toast.error(
        "This browser does not support notifications."
      );

      return;
    }

    let permission = Notification.permission;

    /* =====================================================
       REQUEST PERMISSION
    ===================================================== */

    if (permission === "default") {
      try {
        permission =
          await Notification.requestPermission();

        setNotificationPermission(permission);
      } catch (err) {
        console.error(
          "Notification permission error:",
          err
        );

        return;
      }
    }

    /* =====================================================
       DENIED
    ===================================================== */

    if (permission !== "granted") {
      toast.warning(
        "Please allow browser notifications from browser settings."
      );

      return;
    }

    /* =====================================================
       TEST TOAST
    ===================================================== */

    toast.error(
      "Test Alert: Low Fuel Warning!",
      {
        position: "top-right",

        autoClose: 3000,

        closeOnClick: true,

        pauseOnHover: false,

        toastId: `test-toast-${Date.now()}`,
      }
    );

    /* =====================================================
       TEST BROWSER NOTIFICATION
    ===================================================== */

    try {
      const notification =
        new Notification(
          "Low Fuel Warning!",
          {
            body:
              "Vehicle VC-1001 fuel level is below the configured limit.",

            icon: "/favicon.ico",

            tag: `test-low-fuel-${Date.now()}`,

            requireInteraction: false,
          }
        );

      notification.onclick = () => {
        window.focus();

        notification.close();
      };

      window.setTimeout(() => {
        notification.close();
      }, 5000);
    } catch (err) {
      console.error(
        "Test browser notification error:",
        err
      );
    }
  };

  /* =======================================================
     DASHBOARD DATA
  ======================================================= */

  console.log('dashboarddata',data)
  const assetStatusLabels =
    data?.data?.assetStatus?.map((asset) => asset.status) ?? [];
  const assetStatusSeries =
    data?.data?.assetStatus?.map((asset) => asset.count) ?? [];
  const assetTypes = data?.data?.assetTypes?.map((asset) => asset.assetType) ?? [];
  const assetTypesSeries = data?.data?.assetTypes?.map((asset) => asset.count) ?? [];
  const adminMetrics = [
    {
      title: "Total Assets",
      value: data?.data?.summary?.totalAssets ?? 0,
      icon: <GroupIcon />,
    },

    {
      title: "Active Assets",
      value: data?.data?.summary?.runningAssets ?? 0,
      icon: <GroupIcon />,
    },

    {
      title: "Idle Assets",
      value: data?.data?.summary?.idleAssets ?? 0,
      icon: <GroupIcon />,
    },

    {
      title: "Total Sites",
      value:data?.data?.summary?.totalSites ?? 0,
      icon: <GroupIcon />,
    },

    {
      title: "Active Operators",
      value: data?.data?.summary?.activeOperators ?? 0,
      icon: <GroupIcon />,
    },
  ];

  /* =======================================================
     DONUT OPTIONS
  ======================================================= */

  const donutOptions: ApexOptions = {
    chart: {
      type: "donut",
    },

    labels: assetStatusLabels,

    colors: [
      "#dc2626",
      "#ef4444",
      "#fca5a5",
    ],

    legend: {
      position: "bottom",
    },
  };

  /* =======================================================
     ASSET TYPE OPTIONS
  ======================================================= */

  const assetTypeOptions: ApexOptions = {
    chart: {
      type: "donut",
    },

    labels: assetTypes,

    colors: [
      "#dc2626",
      "#ef4444",
      "#fca5a5",
    ],

    legend: {
      position: "bottom",
    },
  };

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          newestOnTop
          closeOnClick
          pauseOnHover={false}
          draggable
          theme="light"
          limit={5}
          style={{
            zIndex: 999999,
          }}
        />

        <div className="p-4 text-red-600">
          Failed to load dashboard data.
        </div>
      </>
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading || !data) {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          newestOnTop
          closeOnClick
          pauseOnHover={false}
          draggable
          theme="light"
          limit={5}
          style={{
            zIndex: 999999,
          }}
        />

        <div className="flex items-center justify-center p-10">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      {/* ===================================================
          PAGE META
      =================================================== */}

      <PageMeta
        title="Asset Monitoring Dashboard | TailAdmin"
        description="Asset monitoring system dashboard"
      />

      {/* ===================================================
          TOAST CONTAINER
      =================================================== */}

      <ToastContainer
        position="top-right"
        autoClose={1000}
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        draggable
        theme="light"
        limit={5}
        style={{
          zIndex: 999999,
        }}
      />

      {/* ===================================================
          NOTIFICATION STATUS
      =================================================== */}

      {notificationPermission !== "granted" && (
        <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div>
            <p className="font-semibold text-yellow-800">
              🔔 Browser Notifications Disabled
            </p>

            <p className="text-sm text-yellow-700">
              Enable browser notifications to receive
              real-time asset alerts.
            </p>
          </div>

          <button
            type="button"
            onClick={enableNotifications}
            className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700"
          >
            Enable Notifications
          </button>
        </div>
      )}

      {/* ===================================================
          TEST BUTTON
      =================================================== */}

      {/* <div className="mb-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleTestNotification}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          🔔 Test Browser Alert
        </button>
      </div> */}

      {/* ===================================================
          DASHBOARD
      =================================================== */}

      <div>
        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="grid w-full gap-2">
          <StatisticsMetrics
            metrics={adminMetrics}
          />
        </div>

        {/* =================================================
            DASHBOARD CONTENT
        ================================================= */}

        <div className="mb-6 flex md:gap-6">
          <div className="flex w-full flex-col gap-4">

            {/* =============================================
                TOP CARDS
            ============================================= */}

            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">

              {/* ===========================================
                  ASSET STATUS
              =========================================== */}

              <SectionCard title="Assets Status Overview">
                <Chart
                  options={donutOptions}
                  series={assetStatusSeries}
                  type="donut"
                  height={300}
                />
              </SectionCard>

              {/* ===========================================
                  ASSET TYPE
              =========================================== */}

              <SectionCard title="Assets By Type">
                <Chart
                  options={assetTypeOptions}
                  series={assetTypesSeries}
                  type="donut"
                  height={300}
                />
              </SectionCard>
              <SectionCard title="Recents Alerts" actionText="View Alerts">
                <RecentAlerts data={data.data.recentAlerts}/>
              </SectionCard>
            </div>

            {/* =============================================
                WORKING HOURS
            ============================================= */}

            <SectionCard title="Working Hours">
              <WorkingHoursCard
                data={data.workingHours}
              />
            </SectionCard>

            {/* =============================================
                FUEL
            ============================================= */}

            <div>
              <StatisticsChart
                data={data.fuelConsumption}
              />
            </div>

            {/* =============================================
                BATTERY
            ============================================= */}

            <div>
              <BatteryChart />
            </div>
          </div>
        </div>

        {/* =================================================
            SITE SUMMARY
        ================================================= */}

        <div className="col-span-12 mt-4 xl:col-span-7">
          <SiteSummary
            data={data.siteSummary}
          />
        </div>
      </div>
    </>
  );
}