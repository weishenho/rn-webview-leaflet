import React, { useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import { LeafletWebViewEvent } from './model';
import type {
  LatLng,
  LatLngBoundsLiteral,
  LatLngLiteral,
  LeafletMouseEvent,
  Map as LeafletMap,
} from 'leaflet';
type Props = {
  onMessage: (message: LeafletWebViewEvent) => void;
  toLatLngLiteral: (latLng: LatLng) => LatLngLiteral;
  bounds: (map?: LeafletMap | null) => LatLngBoundsLiteral;
  center: (map?: LeafletMap | null) => LatLngLiteral;
  mapCenterPosition?: LatLngLiteral;
  onMapClick?: (pos: LatLngLiteral) => void;
};

const EventHandle = ({
  onMessage,
  toLatLngLiteral,
  bounds,
  center,
  mapCenterPosition,
  onMapClick,
}: Props): null => {
  const map = useMapEvents({
    click: (event: LeafletMouseEvent) => {
      const { latlng } = event;

      if (onMapClick) {
        onMapClick(latlng);
      }
      onMessage({
        tag: 'onMapClicked',
        location: toLatLngLiteral(latlng),
      });
    },
    move: () => {
      onMessage({
        tag: 'onMove',
        bounds: bounds(map),
        mapCenter: center(map),
        zoom: map.getZoom()!,
      });
    },
    moveend: () => {
      onMessage({
        tag: 'onMoveEnd',
        bounds: bounds(map),
        mapCenter: center(map),
        zoom: map.getZoom()!,
      });
    },
    movestart: () => {
      onMessage({
        tag: 'onMoveStart',
        bounds: bounds(map),
        mapCenter: center(map),
        zoom: map.getZoom()!,
      });
    },
    resize: () => {
      onMessage({
        tag: 'onResize',
        bounds: bounds(map),
        mapCenter: center(map),
        zoom: map?.getZoom()!,
      });
    },
    unload: () => {
      onMessage({
        tag: 'onUnload',
        bounds: bounds(map),
        mapCenter: center(map),
        zoom: map?.getZoom()!,
      });
    },
    zoom: () => {
      onMessage({
        tag: 'onZoom',
        bounds: bounds(map),
        mapCenter: center(map),
        zoom: map?.getZoom()!,
      });
    },
    zoomend: () => {
      onMessage({
        tag: 'onZoomEnd',
        bounds: bounds(map),
        mapCenter: center(map),
        zoom: map?.getZoom()!,
      });
    },
    zoomlevelschange: () => {
      onMessage({
        tag: 'onZoomLevelsChange',
        bounds: bounds(map),
        mapCenter: center(map),
        zoom: map?.getZoom()!,
      });
    },
    zoomstart: () => {
      onMessage({
        tag: 'onZoomStart',
        bounds: bounds(map),
        mapCenter: center(map),
        zoom: map?.getZoom()!,
      });
    },
  });

  useEffect(() => {
    if (map && mapCenterPosition) {
      console.log('mapCenterPosition');
      onMessage({
        tag: 'DebugMessage',
        message: `Flying to ${mapCenterPosition.lat},${mapCenterPosition.lng}`,
      });
      map.flyTo(mapCenterPosition, map.getZoom());
    }
  }, [map, mapCenterPosition]);
  return null;
};

export default EventHandle;
