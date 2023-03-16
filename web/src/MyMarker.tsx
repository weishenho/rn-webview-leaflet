import { icon, LatLngLiteral } from 'leaflet';
import React from 'react';
import { Marker } from 'react-leaflet';
type Props = {
  posClicked?: LatLngLiteral;
};

const MyMarker = ({ posClicked }: Props) => {
  return (
    <Marker
      position={
        posClicked ?? {
          lat: 1.3198801354409218,
          lng: 103.90226028148622,
        }
      }
      icon={icon({
        iconUrl: './marker-icon.png',
      })}
      key="mymarker01"
    />
  );
};

export default MyMarker;
