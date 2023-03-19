import {
  icon,
  LatLng,
  LatLngBoundsLiteral,
  LatLngExpression,
  LatLngLiteral,
  Map as LeafletMap,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import {
  ImageOverlay,
  ImageOverlayProps,
  LayersControl,
  MapContainer,
  TileLayer,
  TileLayerProps,
  WMSTileLayer,
  WMSTileLayerProps,
} from "react-leaflet";
import Measure from "react-measure";
import "./styles/markers.css";
import { LeafletProps } from "./types/Leaflet.types";
import { MapMarkers } from "./MapMarkers";
import { MapShapes } from "./MapShapes";
import { MapLayer } from "./types/model";
import EventHandle from "./EventHandle";
import OwnPositionMarker from "./OwnPositionMarker";

const { BaseLayer } = LayersControl;

interface MapLayersProps {
  mapLayers: Array<MapLayer>;
}

const Layer = (props: MapLayer): JSX.Element => {
  switch (props.layerType) {
    case "ImageOverlay":
      return <ImageOverlay {...(props as ImageOverlayProps)} />;
    case "WMSTileLayer":
      return <WMSTileLayer {...(props as WMSTileLayerProps)} />;
    default:
      return <TileLayer {...(props as TileLayerProps)} />;
  }
};

const MapLayers = (props: MapLayersProps) => {
  const { mapLayers } = props;
  const Wrap = mapLayers.length > 1 ? LayersControl : React.Fragment;
  return (
    <Wrap>
      {mapLayers.map((layer: MapLayer, index: number): JSX.Element => {
        if (layer.baseLayerName && mapLayers.length > 1) {
          return (
            <BaseLayer
              key={`layer-${layer.baseLayerName}`}
              checked={layer.baseLayerIsChecked || false}
              name={layer.baseLayerName || `Layer.${index}`}
            >
              <Layer {...layer} />
            </BaseLayer>
          );
        } else {
          return (
            <Layer key={`layer-${layer.baseLayerName || "base"}`} {...layer} />
          );
        }
      })}
    </Wrap>
  );
};

const toLatLngLiteral = (latLng: LatLng): LatLngLiteral => {
  return {
    lat: latLng?.lat,
    lng: latLng?.lng,
  };
};

const bounds = (map?: LeafletMap | null): LatLngBoundsLiteral => {
  const bound = map?.getBounds()!;
  const northEast = bound?.getNorthEast();
  const southWest = bound?.getSouthWest();
  return [
    [northEast?.lat, northEast?.lng],
    [southWest?.lat, southWest?.lng],
  ];
};

const center = (map?: LeafletMap | null): LatLngLiteral => {
  return toLatLngLiteral(map?.getCenter()!);
};
interface Props extends LeafletProps {
  onClickMarkerPos?: boolean;
}
export const MapComponent = (props: Props) => {
  const {
    mapCenterPosition,
    mapLayers = [],
    mapMarkers = [],
    mapShapes = [],
    onMessage,
    zoom = 13,
    maxZoom = 20,
    minZoom = 11,
    ownPositionMarker,
  } = props;
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  const [posClicked, setPosClicked] = useState<LatLngLiteral | undefined>(
    undefined
  );

  const onMapClick = (pos: LatLngLiteral) => {
    setPosClicked(pos);
  };

  return (
    <Measure
      bounds
      onResize={(contentRect) => {
        if (contentRect.bounds) {
          const { height, width } = contentRect.bounds;
          setDimensions({ height, width });
        }
      }}
    >
      {({ measureRef }) => (
        <div
          ref={measureRef}
          id="map-container"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            backgroundColor: props.backgroundColor,
            left: 0,
            right: 0,
          }}
        >
          {dimensions.height > 0 && (
            <MapContainer
              {...props.mapOptions}
              whenReady={() => {
                onMessage({ tag: "MapReady", version: "1.0.0" });
              }}
              center={mapCenterPosition as LatLngExpression}
              maxZoom={maxZoom}
              minZoom={minZoom}
              zoom={zoom}
              style={{ width: "100%", height: dimensions.height }}
            >
              <EventHandle
                onMessage={onMessage}
                toLatLngLiteral={toLatLngLiteral}
                bounds={bounds}
                center={center}
                mapCenterPosition={mapCenterPosition}
                onMapClick={onMapClick}
              />
              <MapLayers mapLayers={mapLayers} />

              {ownPositionMarker ? (
                <OwnPositionMarker
                  mapmarker={ownPositionMarker}
                  onClick={(mapMarkerId) => {
                    onMessage({
                      tag: "onMapMarkerClicked",
                      mapMarkerId,
                    });
                  }}
                />
              ) : null}

              <MapMarkers
                mapMarkers={mapMarkers}
                onClick={(mapMarkerId) => {
                  onMessage({
                    tag: "onMapMarkerClicked",
                    mapMarkerId,
                  });
                }}
              />

              <MapShapes mapShapes={mapShapes} />
            </MapContainer>
          )}
        </div>
      )}
    </Measure>
  );
};
