import type { LatLngBounds, LatLngLiteral } from "leaflet";
import React, { useMemo } from "react";
import { Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { renderToString } from "react-dom/server";

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

const isMarkerOutBound = (
  markerPos: LatLngLiteral,
  bounds: LatLngBounds
): boolean => {
  return !bounds.contains(markerPos);
};

type Props = {
  markerPos: LatLngLiteral;
  centerPos?: LatLngLiteral;
  curBound?: LatLngBounds;
};

const MarkerIndicator = ({ markerPos, centerPos, curBound }: Props) => {
  const map = useMap();
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

  if (direction && intersectPoint && centerPos) {
    return (
      <Marker
        key="direction-indicator"
        position={{ lat: intersectPoint.y, lng: intersectPoint.x }}
        eventHandlers={{
          click: (event) => {
            // console.log({ event });
            map.flyTo(markerPos, map.getZoom());
          },
        }}
        icon={L.divIcon({
          html: renderToString(
            <div id="indicator-container">
              <div
                style={{
                  transform: `rotate(${-direction}rad)`,
                }}
                id="arrow-container"
              >
                <img
                  src="./arrow.png"
                  height="16px"
                  width="16px"
                  id="arrow"
                  alt="arrow"
                ></img>
              </div>
              <div style={{ position: "absolute", fontSize: 16 }}>🆘</div>
            </div>
          ),
          iconSize: [50, 50],
          iconAnchor: [25, 25],
          className: "clearMarkerContainer",
        })}
      />
    );
  }
  return null;
};

export default MarkerIndicator;
