
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
  useMapEvents,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createAssetMarker = (assetType = "") => {
  const type = String(assetType).toLowerCase();

  let icon = "🚜";

  if (type.includes("forklift") || type.includes("crane")) {
    icon = "🏗️";
  } else if (type.includes("dump truck")) {
    icon = "🚛";
  } else if (type.includes("loader") || type.includes("tractor")) {
    icon = "🚜";
  } else if (type.includes("generator") || type.includes("compressor")) {
    icon = "⚙️";
  }

  return L.divIcon({
    className: "custom-asset-marker",
    html: `
      <div style="
        width:42px;height:42px;background:white;
        border:2px solid #4F46E5;border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:22px;box-shadow:0 3px 8px rgba(0,0,0,.25);
      ">${icon}</div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -21],
  });
};

const createCustomMarker = () =>
  L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        background:#4F46E5;width:38px;height:38px;
        border-radius:50%;display:flex;align-items:center;
        justify-content:center;color:white;
        box-shadow:0 4px 10px rgba(79,70,229,.4);
        border:2px solid white;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });

const PRESET_COORDINATES = {
  vashi: { lat: 19.077065, lng: 72.998632 },
  mumbai: { lat: 19.07609, lng: 72.877426 },
  pune: { lat: 18.52043, lng: 73.856744 },
  thane: { lat: 19.21833, lng: 72.978088 },
};

const getCoordinates = (item) => ({
  lat: Number(item?.Latitude ?? item?.latitude ?? item?.lat),
  lng: Number(item?.Longitude ?? item?.longitude ?? item?.lng),
});

const isValidCoordinates = (lat, lng) =>
  Number.isFinite(lat) &&
  Number.isFinite(lng) &&
  lat >= -90 &&
  lat <= 90 &&
  lng >= -180 &&
  lng <= 180 &&
  !(lat === 0 && lng === 0);

const MapRecenter = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center.lat, center.lng, map]);

  return null;
};

const LocationMarker = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
};

const MapFitBounds = ({ sites, assets }) => {
  const map = useMap();

  useEffect(() => {
    const points = [
      ...sites.map(getCoordinates),
      ...assets.map(getCoordinates),
    ]
      .filter(({ lat, lng }) => isValidCoordinates(lat, lng))
      .map(({ lat, lng }) => [lat, lng]);

    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), {
        padding: [50, 50],
        maxZoom: 15,
      });
    }
  }, [sites, assets, map]);

  return null;
};

const MapFitSiteAndAssets = ({ site, assets }) => {
  const map = useMap();

  useEffect(() => {
    const points = [
      getCoordinates(site),
      ...assets.map(getCoordinates),
    ]
      .filter(({ lat, lng }) => isValidCoordinates(lat, lng))
      .map(({ lat, lng }) => [lat, lng]);

    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), {
        padding: [50, 50],
        maxZoom: 15,
      });
    }
  }, [site.lat, site.lng, assets, map]);

  return null;
};

const LiveMap = ({
  center,
  siteName,
  locationName,
  geofenceRadius = 700,
  sites = [],
  assets = [],
  onAssetClick,
  onSiteClick,
}) => {
  const [mapCenter, setMapCenter] = useState({
    lat: 19.07609,
    lng: 72.877426,
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const isAllSitesMode = sites.length > 0;

  // Normalize coordinates and filter invalid markers.
  const validSites = sites.filter((site) => {
    const { lat, lng } = getCoordinates(site);
    return isValidCoordinates(lat, lng);
  });

  const validAssets = assets.filter((asset) => {
    const { lat, lng } = getCoordinates(asset);
    return isValidCoordinates(lat, lng);
  });

  useEffect(() => {
    const lat = Number(center?.lat);
    const lng = Number(center?.lng);

    if (isValidCoordinates(lat, lng)) {
      setMapCenter({ lat, lng });
      return;
    }

    const searchKey = (locationName || siteName || "").toLowerCase();

    for (const key in PRESET_COORDINATES) {
      if (searchKey.includes(key)) {
        setMapCenter(PRESET_COORDINATES[key]);
        return;
      }
    }
  }, [center?.lat, center?.lng, siteName, locationName]);

  const handleLocationSelect = async (lat, lng) => {
    setSelectedLocation({
      lat,
      lng,
      address: "Fetching address...",
    });

    setLoadingAddress(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const data = await response.json();

      setSelectedLocation({
        lat,
        lng,
        address: data?.display_name || "Address not found",
      });
    } catch {
      setSelectedLocation({
        lat,
        lng,
        address: "Selected Pin Location",
      });
    } finally {
      setLoadingAddress(false);
    }
  };

  const activePosition = selectedLocation || mapCenter;

  const handleSiteClick = (site) => {
    onSiteClick?.(site);
  };

  const handleAssetClick = (asset) => {
    onAssetClick?.(asset);
  };

  const singleSiteDetails = {
    SiteName: siteName,
    LocationName: locationName,
    Latitude: mapCenter.lat,
    Longitude: mapCenter.lng,
    Assets: assets,
  };

  return (
    <div className="relative w-full h-[550px] rounded-2xl overflow-hidden shadow-md border border-gray-200">

      {!isAllSitesMode && (
        <div className="absolute top-4 left-12 z-[1000] max-w-md bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-gray-200">
          <div className="text-[11px] font-bold uppercase text-indigo-600 mb-0.5">
            📍 LOCATION: {siteName || locationName || "PLANT LOCATION"}
          </div>

          <div className="text-xs font-semibold text-gray-800 mb-2 truncate max-w-[300px]">
            {loadingAddress
              ? "Fetching address..."
              : selectedLocation?.address || `${siteName || "Plant"} Location`}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg border">
            <div>
              LAT:{" "}
              <span className="text-indigo-600 font-bold">
                {activePosition.lat.toFixed(6)}
              </span>
            </div>
            <div>
              LNG:{" "}
              <span className="text-indigo-600 font-bold">
                {activePosition.lng.toFixed(6)}
              </span>
            </div>
          </div>
        </div>
      )}

      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={14}
        scrollWheelZoom
        style={{ width: "100%", height: "100%" }}
      >
        <MapRecenter center={mapCenter} />

        {isAllSitesMode ? (
          <MapFitBounds sites={validSites} assets={validAssets} />
        ) : (
          <>
            <LocationMarker onLocationSelect={handleLocationSelect} />

            <MapFitSiteAndAssets
              site={mapCenter}
              assets={validAssets}
            />
          </>
        )}

        <TileLayer
          attribution="&copy; Google Maps"
          url="https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
          maxZoom={20}
        />

        {/* ALL SITE MARKERS */}
        {isAllSitesMode &&
          validSites.map((site) => {
            const { lat, lng } = getCoordinates(site);
            const radius = Number(site.RadiusMeters) || geofenceRadius;

            return (
              <React.Fragment key={site.SiteID}>
                <Circle
                  center={[lat, lng]}
                  radius={radius}
                  pathOptions={{
                    color: "#4F46E5",
                    fillColor: "#6366F1",
                    fillOpacity: 0.15,
                    dashArray: "6, 8",
                    weight: 2,
                  }}
                />

                <Marker
                  position={[lat, lng]}
                  icon={createCustomMarker()}
                  eventHandlers={{
                    click: () => handleSiteClick(site),
                  }}
                >
                  <Popup>
                    <div className="p-1 min-w-[180px]">
                      <p className="font-bold text-gray-900 text-xs">
                        {site.SiteName || site.Name || "Site"}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {site.LocationName || "Location unavailable"}
                      </p>
                      <p className="text-[10px] text-indigo-600 mt-1">
                        Assets: {site.Assets?.length ?? 0}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Click marker to view details
                      </p>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}

        {/* SINGLE SITE GEOFENCE AND MARKER */}
        {!isAllSitesMode && (
          <>
            <Circle
              center={[mapCenter.lat, mapCenter.lng]}
              radius={geofenceRadius}
              pathOptions={{
                color: "#4F46E5",
                fillColor: "#6366F1",
                fillOpacity: 0.15,
                dashArray: "6, 8",
                weight: 2,
              }}
            />

            <Marker
              position={[mapCenter.lat, mapCenter.lng]}
              icon={createCustomMarker()}
              eventHandlers={{
                click: () => handleSiteClick(singleSiteDetails),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[220px]">
                  <p className="font-bold text-gray-900 text-xs">
                    {siteName || "Site"}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {locationName}
                  </p>
                  <p className="text-[10px] text-indigo-600 mt-1">
                    Total Assets: {validAssets.length}
                  </p>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* ASSET MARKERS - BOTH MODES */}
        {validAssets.map((asset, index) => {
          const { lat, lng } = getCoordinates(asset);

          return (
            <Marker
              key={asset.AssetID ?? asset.AssetId ?? index}
              position={[lat, lng]}
              icon={createAssetMarker(asset.AssetTypeName || asset.AssetType)}
              eventHandlers={{
                click: () => handleAssetClick(asset),
              }}
            >
              <Popup className="custom-row-popup">
                <div className="p-2 min-w-[220px]">
                  <p className="font-bold text-gray-900 text-xs">
                    {asset.AssetName || asset.Name || "Asset"}
                  </p>

                  <p className="text-[10px] text-gray-500">
                    {asset.AssetTypeName || asset.AssetType || "Equipment"}
                  </p>

                  <div className="flex items-center justify-between mt-2 gap-2">
                    <span className="text-[10px] font-semibold text-emerald-600">
                      {asset.CurrentStatus || asset.Status || "Unknown"}
                    </span>

                    <span className="text-[10px] font-mono text-indigo-600">
                      {asset.SpeedKph ?? 0} km/h
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAssetClick(asset)}
                    className="mt-2 w-full rounded-md bg-indigo-600 text-white px-2 py-1.5 text-[10px] font-semibold"
                  >
                    View Asset Details
                  </button>
                </div>
              </Popup>

              <Tooltip
                permanent
                direction="bottom"
                offset={[0, 12]}
                interactive={false}
                className="asset-name-tooltip"
              >
                {asset.AssetName || asset.Name || "Asset"}
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
