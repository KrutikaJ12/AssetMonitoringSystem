import  { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, MapPin, RefreshCw, Search } from "lucide-react";
import LiveMap from "../../components/common/Map/LiveMap"; // Path apne folder structure ke according check kar lein
import Button from "../../components/ui/button/Button";
import { useSites } from "../../hooks/useSites";

const LiveTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: sitesData, isLoading } = useSites();
  const allSites = sitesData?.data || [];

  const activeSites = allSites.filter((site) => site.IsActive);
  // 1. SiteAdmin page se passing State receive kar rahe hain
  const siteData = location.state || null;

  const isSingleSiteMode = Boolean(siteData);

  // 2. Default Coordinates (agar koi state na mile toh default Pune / Mumbai)
  const defaultCenter = {
    lat: parseFloat(siteData?.lat) || 18.52043,
    lng: parseFloat(siteData?.lng) || 73.856744,
  };

  const [currentSite, setCurrentSite] = useState({
    siteName: siteData?.siteName || "Pune Plant",
    locationName: siteData?.locationName || siteData?.siteName || "Pune",
    lat: defaultCenter.lat,
    lng: defaultCenter.lng,
  });

  const [searchQuery, setSearchQuery] = useState("");

  // State change hone par update karein
  useEffect(() => {
    if (location.state) {
      setCurrentSite({
        siteName: location.state.siteName || "Selected Site",
        locationName:
          location.state.locationName ||
          location.state.siteName ||
          "Site Location",
        lat: parseFloat(location.state.lat) || 18.52043,
        lng: parseFloat(location.state.lng) || 73.856744,
      });
    }
  }, [location.state]);

  const handleResetLocation = () => {
    setCurrentSite({
      siteName: siteData?.siteName || "Pune Plant",
      locationName: siteData?.locationName || "Pune",
      lat: defaultCenter.lat,
      lng: defaultCenter.lng,
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Back Button */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 mb-1 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Live Tracking:{" "}
            <span className="text-brand-600">
              {isSingleSiteMode ? currentSite.siteName : "All Sites"}
            </span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
            Current Lat:{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {currentSite.lat.toFixed(6)}
            </span>{" "}
            | Lng:{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {currentSite.lng.toFixed(6)}
            </span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetLocation}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={14} /> Reset View
          </Button>
        </div>
      </div>

      {/* Map Section Box */}
      <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        <LiveMap
          center={{ lat: currentSite.lat, lng: currentSite.lng }}
          siteName={currentSite.siteName}
          locationName={currentSite.locationName}
          sites={!isSingleSiteMode ? activeSites : undefined}
        />
      </div>
    </div>
  );
};

export default LiveTracking;
