import React from "react";
import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";

interface CountryMapProps {
  mapColor?: string;
}

const CountryMap: React.FC<CountryMapProps> = ({
  mapColor = "#D0D5DD",
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "150px",
      }}
    >
      <VectorMap
        map={worldMill}
        backgroundColor="transparent"
        selectedRegions={["IN"]}
        zoomOnScroll={false}
        zoomMax={12}
        zoomMin={1}
        zoomAnimate
        zoomStep={1.5}
        markersSelectable
        markers={[
          {
            latLng: [19.076, 72.8777],
            name: "Mumbai Site",
          },
          {
            latLng: [18.5204, 73.8567],
            name: "Pune Site",
          },
          {
            latLng: [28.6139, 77.209],
            name: "Delhi Site",
          },
        ]}
        markerStyle={{
          initial: {
            fill: "#465FFF",
            stroke: "#ffffff",
            strokeWidth: 2,
            r: 6,
          } as any,
        }}
        regionStyle={{
          initial: {
            fill: mapColor,
            fillOpacity: 1,
            stroke: "#ffffff",
            strokeWidth: 0.5,
          },
          hover: {
            fill: "#465FFF",
            fillOpacity: 0.8,
            cursor: "pointer",
          },
          selected: {
            fill: "#465FFF",
          },
        }}
      />
    </div>
  );
};

export default CountryMap;