import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createAssetMarker = (assetType = "") => {
  const type = assetType.toLowerCase();

  let icon = "🚜";

  if (type.includes("forklift")) {
    icon = "🏗️";
  } else if (type.includes("crane")) {
    icon = "🏗️";
  } else if (type.includes("excavator")) {
    icon = "🚜";
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
        width: 42px;
        height: 42px;
        background: white;
        border: 2px solid #4F46E5;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        box-shadow: 0 3px 8px rgba(0,0,0,0.25);
      ">
        ${icon}
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -21],
  });
};

const createCustomMarker = (title = "Site") => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        background-color: #4F46E5;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 4px 10px rgba(79, 70, 229, 0.4);
        border: 2px solid white;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });
};

const PRESET_COORDINATES = {
  vashi: { lat: 19.077065, lng: 72.998632 },
  mumbai: { lat: 19.07609, lng: 72.877426 },
  pune: { lat: 18.52043, lng: 73.856744 },
  thane: { lat: 19.21833, lng: 72.978088 },
};

const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);
  return null;
};

const LocationMarker = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
};

const MapFitBounds = ({ sites }) => {
  const map = useMap();

  useEffect(() => {
    if (!sites || sites.length === 0) return;

    const validSites = sites.filter(
      (site) =>
        Number.isFinite(Number(site.Latitude)) &&
        Number.isFinite(Number(site.Longitude)),
    );

    if (validSites.length === 0) return;

    const bounds = L.latLngBounds(
      validSites.map((site) => [Number(site.Latitude), Number(site.Longitude)]),
    );

    map.fitBounds(bounds, {
      padding: [50, 50],
    });
  }, [sites, map]);

  return null;
};

const MapFitSiteAndAssets = ({ site, assets, showAssets }) => {
  const map = useMap();

  useEffect(() => {
    if (!showAssets || !site) return;

    const points = [
      [Number(site.lat), Number(site.lng)],
      ...assets
        .filter(
          (asset) =>
            Number.isFinite(Number(asset.Latitude)) &&
            Number.isFinite(Number(asset.Longitude)),
        )
        .map((asset) => [Number(asset.Latitude), Number(asset.Longitude)]),
    ];

    if (points.length <= 1) return;

    const bounds = L.latLngBounds(points);

    map.fitBounds(bounds, {
      padding: [50, 50],
    });
  }, [site, assets, showAssets, map]);

  return null;
};

