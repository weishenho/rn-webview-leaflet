import type { LatLngLiteral, MapOptions } from "leaflet";
import { ReactElement } from "react";
import { LeafletWebViewEvent, MapLayer, MapMarker, MapShape } from "./model";

export type LeafletMapProps = {
  mapOptions?: MapOptions;
  mapLayers: MapLayer[];
  mapMarkers?: MapMarker[];
  mapShapes?: MapShape[];
  ownPositionMarker?: MapMarker;
  mapCenterPosition: LatLngLiteral;
  zoom?: number;
  maxZoom?: number;
  minZoom?: number;
};

export type LeafletProps = LeafletMapProps & {
  backgroundColor?: string;
  loadingIndicator?: () => ReactElement;
  onMapLoad?: () => void;
  onMessage: (message: LeafletWebViewEvent) => void;
};

export type { LatLngLiteral, MapOptions } from "leaflet";
