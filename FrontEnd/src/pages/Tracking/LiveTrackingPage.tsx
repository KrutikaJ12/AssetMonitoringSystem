
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  ArrowLeft,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Info,
  MapPin,
  Truck,
} from "lucide-react";

import LiveMap from "../../components/common/Map/LiveMap";
import Button from "../../components/ui/button/Button";
import { useSites } from "../../hooks/useSites";

const LiveTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { data: sitesData, isLoading } = useSites();

  const allSites = sitesData?.data || [];

  const activeSites = allSites.filter(
    (site) => site.IsActive
  );

  const siteData = location.state || null;
  const isSingleSiteMode = Boolean(siteData);

  const selectedSite = siteData
    ? allSites.find(
        (site) =>
          String(site.SiteID) ===
          String(siteData.siteId ?? siteData.SiteID)
      )
    : null;

  // Collect assets assigned to all active sites.
  const allAssets = activeSites.flatMap((site) =>
    (site.Assets || []).map((asset) => ({
      ...asset,
      SiteID: asset.SiteID ?? site.SiteID,
      SiteName: asset.SiteName ?? site.SiteName,
      LocationName: asset.LocationName ?? site.LocationName,
    }))
  );

  // Assets assigned to selected site.
  const selectedSiteAssets =
    selectedSite?.Assets || siteData?.Assets || [];

  const mapAssets = isSingleSiteMode
    ? selectedSiteAssets
    : allAssets;

  const defaultCenter = {
    lat: Number(siteData?.lat ?? siteData?.Latitude) || 18.52043,
    lng: Number(siteData?.lng ?? siteData?.Longitude) || 73.856744,
  };

  const [currentSite, setCurrentSite] = useState({
    siteName: siteData?.siteName || "Pune Plant",
    locationName:
      siteData?.locationName ||
      siteData?.siteName ||
      "Pune",
    lat: defaultCenter.lat,
    lng: defaultCenter.lng,
  });

  // Drawer states
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Asset icon click
  const handleAssetClick = (asset: any) => {
    setSelectedAsset(asset);
    setSelectedLocation(null);
    setIsDrawerOpen(true);
  };

  // Site / Location icon click
  const handleSiteClick = (site: any) => {
    setSelectedLocation(site);
    setSelectedAsset(null);
    setIsDrawerOpen(true);
  };

  // Close drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    if (location.state) {
      const state = location.state;

      setCurrentSite({
        siteName: state.siteName || "Selected Site",
        locationName:
          state.locationName ||
          state.siteName ||
          "Site Location",
        lat:
          Number(state.lat ?? state.Latitude) || 18.52043,
        lng:
          Number(state.lng ?? state.Longitude) || 73.856744,
      });
    }
  }, [location.state]);

  // Reset map location
  const handleResetLocation = () => {
    setCurrentSite({
      siteName: siteData?.siteName || "Pune Plant",
      locationName:
        siteData?.locationName ||
        siteData?.siteName ||
        "Pune",
      lat: defaultCenter.lat,
      lng: defaultCenter.lng,
    });
  };

  const getValue = (...values: any[]) =>
    values.find(
      (value) =>
        value !== null &&
        value !== undefined &&
        value !== ""
    ) ?? "N/A";

  const assetStatus =
    getValue(
      selectedAsset?.CurrentStatus,
      selectedAsset?.Status
    );

  const locationStatus =
    selectedLocation?.IsActive === true
      ? "Active"
      : selectedLocation?.IsActive === false
        ? "Inactive"
        : "N/A";

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading sites and assigned assets...
        </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-4">

      {/* HEADER */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="mb-1 flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Live Tracking:{" "}
            <span className="text-brand-600">
              {isSingleSiteMode
                ? currentSite.siteName
                : "All Sites"}
            </span>
          </h1>

          <p className="mt-1 font-mono text-xs text-gray-500 dark:text-gray-400">
            Current Lat:{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {currentSite.lat.toFixed(6)}
            </span>
            {" | "}
            Lng:{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {currentSite.lng.toFixed(6)}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetLocation}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={14} />
            Reset View
          </Button>
        </div>
      </div>

      {/* ASSET SUMMARY */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {/* <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs text-gray-500">
            Total Sites
          </p>
          <p className="mt-1 text-xl font-bold text-gray-800 dark:text-white">
            {isSingleSiteMode ? 1 : activeSites.length}
          </p>
        </div> */}

        {/* <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs text-gray-500">
            Assigned Assets
          </p>
          <p className="mt-1 text-xl font-bold text-indigo-600">
            {mapAssets.length}
          </p>
        </div> */}

        {/* <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:col-span-1">
          <p className="text-xs text-gray-500">
            Assets with GPS
          </p>
          <p className="mt-1 text-xl font-bold text-emerald-600">
            {
              mapAssets.filter((asset: any) => {
                const lat = Number(
                  asset.Latitude ?? asset.latitude ?? asset.lat
                );
                const lng = Number(
                  asset.Longitude ?? asset.longitude ?? asset.lng
                );

                return (
                  Number.isFinite(lat) &&
                  Number.isFinite(lng) &&
                  lat >= -90 &&
                  lat <= 90 &&
                  lng >= -180 &&
                  lng <= 180 &&
                  !(lat === 0 && lng === 0)
                );
              }).length
            }
          </p>
        </div> */}
      </div>

      {/* MAP */}
      <div className="relative rounded-2xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">

        <LiveMap
          center={{
            lat: currentSite.lat,
            lng: currentSite.lng,
          }}
          siteName={currentSite.siteName}
          locationName={currentSite.locationName}
          sites={
            !isSingleSiteMode
              ? activeSites
              : []
          }
          assets={mapAssets}
          onAssetClick={handleAssetClick}
          onSiteClick={handleSiteClick}
        />

      </div>

      {/* RIGHT SIDE DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[99999] overflow-hidden">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleCloseDrawer}
          />

          {/* DRAWER */}
          <div className="absolute inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">

            <div className="flex h-full w-screen max-w-md flex-col border-l border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">

              {/* DRAWER HEADER */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 dark:border-gray-800">

                <div className="flex items-center gap-2">

                  {selectedAsset ? (
                    <Truck className="h-5 w-5 text-brand-600" />
                  ) : (
                    <MapPin className="h-5 w-5 text-brand-600" />
                  )}

                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {selectedAsset
                      ? "Asset Details"
                      : "Location Details"}
                  </h3>

                </div>

                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <ChevronRight size={20} />
                </button>

              </div>

              {/* DRAWER BODY */}
              <div className="flex-1 space-y-4 overflow-y-auto p-4">

                {/* ASSET DETAILS */}
                {selectedAsset && (
                  <div className="space-y-4">

                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                      <p className="text-xs text-gray-400">
                        Asset Name
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-800 dark:text-white">
                        {getValue(
                          selectedAsset.AssetName,
                          selectedAsset.Name
                        )}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Asset ID:{" "}
                        {getValue(
                          selectedAsset.AssetID,
                          selectedAsset.AssetId
                        )}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">

                      <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-xs text-gray-400">
                          Status
                        </p>
                        <p className="mt-1 font-semibold text-emerald-600">
                          {assetStatus}
                        </p>
                      </div>

                      <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-xs text-gray-400">
                          Speed
                        </p>
                        <p className="mt-1 font-semibold text-gray-800 dark:text-white">
                          {getValue(selectedAsset.SpeedKph, 0)} km/h
                        </p>
                      </div>

                    </div>

                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                      <p className="text-xs text-gray-400">
                        Asset Type
                      </p>
                      <p className="mt-1 font-medium text-gray-800 dark:text-white">
                        {getValue(
                          selectedAsset.AssetTypeName,
                          selectedAsset.AssetType
                        )}
                      </p>
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Location Coordinates
                      </p>

                      <div className="mt-3 space-y-2 font-mono text-xs text-gray-700 dark:text-gray-300">
                        <p>
                          Latitude:{" "}
                          {getValue(
                            selectedAsset.Latitude,
                            selectedAsset.latitude,
                            selectedAsset.lat
                          )}
                        </p>
                        <p>
                          Longitude:{" "}
                          {getValue(
                            selectedAsset.Longitude,
                            selectedAsset.longitude,
                            selectedAsset.lng
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                      <p className="text-xs text-gray-400">
                        Assigned Site
                      </p>
                      <p className="mt-1 font-semibold text-gray-800 dark:text-white">
                        {getValue(selectedAsset.SiteName)}
                      </p>
                    </div>

                  </div>
                )}

                {/* LOCATION DETAILS */}
                {selectedLocation && (
                  <div className="space-y-4">

                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                      <p className="text-xs text-gray-400">
                        Site Name
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-800 dark:text-white">
                        {getValue(
                          selectedLocation.SiteName,
                          selectedLocation.siteName,
                          selectedLocation.Name
                        )}
                      </p>
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                      <p className="text-xs text-gray-400">
                        Site ID
                      </p>
                      <p className="mt-1 font-semibold text-gray-800 dark:text-white">
                        {getValue(
                          selectedLocation.SiteID,
                          selectedLocation.siteId
                        )}
                      </p>
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                      <p className="text-xs text-gray-400">
                        Location
                      </p>
                      <p className="mt-1 font-medium text-gray-800 dark:text-white">
                        {getValue(
                          selectedLocation.LocationName,
                          selectedLocation.locationName,
                          selectedLocation.Location
                        )}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">

                      <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-xs text-gray-400">
                          Latitude
                        </p>
                        <p className="mt-1 break-all font-mono text-sm text-gray-800 dark:text-white">
                          {getValue(
                            selectedLocation.Latitude,
                            selectedLocation.lat
                          )}
                        </p>
                      </div>

                      <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-xs text-gray-400">
                          Longitude
                        </p>
                        <p className="mt-1 break-all font-mono text-sm text-gray-800 dark:text-white">
                          {getValue(
                            selectedLocation.Longitude,
                            selectedLocation.lng
                          )}
                        </p>
                      </div>

                    </div>

                    <div className="grid grid-cols-2 gap-3">

                      <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-xs text-gray-400">
                          Status
                        </p>
                        <p className="mt-1 font-semibold text-emerald-600">
                          {locationStatus}
                        </p>
                      </div>

                      <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-xs text-gray-400">
                          Total Assets
                        </p>
                        <p className="mt-1 text-xl font-bold text-indigo-600">
                          {selectedLocation.Assets?.length ?? 0}
                        </p>
                      </div>

                    </div>

                  </div>
                )}

              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900">

                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <ChevronLeft size={16} />
                  Close
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