const LiveMap = ({
  center,
  siteName,
  locationName,
  geofenceRadius = 700,
  sites = [],
  assets = [],
}) => {
  const [mapCenter, setMapCenter] = useState({ lat: 19.07609, lng: 72.877426 });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [showAssetMarkers, setShowAssetMarkers] = useState(false);
  const isAllSitesMode = sites.length > 0;

  useEffect(() => {
    const parsedLat = parseFloat(center?.lat);
    const parsedLng = parseFloat(center?.lng);

    if (
      !isNaN(parsedLat) &&
      !isNaN(parsedLng) &&
      parsedLat !== 0 &&
      parsedLng !== 0
    ) {
      setMapCenter({ lat: parsedLat, lng: parsedLng });
      return;
    }

    const searchKey = (locationName || siteName || "").toLowerCase();
    for (const key in PRESET_COORDINATES) {
      if (searchKey.includes(key)) {
        setMapCenter(PRESET_COORDINATES[key]);
        return;
      }
    }
  }, [center, siteName, locationName]);

  const handleLocationSelect = async (lat, lng) => {
    setSelectedLocation({ lat, lng, address: "Fetching address..." });
    setLoadingAddress(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();
      setSelectedLocation({
        lat,
        lng,
        address: data?.display_name || "Address not found",
      });
    } catch (error) {
      setSelectedLocation({ lat, lng, address: "Selected Pin Location" });
    } finally {
      setLoadingAddress(false);
    }
  };

  const activePosition = selectedLocation || mapCenter;

  return (
    <div className="relative w-full h-[550px] rounded-2xl overflow-hidden shadow-md border border-gray-200">
      {/* Top Left Floating Coordinate Card */}
      {!isAllSitesMode && (
        <div className="absolute top-4 left-12 z-[1000] max-w-md bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-gray-200">
          <div className="text-[11px] font-bold uppercase text-indigo-600 mb-0.5">
            📍 LOCATION:{" "}
            {isAllSitesMode
              ? "ALL SITES"
              : siteName || locationName || "PLANT LOCATION"}
          </div>
          <div className="text-xs font-semibold text-gray-800 mb-2 truncate max-w-[300px]">
            {loadingAddress ? (
              <span className="text-gray-400 italic font-normal">
                Fetching address...
              </span>
            ) : (
              selectedLocation?.address || `${siteName || "Plant"} Location`
            )}
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
            <div>
              <span className="font-semibold text-gray-500">LAT:</span>{" "}
              <span className="text-indigo-600 font-bold">
                {activePosition.lat.toFixed(6)}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-500">LNG:</span>{" "}
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
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
      >
        <MapRecenter center={mapCenter} />
        {isAllSitesMode && <MapFitBounds sites={sites} />}
        {!isAllSitesMode && (
          <LocationMarker onLocationSelect={handleLocationSelect} />
        )}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {isAllSitesMode ? (
          sites.map((site) => {
            const lat = Number(site.Latitude);
            const lng = Number(site.Longitude);
            const radius = Number(site.RadiusMeters);

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
                  icon={createCustomMarker(site.SiteName)}
                >
                  <Popup className="custom-row-popup">
                    <div className="p-1 font-sans">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-bold text-gray-900 text-xs truncate">
                            {site.SiteName}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {site.LocationName}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200 whitespace-nowrap">
                          Geofence: {radius}m
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })
        ) : (
          <>
            <MapFitSiteAndAssets
              site={{
                lat: activePosition.lat,
                lng: activePosition.lng,
              }}
              assets={assets}
              showAssets={showAssetMarkers}
            />

            <Circle
              center={[activePosition.lat, activePosition.lng]}
              radius={geofenceRadius}
              pathOptions={{
                color: "#4F46E5",
                fillColor: "#6366F1",
                fillOpacity: 0.15,
                dashArray: "6, 8",
                weight: 2,
              }}
              eventHandlers={{
                mouseover: (e) => {
                  e.target.openPopup();
                },
                mouseout: (e) => {
                  e.target.closePopup();
                },
                click: (e) => {
                  setShowAssetMarkers(true);
                  e.target.closePopup();
                },
              }}
            >
              <Marker
                position={[activePosition.lat, activePosition.lng]}
                icon={createCustomMarker(siteName)}
              >
                {/* 1. TOTAL / SITE INFOBOX (SINGLE ROW FORMAT) */}
                {/* 1. TOTAL / SITE INFOBOX (CLEAN ROW LIST WITHOUT SCROLLBAR) */}
                <Popup className="custom-row-popup">
                  <div className="p-1 font-sans min-w-[280px]">
                    {/* Site Header */}
                    <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-xs truncate">
                          {siteName}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">
                          {locationName}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 whitespace-nowrap">
                        Total Assets: {assets.length}
                      </span>
                    </div>

                    {/* All Assets Displayed in Clean Stacked Rows */}
                    {assets.length === 0 ? (
                      <p className="text-[11px] text-gray-400 italic">
                        No assets assigned
                      </p>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {assets.map((asset) => (
                          <div
                            key={asset.AssetID}
                            className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2"
                          >
                            {/* Asset Name & Type */}
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-gray-800 text-[11px] truncate">
                                {asset.AssetName}
                              </span>
                              <span className="text-[9px] text-gray-400 font-medium truncate">
                                {asset.AssetTypeName || "Equipment"}
                              </span>
                            </div>

                            {/* Status & Speed Badge */}
                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase ${
                                  asset.CurrentStatus?.toLowerCase() ===
                                  "running"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-rose-100 text-rose-700"
                                }`}
                              >
                                {asset.CurrentStatus}
                              </span>
                              <span className="text-[10px] text-indigo-600 font-mono font-bold">
                                {asset.SpeedKph || 0} km/h
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            </Circle>

            {/* 2. SPECIFIC ASSET INFOBOX (SINGLE ROW FORMAT) */}
            {showAssetMarkers &&
              assets.map((asset) => {
                const lat = Number(asset.Latitude);
                const lng = Number(asset.Longitude);
                if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                  return null;
                }
                return (
                  <Marker
                    key={asset.AssetID}
                    position={[lat, lng]}
                    icon={createAssetMarker(asset.AssetTypeName)}
                  >
                    <Popup className="custom-row-popup">
                      <div className="flex items-center gap-3 p-1 font-sans min-w-[280px]">
                        {/* Thumbnail Image */}
                        <div className="relative shrink-0 w-11 h-11 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                          <img
                            src={
                              asset.ImageURL ||
                              "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=80"
                            }
                            alt={asset.AssetName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentElement.classList.add(
                                "flex",
                                "items-center",
                                "justify-center",
                                "text-base",
                              );
                              e.target.parentElement.innerHTML = "🚜";
                            }}
                          />
                        </div>

                        {/* Details in Single Flex Row */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-bold text-gray-900 text-xs truncate">
                              {asset.AssetName}
                            </p>
                            <span className="text-[9px] text-gray-400 font-medium truncate">
                              {asset.AssetTypeName || "Equipment"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 mt-1.5">
                            {/* Status Badge */}
                            <span
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                asset.CurrentStatus?.toLowerCase() === "running"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                  : "bg-rose-50 text-rose-600 border border-rose-200"
                              }`}
                            >
                              <span
                                className={`w-1 h-1 rounded-full ${
                                  asset.CurrentStatus?.toLowerCase() ===
                                  "running"
                                    ? "bg-emerald-500 animate-pulse"
                                    : "bg-rose-500"
                                }`}
                              />
                              {asset.CurrentStatus}
                            </span>

                            {/* Speed */}
                            <span className="text-[10px] font-mono font-semibold text-indigo-600">
                              {asset.SpeedKph || 0} km/h
                            </span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
