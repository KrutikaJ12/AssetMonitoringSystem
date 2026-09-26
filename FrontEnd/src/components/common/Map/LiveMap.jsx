import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet Default Marker Icon Fix (React me path breaks hone par)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Preset Coordinates Map for Demo Cities
const PRESET_COORDINATES = {
  vashi: { lat: 19.077065, lng: 72.998632 },
  mumbai: { lat: 19.07609, lng: 72.877426 },
  pune: { lat: 18.52043, lng: 73.856744 },
  thane: { lat: 19.21833, lng: 72.978088 },
};

// Component to dynamically change map view center when props change
const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);
  return null;
};

// Component to handle Map Clicks and Fetch Real Location Coordinates/Address
const LocationMarker = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });

  return null;
};

const LiveMap = ({ center, siteName, locationName }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 19.07609, lng: 72.877426 });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Set Initial Center based on Props or Presets
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

  // Handle Click & Reverse Geocode using Free OpenStreetMap Nominatim API
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
    } catch (error) {
      setSelectedLocation({
        lat,
        lng,
        address: "Custom Selected Location Pin",
      });
    } finally {
      setLoadingAddress(false);
    }
  };

  const activePosition = selectedLocation || mapCenter;

  return (
    <div className="relative w-full h-[550px] rounded-2xl overflow-hidden shadow-md border border-gray-200">
      {/* Real-time Location Info Overlay Card */}
      <div className="absolute top-4 left-4 z-[1000] max-w-md bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-gray-200">
        <div className="text-[11px] font-bold uppercase text-brand-600 mb-0.5">
          📍 LOCATION: {siteName || locationName || "PLANT LOCATION"}
        </div>
        <div className="text-xs font-semibold text-gray-800 mb-2 truncate">
          {loadingAddress ? (
            <span className="text-gray-400 italic">Getting real address...</span>
          ) : (
            selectedLocation?.address || `${siteName || "Plant"} Location`
          )}
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
          <div>
            <span className="font-semibold text-gray-500">LAT:</span>{" "}
            <span className="text-blue-600 font-bold">{activePosition.lat.toFixed(6)}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-500">LNG:</span>{" "}
            <span className="text-blue-600 font-bold">{activePosition.lng.toFixed(6)}</span>
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

        {/* Free OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Location Marker Pin */}
        <Marker position={[activePosition.lat, activePosition.lng]}>
          <Popup>
            <div className="text-xs font-sans">
              <p className="font-bold">{selectedLocation?.address || siteName || "Location"}</p>
              <p className="text-gray-500 mt-1">
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