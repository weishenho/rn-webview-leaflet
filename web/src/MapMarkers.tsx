import type { LatLngExpression } from "leaflet";
import { DivIcon, divIcon } from "leaflet";
import * as React from "react";
import { LayerGroup, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet.markercluster";
import "react-leaflet-cluster/lib/assets/MarkerCluster.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.Default.css";
import { Dimensions, MapMarker as MapMarkerType } from "./types/model";
import { MapMarker } from "./utitilies";

export interface MapMarkersProps {
  mapMarkers: Array<MapMarkerType>;
  onClick: (markerId: string) => void;
  maxClusterRadius?: number;
}

const MapMarkers = (props: MapMarkersProps) => {
  // const useMarkerClustering = props.maxClusterRadius == null;
  if (true) {
    return (
      <LayerGroup>
        <MarkerClusterGroup>
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
