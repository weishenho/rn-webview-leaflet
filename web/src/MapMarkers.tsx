import type { LatLngExpression } from "leaflet";
import { DivIcon, divIcon } from "leaflet";
import * as React from "react";
import { LayerGroup, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet.markercluster";
import "react-leaflet-cluster/lib/assets/MarkerCluster.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.Default.css";
import { Dimensions, MapMarker as MapMarkerType } from "./types/model";

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

const MapMarker = ({
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

interface MapMarkersProps {
  mapMarkers: Array<MapMarkerType>;
  onClick: (markerId: string) => void;
  maxClusterRadius?: number;
}

const MapMarkers = (props: MapMarkersProps) => {
  // const useMarkerClustering = props.maxClusterRadius == null;
  if (true) {
    return (
      <LayerGroup>
        <MarkerClusterGroup >
          {props.mapMarkers.map((mapMarker: MapMarkerType) => {
            if (mapMarker.ownPositionMarker) {
              return null;
            }
            return (
              <MapMarker
                key={mapMarker.id}
                mapMarker={mapMarker}
                onClick={props.onClick}
              />
            );
          })}
        </MarkerClusterGroup>
        {props.mapMarkers.map((mapMarker: MapMarkerType) => {
          if (mapMarker.ownPositionMarker) {
            return (
              <MapMarker
                key={mapMarker.id}
                mapMarker={mapMarker}
                onClick={props.onClick}
              />
            );
          } else {
            return null;
          }
        })}
      </LayerGroup>
    );
  } else {
    return (
      <LayerGroup>
        {props.mapMarkers.map((mapMarker: MapMarkerType) => {
          return (
            <MapMarker
              key={mapMarker.id}
              mapMarker={mapMarker}
              onClick={props.onClick}
            />
          );
        })}
      </LayerGroup>
    );
  }
};

export { MapMarkers };
