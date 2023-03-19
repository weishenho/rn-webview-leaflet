import { icon } from "leaflet";
import React from "react";
import { Marker, useMapEvents } from "react-leaflet";
import type {
  LatLng,
  LatLngBoundsLiteral,
  LatLngLiteral,
  LeafletMouseEvent,
  Map as LeafletMap,
} from "leaflet";
type Props = {
  position: LatLngLiteral;
  toLatLngLiteral: (latLng: LatLng) => LatLngLiteral;
  bounds: (map?: LeafletMap | null) => LatLngBoundsLiteral;
  center: (map?: LeafletMap | null) => LatLngLiteral;
};
const onMessage = (msg: { [x: string]: any }) => {
  console.log(msg);
};
const MyMarker = ({ position, bounds, center }: Props) => {
  const map = useMapEvents({
    move: () => {
      onMessage({
        tag: "onMove",
        bounds: bounds(map),
        mapCenter: center(map),
        zoom: map.getZoom()!,
      });
    },
    moveend: () => {
      onMessage({
        tag: "onMoveEnd",
        bounds: bounds(map),
        mapCenter: center(map),
        zoom: map.getZoom()!,
      });
    },
    movestart: () => {
      onMessage({
        tag: "onMoveStart",
        bounds: bounds(map),
        mapCenter: center(map),
        zoom: map.getZoom()!,
      });
    },
  });
  return (
    <Marker
      position={position}
      icon={icon({
        iconUrl: "./marker-icon.png",
        iconSize:[24,24]
      })}
      key="mymarker01"
    />
  );
};

export default MyMarker;
