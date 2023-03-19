import { Dimensions, MapMarker as MapMarkerType } from "./types/model";
import type { LatLngExpression } from "leaflet";
import { DivIcon, divIcon } from "leaflet";
import React from "react";
import { Marker, Popup } from "react-leaflet";

export interface MapMarkersProps {
  mapMarkers: Array<MapMarkerType>;
  onClick: (markerId: string) => void;
  maxClusterRadius?: number;
}

export const createDivIcon = (mapMarker: MapMarkerType): DivIcon => {
  const [x, y]: Dimensions = mapMarker.size ?? [24, 24];
  const html =
    mapMarker.icon.includes("svg") || mapMarker.icon.includes("SVG")
      ? `<div style='font-size: ${Math.max(x, y)}px'>${mapMarker.icon}</div>`
      : mapMarker.icon.includes("//") && mapMarker.icon.includes("http")
      ? `<img src="${mapMarker.icon}" style="width:${x}px;height:${y}px;">`
      : mapMarker.icon.includes("base64")
      ? `<img src="${mapMarker.icon}" style="width:${x}px;height:${y}px;">`
      : `<div style='font-size: ${Math.max(x, y)}px'>${mapMarker.icon}</div>`;

  return divIcon({
    className: "clearMarkerContainer",
    html,
    iconAnchor: mapMarker.iconAnchor,
  });
};

export const MapMarker = ({
  mapMarker,
  onClick,
}: {
  mapMarker: MapMarkerType;
  onClick: (markerId: string) => void;
}) => {
  return (
    <Marker
      key={mapMarker.id}
      position={mapMarker.position as LatLngExpression}
      icon={createDivIcon(mapMarker)}
      eventHandlers={{
        click: () => {
          onClick(mapMarker.id);
        },
      }}
    >
      {mapMarker.title && <Popup>{mapMarker.title}</Popup>}
    </Marker>
  );
};
