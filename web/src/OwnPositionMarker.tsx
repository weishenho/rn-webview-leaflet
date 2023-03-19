import React from "react";
import type { MapMarker as MapMarkerType } from "./types/model";
import { MapMarker } from "./utitilies";
interface Props {
  mapmarker: MapMarkerType;
  onClick: (markerId: string) => void;
}

const OwnPositionMarker = ({ mapmarker, onClick }: Props) => {
  return (
    <MapMarker key={mapmarker.id} mapMarker={mapmarker} onClick={onClick} />
  );
};

export default OwnPositionMarker;
