import type {
  CircleMarkerOptions,
  CircleOptions,
  LatLngBoundsExpression,
  LatLngBoundsLiteral,
  LatLngExpression,
  LatLngLiteral,
  PathOptions,
  PointTuple,
  PolylineOptions
} from 'leaflet';

export type Dimensions = [width: number, height: number];

type Payload = {
  bounds: LatLngBoundsLiteral;
  mapCenter: LatLngLiteral;
  zoom: number;
};

export type MapMarkerClickedEvent = {
  tag: 'onMapMarkerClicked';
  mapMarkerId: string;
};

export type LeafletWebViewEvent =
  | { tag: 'DebugMessage'; message: string }
  | { tag: 'DocumentEventListenerAdded' }
  | { tag: 'DocumentEventListenerRemoved' }
  | { tag: 'Error'; error: any }
  | { tag: 'WindowEventListenerAdded' }
  | { tag: 'WindowEventListenerRemoved' }
  | { tag: 'MapReady'; version: string }
  | { tag: 'MapComponentMounted'; version: string }
  | { tag: 'onMapClicked'; location: LatLngLiteral }
  | MapMarkerClickedEvent
  | ({ tag: 'onMove' } & Payload)
  | ({ tag: 'onMoveEnd' } & Payload)
  | ({ tag: 'onMoveStart' } & Payload)
  | ({ tag: 'onResize' } & Payload)
  | ({ tag: 'onUnload' } & Payload)
  | ({ tag: 'onZoom' } & Payload)
  | ({ tag: 'onZoomEnd' } & Payload)
  | ({ tag: 'onZoomLevelsChange' } & Payload)
  | ({ tag: 'onZoomStart' } & Payload);

export type MapLayerType =
  | 'ImageOverlay'
  | 'TileLayer'
  | 'VectorLayer'
  | 'VideoOverlay'
  | 'WMSTileLayer';

export type MapMarker = {
  icon: string;
  iconAnchor?: PointTuple;
  id: string;
  position: LatLngLiteral;
  size?: Dimensions;
  title?: string;
  ownPositionMarker?: boolean;
};

export type MapLayer = {
  attribution?: string;
  baseLayer?: boolean;
  baseLayerIsChecked?: boolean;
  baseLayerName?: string;
  bounds?: LatLngBoundsLiteral;
  id?: string;
  layerType?: MapLayerType;
  opacity?: number;
  pane?: string;
  subLayer?: string;
  url?: string;
  zIndex?: number;
};

export interface CircleProps extends CircleOptions {
  center: LatLngExpression;
  children?: React.ReactNode;
}
type CircleShape = {
  shapeType: 'circle';
} & CircleProps;

export interface CircleMarkerProps extends CircleMarkerOptions {
  center: LatLngExpression;
  children?: React.ReactNode;
}
type CircleMarkerShape = {
  shapeType: 'circleMarker';
} & unknown;

export interface PolygonProps extends PolylineOptions {
  children?: React.ReactNode;
  positions: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][];
}
type PolygonShape = {
  shapeType: 'polygon';
} & PolygonProps;

export interface PolylineProps extends PolylineOptions {
  children?: React.ReactNode;
  positions: LatLngExpression[] | LatLngExpression[][];
}
type PolylineShape = {
  shapeType: 'polyline';
} & PolylineProps;
export interface RectangleProps extends PathOptions {
  bounds: LatLngBoundsExpression;
  children?: React.ReactNode;
}
type RectangleShape = {
  shapeType: 'rectangle';
} & RectangleProps;

export type MapShape = { id?: string } & (
  | CircleShape
  | CircleMarkerShape
  | PolygonShape
  | PolylineShape
  | RectangleShape
);
