import type { LatLngLiteral, MapOptions } from './L.types';

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

export type { LatLngLiteral, MapOptions } from './L.types';
