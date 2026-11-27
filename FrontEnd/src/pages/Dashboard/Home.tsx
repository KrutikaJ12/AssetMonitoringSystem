import { useEffect, useState, useContext } from "react";
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
import { CarFront, BatteryChargingIcon, ChevronDown } from "lucide-react";
import batteryImage from "../../../../FrontEnd/public/images/logo/batteryImage.png";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { Tabs, type TabItem } from "../../components/common/Tabs";
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

const getNotifications = async (): Promise<DashboardNotification[]> => {
  return [
    {
      id: Date.now(),

      title: "Idle Asset Alert",

      description: "Asset VC-1001 has been idle for more than 30 minutes.",

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
  const [selectedVehicle, setSelectedVehicle] = useState("");
  /* =======================================================
     SIDEBAR / WIDGET CUSTOMIZATION STATE
  ======================================================= */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [headings, setHeadings] = useState("dashboard");
  const { user } = useContext(AuthContext);
  const fleetType =
    user?.fleetType == null || user?.fleetType === ""
      ? null
      : Number(user.fleetType);

  const isGenericDashboard = fleetType === null;
  console.log("isGenericDashboard",isGenericDashboard,fleetType)
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
      prev.map((w) => (w.id === id ? { ...w, checked: !w.checked } : w)),
    );
  };

  const handleApplyWidgets = () => {
    setWidgets(tempWidgets);
    setIsSidebarOpen(false);
  };

  const filteredWidgets = tempWidgets.filter((w) =>
    w.label.toLowerCase().includes(searchQuery.toLowerCase()),
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
      console.warn("This browser does not support notifications.");

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
          console.error("Notification permission error:", err);
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

          if (alert.severity !== "High" && alert.severity !== "Critical") {
            return;
          }

          /* =================================================
             TOAST NOTIFICATION
          ================================================= */

          toast.error(`${alert.title}: ${alert.description}`, {
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
          });

          /* =================================================
             BROWSER NOTIFICATION
          ================================================= */

          if (
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            try {
              const browserNotification = new Notification(alert.title, {
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
              console.error("Browser notification error:", browserError);
            }
          }
        });
      } catch (notificationError) {
        console.error("Notification API Error:", notificationError);
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
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Your browser does not support notifications.");

      return;
    }

    try {
      const permission = await Notification.requestPermission();

      setNotificationPermission(permission);

      if (permission === "granted") {
        toast.success("Browser notifications enabled successfully!", {
          position: "top-right",

          autoClose: 3000,
        });

        return;
      }

      toast.warning("Browser notification permission was not granted.", {
        position: "top-right",

        autoClose: 5000,
      });
    } catch (err) {
      console.error("Enable notification error:", err);

      toast.error("Unable to enable browser notifications.");
    }
  };

  /* =======================================================
     TEST BROWSER NOTIFICATION
  ======================================================= */

  const handleTestNotification = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("This browser does not support notifications.");

      return;
    }

    let permission = Notification.permission;

    /* =====================================================
       REQUEST PERMISSION
    ===================================================== */

    if (permission === "default") {
      try {
        permission = await Notification.requestPermission();

        setNotificationPermission(permission);
      } catch (err) {
        console.error("Notification permission error:", err);

        return;
      }
    }

    /* =====================================================
       DENIED
    ===================================================== */

    if (permission !== "granted") {
      toast.warning(
        "Please allow browser notifications from browser settings.",
      );

      return;
    }

    /* =====================================================
       TEST TOAST
    ===================================================== */

    toast.error("Test Alert: Low Fuel Warning!", {
      position: "top-right",

      autoClose: 3000,

      closeOnClick: true,

      pauseOnHover: false,

      toastId: `test-toast-${Date.now()}`,
    });

    /* =====================================================
       TEST BROWSER NOTIFICATION
    ===================================================== */

    try {
      const notification = new Notification("Low Fuel Warning!", {
        body: "Vehicle VC-1001 fuel level is below the configured limit.",

        icon: "/favicon.ico",

        tag: `test-low-fuel-${Date.now()}`,

        requireInteraction: false,
      });

      notification.onclick = () => {
        window.focus();

        notification.close();
      };

      window.setTimeout(() => {
        notification.close();
      }, 5000);
    } catch (err) {
      console.error("Test browser notification error:", err);
    }
  };

  /* =======================================================
     DASHBOARD DATA
  ======================================================= */

  console.log("dashboarddata", data);
  const assetStatusLabels =
    data?.data?.assetStatus?.map((asset) => asset.status) ?? [];
  const assetStatusSeries =
    data?.data?.assetStatus?.map((asset) => asset.count) ?? [];
  const assetTypes =
    data?.data?.assetTypes?.map((asset) => asset.assetType) ?? [];
  const assetTypesSeries =
    data?.data?.assetTypes?.map((asset) => asset.count) ?? [];
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
      value: data?.data?.summary?.totalSites ?? 0,
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

    colors: ["#16a34a", "#ca8a04", "#dc2626", "#475569"],

    legend: {
      position: "bottom",
    },
  };

  /* =======================================================
   BATTERY STATISTICS OPTIONS
======================================================= */

  const batteryStatusOptions: ApexOptions = {
    chart: { type: "donut" },
    labels: [
      "Less than 0%",
      "0%",
      "1 - 25%",
      "25 - 50%",
      "50 - 75%",
      "Above 75%",
    ],
    colors: ["#d1d5db", "#6b7280", "#ef4444", "#facc15", "#3b82f6", "#4ade80"],
    legend: { position: "bottom" },
  };
  const batteryStatusSeries = [0, 0, 0, 0, 0, 0]; // API data se replace karo

  const batteryHealthOptions: ApexOptions = {
    chart: { type: "donut" },
    labels: ["1 - 25%", "25 - 50%", "50 - 75%", "75 - 100%"],
    colors: ["#ef4444", "#8b5cf6", "#2dd4bf", "#22c55e"],
    legend: { position: "bottom" },
  };
  const batteryHealthSeries = [0, 0, 0, 0]; // API data se replace karo

  const batteryTempOptions: ApexOptions = {
    chart: { type: "donut" },
    labels: [
      "1 To 15 °C",
      "15 To 30 °C",
      "30 To 45 °C",
      "> 45 °C",
      "0 °C",
      "Non Reporting",
    ],
    colors: ["#4ade80", "#3b82f6", "#facc15", "#ef4444", "#6b7280", "#d1d5db"],
    legend: { position: "bottom" },
  };
  const batteryTempSeries = [0, 1, 0, 0, 0, 0]; // API data se replace karo

  const currentlyCharging = 0; // API data se replace karo

  /* =======================================================
     ASSET TYPE OPTIONS
  ======================================================= */

  const assetTypeOptions: ApexOptions = {
    chart: {
      type: "donut",
    },

    labels: assetTypes,

    colors: ["#dc2626", "#ef4444", "#fca5a5"],

    legend: {
      position: "bottom",
    },
  };

  //BATTERY TABS
  const BATTERY_TABS = [
    { key: "status", label: "Status" },
    { key: "health", label: "Health" },
    { key: "temperature", label: "Temperature" },
    { key: "charging", label: "Charging" },
  ] as const satisfies readonly TabItem[];

  type BatteryTabKey = (typeof BATTERY_TABS)[number]["key"];
  const [batteryTab, setBatteryTab] = useState<BatteryTabKey>("status");

  // Component ke andar:
  const navigate = useNavigate();

  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedVehicle(value);

    if (value) {
      navigate(`/admin/bms?vehicleId=${value}`);
    }
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

        <div className="p-4 text-red-600">Failed to load dashboard data.</div>
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
      <PageMeta
        title="Asset Monitoring Dashboard | TailAdmin"
        description="Asset monitoring system dashboard"
      />

      <ToastContainer
        position="top-right"
        autoClose={1000}
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        draggable
        theme="light"
        limit={5}
        style={{ zIndex: 999999 }}
      />

      {/* NOTIFICATION BANNER (shows on both tabs) */}
      {notificationPermission !== "granted" && (
        <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div>
            <p className="font-semibold text-yellow-800">
              🔔 Browser Notifications Disabled
            </p>
            <p className="text-sm text-yellow-700">
              Enable browser notifications to receive real-time asset alerts.
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

      {/* HEADER: tabs + settings button */}
      <div className="mb-4 flex items-center justify-between">
        <Tabs
          tabs={[
            { key: "dashboard", label: "Dashboard Overview" },
            { key: "BMS", label: "BMS" },
          ]}
          active={headings}
          onChange={setHeadings}
        />

        <button
          type="button"
          onClick={handleOpenSidebar}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          title="Customize Dashboard Widgets"
        >
          {/* ...your existing settings <svg> here... */}
          <span>Settings</span>
        </button>
      </div>

      {/* =========== DASHBOARD OVERVIEW TAB =========== */}
      {headings === "dashboard" && (
        <div className="space-y-4">
          <StatisticsMetrics metrics={adminMetrics} />

          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
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

            {isWidgetVisible("recentAlerts") && (
              <SectionCard title="Recents Alerts" actionText="View Alerts">
                <RecentAlerts data={data.data.recentAlerts} />
              </SectionCard>
            )}
          </div>

          {isWidgetVisible("workingHours") && (
            <SectionCard title="Working Hours">
              <WorkingHoursCard data={data.data.workingHours} />
            </SectionCard>
          )}

          {(isGenericDashboard || fleetType === 1 || fleetType === 3) &&
            isWidgetVisible("fuelConsumption") && (
              <div>
                <StatisticsChart data={data.fuelConsumption} />
              </div>
            )}

          {(isGenericDashboard || fleetType === 1 || fleetType === 3) &&
            isWidgetVisible("siteSummary") && (
              <SiteSummary data={data.data.siteSummary} />
            )}
        </div>
      )}

      {/* =========== BMS TAB =========== */}
      {(isGenericDashboard || fleetType === 2 || fleetType === 3)  && headings === "BMS" &&
        isWidgetVisible("batteryStats") && (
          <div className="space-y-4">
            <SectionCard title="Battery Statistics">
              <div className="space-y-4">
                <Tabs
                  tabs={[...BATTERY_TABS]}
                  active={batteryTab}
                  onChange={(key) => setBatteryTab(key as BatteryTabKey)}
                />

                {batteryTab === "status" && (
                  <Chart
                    options={batteryStatusOptions}
                    series={batteryStatusSeries}
                    type="donut"
                    height={320}
                  />
                )}
                {batteryTab === "health" && (
                  <Chart
                    options={batteryHealthOptions}
                    series={batteryHealthSeries}
                    type="donut"
                    height={320}
                  />
                )}
                {batteryTab === "temperature" && (
                  <Chart
                    options={batteryTempOptions}
                    series={batteryTempSeries}
                    type="donut"
                    height={320}
                  />
                )}
                {batteryTab === "charging" && (
                  <div className="flex h-[320px] items-center justify-center gap-3">
                    <BatteryChargingIcon size={48} className="text-green-600" />
                    <span className="text-5xl font-light text-green-600">
                      {currentlyCharging}
                    </span>
                  </div>
                )}
              </div>
            </SectionCard>

            {isWidgetVisible("batteryChart") && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 items-center gap-4 sm:border-r sm:border-gray-200 sm:py-1 dark:sm:border-gray-700">
                    <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                      <BatteryChargingIcon size={25} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Battery Status
                      </h3>
                      <p className="text-sm text-gray-400">
                        Monitor individual vehicle battery information
                      </p>
                    </div>
                  </div>

                  <div className="relative w-full sm:w-[220px]">
                    <CarFront
                      size={19}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <select
                      value={selectedVehicle}
                      onChange={handleVehicleChange}
                      className="w-full appearance-none rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-10 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Select Vehicle</option>
                      <option value="395">MH16BY7745</option>
                      <option value="393">NLO1N5922</option>
                    </select>
                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Empty state / details */}
                {!selectedVehicle ? (
                  <div className="mt-5 flex min-h-[168px] flex-col items-center gap-4 overflow-hidden rounded-xl bg-gradient-to-br from-[#EDF3FD] via-[#F8FAFF] to-[#EAF0FD] sm:flex-row sm:gap-6">
                    <div className="flex h-[168px] w-full shrink-0 items-center justify-center sm:w-[320px]">
                      <img
                        src={batteryImage}
                        alt="Battery and construction vehicle illustration"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="px-5 pb-5 text-center sm:flex-1 sm:py-5 sm:pl-0 sm:pr-8 sm:text-left">
                      <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-800">
                        Select a vehicle to view battery status
                      </h3>
                      <p className="text-sm leading-6 text-gray-500">
                        Choose a vehicle from the dropdown to see its battery
                        level, voltage, charging status, temperature and health.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5">
                    <BatteryChart />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      {/* RIGHT SIDEBAR DRAWER */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[99999] overflow-hidden">
          {/* ...your existing drawer code, unchanged... */}
        </div>
      )}
    </>
  );
}
