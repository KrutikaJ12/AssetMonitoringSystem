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

// 1. Custom SVG/Div Icon for Vehicle / Tracking Marker
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

const LiveMap = ({ center, siteName, locationName, geofenceRadius = 500 }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 19.07609, lng: 72.877426 });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  useEffect(() => {
    const parsedLat = parseFloat(center?.lat);
    const parsedLng = parseFloat(center?.lng);

    if (!isNaN(parsedLat) && !isNaN(parsedLng) && parsedLat !== 0 && parsedLng !== 0) {
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
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
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
      <div className="absolute top-4 left-12 z-[1000] max-w-md bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-gray-200">
        <div className="text-[11px] font-bold uppercase text-indigo-600 mb-0.5">
          📍 LOCATION: {siteName || locationName || "PLANT LOCATION"}
        </div>
        <div className="text-xs font-semibold text-gray-800 mb-2 truncate max-w-[300px]">
          {loadingAddress ? (
            <span className="text-gray-400 italic font-normal">Fetching address...</span>
          ) : (
            selectedLocation?.address || `${siteName || "Plant"} Location`
          )}
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
          <div>
            <span className="font-semibold text-gray-500">LAT:</span>{" "}
            <span className="text-indigo-600 font-bold">{activePosition.lat.toFixed(6)}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-500">LNG:</span>{" "}
            <span className="text-indigo-600 font-bold">{activePosition.lng.toFixed(6)}</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={14}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
      >
        <MapRecenter center={mapCenter} />
        <LocationMarker onLocationSelect={handleLocationSelect} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 2. GEOFENCE CIRCLE AREA (500 Meters) */}
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
        />

        {/* 3. CUSTOM ICON MARKER */}
        <Marker
          position={[activePosition.lat, activePosition.lng]}
          icon={createCustomMarker(siteName)}
        >
          <Popup>
            <div className="text-xs font-sans">
              <p className="font-bold text-gray-800">{siteName || "Selected Site"}</p>
              <p className="text-indigo-600 font-semibold mt-0.5">Geofence: {geofenceRadius}m Active</p>
              <p className="text-gray-500 text-[11px] mt-1">
                {activePosition.lat.toFixed(6)}, {activePosition.lng.toFixed(6)}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LiveMap;