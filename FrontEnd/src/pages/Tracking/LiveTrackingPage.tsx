import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, RefreshCw, ChevronRight, ChevronLeft, Info } from "lucide-react";
import LiveMap from "../../components/common/Map/LiveMap"; // Path apne folder structure ke mutabiq check kar lein
import Button from "../../components/ui/button/Button";
import { useSites } from "../../hooks/useSites";

const LiveTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: sitesData, isLoading } = useSites();

  const allSites = sitesData?.data || [];
  const activeSites = allSites.filter((site) => site.IsActive);
  const siteData = location.state || null;
  const isSingleSiteMode = Boolean(siteData);

  const selectedSite = siteData
    ? allSites.find((site) => String(site.SiteID) === String(siteData.siteId))
    : null;

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

  /* =======================================================
     ASSET DETAILS SIDEBAR STATE (RIGHT DRAWER)
  ======================================================= */
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [isAssetDrawerOpen, setIsAssetDrawerOpen] = useState(false);

  const handleAssetClick = (asset: any) => {
    setSelectedAsset(asset);
    setIsAssetDrawerOpen(true);
  };

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
    <div className="relative space-y-4">
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
      <div className="relative rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 shadow-sm overflow-hidden">
        <LiveMap
          center={{ lat: currentSite.lat, lng: currentSite.lng }}
          siteName={currentSite.siteName}
          locationName={currentSite.locationName}
          sites={!isSingleSiteMode ? activeSites : undefined}
          assets={isSingleSiteMode ? selectedSite?.Assets || [] : []}
          onAssetClick={handleAssetClick}
        />
      </div>

      {/* ===================================================
         RIGHT SIDEBAR DRAWER (LAYOUT FIXED WITH ARROWS)
      =================================================== */}
      {isAssetDrawerOpen && (
        <div className="fixed inset-0 z-[99999] overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsAssetDrawerOpen(false)}
          />

          {/* Right Sliding Panel */}
          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
            <div className="flex h-full w-96 max-w-md flex-col bg-white shadow-2xl border-l border-gray-200 dark:border-gray-800 dark:bg-gray-900">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-brand-600" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Asset Details
                  </h3>
                </div>
                {/* Close Arrow Button */}
                <button
                  type="button"
                  onClick={() => setIsAssetDrawerOpen(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Drawer Body Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedAsset ? (
                  <div className="space-y-4 text-sm">
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-400">Asset Name / ID</p>
                      <p className="font-semibold text-gray-800 dark:text-white text-base">
                        {selectedAsset.AssetName || selectedAsset.Name || "N/A"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-gray-400">Status</p>
                        <p className="font-medium text-green-600 dark:text-green-400">
                          {selectedAsset.CurrentStatus || selectedAsset.Status || "Active"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-gray-400">Speed</p>
                        <p className="font-medium text-gray-800 dark:text-white font-mono">
                          {selectedAsset.SpeedKph || 0} km/h
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 space-y-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location Coordinates</p>
                      <div className="flex justify-between text-xs font-mono text-gray-700 dark:text-gray-300">
                        <span>Lat: {selectedAsset.Latitude || currentSite.lat}</span>
                        <span>Lng: {selectedAsset.Longitude || currentSite.lng}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-10">
                    Please select an asset icon on the map to view details.
                  </p>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900">
                <button
                  type="button"
                  onClick={() => setIsAssetDrawerOpen(false)}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft size={16} /> Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;