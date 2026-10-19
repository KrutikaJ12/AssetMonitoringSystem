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
import { socket } from "../../services/socket"; // <-- Socket import add kiya hai

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
     SIDEBAR / WIDGET CUSTOMIZATION STATE
  ======================================================= */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [widgets, setWidgets] = useState([
    { id: "assetStatus", label: "Asset Status Overview", checked: true },
    { id: "assetType", label: "Assets By Type", checked: true },
    { id: "recentAlerts", label: "Recent Alerts", checked: true },
    { id: "workingHours", label: "Working Hours", checked: true },
    { id: "fuelConsumption", label: "Fuel Consumption", checked: true },
    { id: "batteryChart", label: "Battery Analyzer", checked: true },
    { id: "siteSummary", label: "Site Summary", checked: true },
  ]);

  const [tempWidgets, setTempWidgets] = useState(widgets);

  const handleOpenSidebar = () => {
    setTempWidgets(widgets);
    setIsSidebarOpen(true);
  };

  const handleCheckboxChange = (id: string) => {
    setTempWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, checked: !w.checked } : w))
    );
  };

  const handleApplyWidgets = () => {
    setWidgets(tempWidgets);
    setIsSidebarOpen(false);
  };

  const filteredWidgets = tempWidgets.filter((w) =>
    w.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isWidgetVisible = (id: string) => {
    const widget = widgets.find((w) => w.id === id);
    return widget ? widget.checked : true;
  };

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
     SOCKET.IO REAL-TIME LISTENER
  ======================================================= */
  useEffect(() => {
    socket.on("assetUpdate", (updatedAsset) => {
      console.log("Real-time asset update received:", updatedAsset);
      // Agar aap React Query use kar rahe hain, toh yahan refetch() call kar sakte hain 
      // taaki dashboard data automatically server se naya fetch ho jaye.
    });

    return () => {
      socket.off("assetUpdate");
    };
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
    }, 30000);

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
          HEADER SECTION WITH SETTINGS ICON
      =================================================== */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Dashboard Overview
        </h2>

        {/* Setting/Filter Button Trigger */}
        <button
          type="button"
          onClick={handleOpenSidebar}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          title="Customize Dashboard Widgets"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Settings</span>
        </button>
      </div>

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

              {/* ASSET STATUS */}
              {isWidgetVisible("assetStatus") && (
                <SectionCard title="Assets Status Overview">
                  <Chart
                    options={donutOptions}
                    series={assetStatusSeries}
                    type="donut"
                    height={300}
                  />
                </SectionCard>
              )}

              {/* ASSET TYPE */}
              {isWidgetVisible("assetType") && (
                <SectionCard title="Assets By Type">
                  <Chart
                    options={assetTypeOptions}
                    series={assetTypesSeries}
                    type="donut"
                    height={300}
                  />
                </SectionCard>
              )}

              {/* RECENT ALERTS */}
              {isWidgetVisible("recentAlerts") && (
                <SectionCard title="Recents Alerts" actionText="View Alerts">
                  <RecentAlerts data={data.data.recentAlerts}/>
                </SectionCard>
              )}
            </div>

            {/* =============================================
                WORKING HOURS
            ============================================= */}

            {isWidgetVisible("workingHours") && (
              <SectionCard title="Working Hours">
                <WorkingHoursCard
                  data={data.data.workingHours}
                />
              </SectionCard>
            )}

            {/* =============================================
                FUEL
            ============================================= */}

            {isWidgetVisible("fuelConsumption") && (
              <div>
                <StatisticsChart
                  data={data.fuelConsumption}
                />
              </div>
            )}

            {/* =============================================
                BATTERY
            ============================================= */}

            {isWidgetVisible("batteryChart") && (
              <div>
                <BatteryChart />
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            SITE SUMMARY
        ================================================= */}

        {isWidgetVisible("siteSummary") && (
          <div className="col-span-12 mt-4 xl:col-span-7">
            <SiteSummary
              data={data.data.siteSummary}
            />
          </div>
        )}
      </div>

      {/* ===================================================
          RIGHT SIDEBAR DRAWER (LAYOUT FIXED)
      =================================================== */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[99999] overflow-hidden">
          {/* Dark Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Right Sliding Panel */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="flex h-full w-80 max-w-sm flex-col bg-white shadow-2xl border-l border-gray-200 dark:border-gray-800 dark:bg-gray-900">
              
              {/* Search Bar Container */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="relative flex items-center">
                  <svg className="absolute left-3 h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search widgets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Widgets Selection List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <p className="text-xs font-normal text-gray-400">
                  Select widgets to show on dashboard:
                </p>

                <div className="space-y-3">
                  {filteredWidgets.map((widget) => (
                    <label
                      key={widget.id}
                      className="flex items-center justify-between cursor-pointer group py-1"
                    >
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 dark:text-gray-300">
                        {widget.label}
                      </span>
                      <input
                        type="checkbox"
                        checked={widget.checked}
                        onChange={() => handleCheckboxChange(widget.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons Footer (Apply and Cancel Fixed) */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900">
                <button
                  type="button"
                  onClick={handleApplyWidgets}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}