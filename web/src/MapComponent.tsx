import L, {
  icon,
  LatLng,
  LatLngBounds,
  LatLngBoundsLiteral,
  LatLngExpression,
  LatLngLiteral,
  Map as LeafletMap,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useMemo, useState } from "react";
import {
  ImageOverlay,
  ImageOverlayProps,
  LayersControl,
  MapContainer,
  Marker,
  Polyline,
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

function intersect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
) {
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  let denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    return false;
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);

  return { x, y };
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

const isMarkerOutBound = (
  markerPos: LatLngLiteral,
  bounds: LatLngBounds
): boolean => {
  return !bounds.contains(markerPos);
};
interface Props extends LeafletProps {
  onClickMarkerPos?: boolean;
}

const markerPos: LatLngLiteral = {
  lat: 1.3270324624377665,
  lng: 103.85894757310048,
};
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

  const [centerPos, setCenterPos] = useState<LatLngLiteral | undefined>(
    undefined
  );
  const [curBound, setCurBound] = useState<LatLngBounds | undefined>(undefined);

  const direction = useMemo(() => {
    if (!curBound || !markerPos || !centerPos) {
      return undefined;
    }
    if (isMarkerOutBound(markerPos, curBound)) {
      return Math.atan2(
        markerPos.lat - centerPos.lat,
        markerPos.lng - centerPos.lng
      );
    }
    return undefined;
  }, [centerPos, curBound]);

  const intersectPoint = useMemo(() => {
    if (!curBound || !markerPos || !centerPos) {
      return undefined;
    }
    const bounds2 = curBound.pad(-0.05);
    if (isMarkerOutBound(markerPos, curBound)) {
      const southIntersect = intersect(
        markerPos.lng,
        markerPos.lat,
        centerPos.lng,
        centerPos.lat,
        bounds2.getSouthWest().lng,
        bounds2.getSouthWest().lat,
        bounds2.getSouthEast().lng,
        bounds2.getSouthEast().lat
      );

      if (southIntersect) {
        return southIntersect;
      }
      const eastIntersect = intersect(
        markerPos.lng,
        markerPos.lat,
        centerPos.lng,
        centerPos.lat,
        bounds2.getNorthEast().lng,
        bounds2.getNorthEast().lat,
        bounds2.getSouthEast().lng,
        bounds2.getSouthEast().lat
      );

      if (eastIntersect) {
        return eastIntersect;
      }

      const northIntersect = intersect(
        markerPos.lng,
        markerPos.lat,
        centerPos.lng,
        centerPos.lat,
        bounds2.getNorthWest().lng,
        bounds2.getNorthWest().lat,
        bounds2.getNorthEast().lng,
        bounds2.getNorthEast().lat
      );
      if (northIntersect) {
        return northIntersect;
      }

      const westIntersect = intersect(
        markerPos.lng,
        markerPos.lat,
        centerPos.lng,
        centerPos.lat,
        bounds2.getNorthWest().lng,
        bounds2.getNorthWest().lat,
        bounds2.getSouthWest().lng,
        bounds2.getSouthWest().lat
      );
      if (westIntersect) {
        return westIntersect;
      }
    }
    return undefined;
  }, [centerPos, curBound]);

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
                setCenterPos={setCenterPos}
                setCurBound={setCurBound}
              />
              <MapLayers mapLayers={mapLayers} />

              <OwnPositionMarker
                mapmarker={{
                  id: "own",
                  position: markerPos,
                  icon: "📍",
                }}
                onClick={(mapMarkerId) => {
                  onMessage({
                    tag: "onMapMarkerClicked",
                    mapMarkerId,
                  });
                }}
              />
              {/* 
              {curBound &&
              centerPos &&
              isMarkerOutBound(markerPos, curBound) ? (
                <Polyline positions={[markerPos, centerPos]} />
              ) : null} */}

              {direction && intersectPoint && centerPos ? (
                <Marker
                  key="direction-indicator"
                  position={{ lat: intersectPoint.y, lng: intersectPoint.x }}
                  icon={L.divIcon({
                    html: `<img src="./arrow.png" style="transform: rotate(${-direction}rad)"></img>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12],
                    className: "clearMarkerContainer",
                  })}
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
