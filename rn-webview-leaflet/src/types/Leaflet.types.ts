import type { LatLngLiteral, MapOptions } from 'leaflet';
export type { LatLngLiteral, MapOptions } from 'leaflet';

import type {
  LeafletWebViewEvent,
  MapLayer,
  MapMarker,
  MapShape,
} from './model';

export type LeafletMapProps = {
  mapOptions?: MapOptions;
  mapLayers: MapLayer[];
  mapMarkers?: MapMarker[];
  ownPositionMarker?: MapMarker;
  mapShapes?: MapShape[];
  mapCenterPosition: LatLngLiteral;
  zoom?: number;
  maxZoom?: number;
  minZoom?: number;
  onClickMarkerPos?: boolean;
};

export type LeafletProps = LeafletMapProps & {
  backgroundColor?: string;
  loadingIndicator?: () => React.ReactElement;
  onMapLoad?: () => void;
  onMessage: (message: LeafletWebViewEvent) => void;
};
