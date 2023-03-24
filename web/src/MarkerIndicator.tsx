import type { LatLngBounds, LatLngLiteral } from "leaflet";
import React, { useMemo } from "react";
import { Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { renderToString } from "react-dom/server";
import { point, lineString, polygon } from "@turf/helpers";
import bearing from "@turf/bearing";
import lineOverlap from "@turf/line-overlap";
import lineIntersect from "@turf/line-intersect";


const pad = (
  curBound: LatLngBounds,
  bufferRatioWidth: number,
  bufferRatioHeight: number
) => {
  const sw = curBound.getSouthWest();
  const ne = curBound.getNorthEast();
  const heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatioHeight;
  const widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatioWidth;

  return new L.LatLngBounds(
    new L.LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
    new L.LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer)
  );
};

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
      const point2 = point([centerPos.lng, centerPos.lat]);
      const point1 = point([markerPos.lng, markerPos.lat]);
      const angle = bearing(point1, point2) + 90;
      return angle;
    }
    return undefined;
  }, [centerPos, curBound, markerPos]);

  const intersectPoint = useMemo(() => {
    if (!curBound || !markerPos || !centerPos) {
      return undefined;
    }
    const bounds2 = pad(curBound, -0.04, -0.07);

    if (isMarkerOutBound(markerPos, curBound)) {
      const line1 = lineString([
        [markerPos.lng, markerPos.lat],
        [centerPos.lng, centerPos.lat],
      ]);

      const boundLines = [
        [
          [bounds2.getSouthWest().lng, bounds2.getSouthWest().lat],
          [bounds2.getSouthEast().lng, bounds2.getSouthEast().lat],
        ],
        [
          [bounds2.getNorthEast().lng, bounds2.getNorthEast().lat],
          [bounds2.getSouthEast().lng, bounds2.getSouthEast().lat],
        ],
        [
          [bounds2.getNorthWest().lng, bounds2.getNorthWest().lat],
          [bounds2.getNorthEast().lng, bounds2.getNorthEast().lat],
        ],
        [
          [bounds2.getNorthWest().lng, bounds2.getNorthWest().lat],
          [bounds2.getSouthWest().lng, bounds2.getSouthWest().lat],
        ],
      ];

      for (let line of boundLines) {
        const line2 = lineString(line);
        const intersectPoint = lineIntersect(line1, line2);
        if (
          Array.isArray(intersectPoint.features) &&
          intersectPoint.features.length > 0
        ) {
          const geo = intersectPoint.features[0].geometry.coordinates;
          return { x: geo[0], y: geo[1] };
        }
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
                  transform: `rotate(${direction}deg)`,
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
              <div id="icon-container">
                <img
                  src="cat.png"
                  style={{
                    width: 35,
                    height: 35,
                  }}
                  alt="cat"
                />
              </div>
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
