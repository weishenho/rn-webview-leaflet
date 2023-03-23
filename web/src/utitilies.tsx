import { Dimensions, MapMarker as MapMarkerType } from "./types/model";
import type { LatLngExpression, PointExpression } from "leaflet";
import { DivIcon, divIcon } from "leaflet";
import React from "react";
import { Marker, Popup } from "react-leaflet";

export interface MapMarkersProps {
  mapMarkers: Array<MapMarkerType>;
  onClick: (markerId: string) => void;
  maxClusterRadius?: number;
}

export const createDivIcon = (mapMarker: MapMarkerType): DivIcon => {
  return divIcon({
    className: "clearMarkerContainer",
    html: mapMarker.animation
      ? getAnimatedHTMLString(
          mapMarker.icon || "📍",
          mapMarker.animation || null,
          mapMarker.size || [24, 24]
        )
      : getUnanimatedHTMLString(mapMarker.icon, mapMarker.size),
    iconAnchor: mapMarker.iconAnchor || [12, 24],
    iconSize: mapMarker.size,
  });
};

/*
  Get the HTML string containing the icon div, and animation parameters
  */
export const getAnimatedHTMLString = (
  icon: any,
  animation: any,
  size: PointExpression = [24, 24]
) => {
  return `<div class='animationContainer' style="
animation-name: ${animation.type ? animation.type : "bounce"};
animation-duration: ${animation.duration ? animation.duration : 1}s ;
animation-delay: ${animation.delay ? animation.delay : 0}s;
animation-direction: ${animation.direction ? animation.direction : "normal"};
animation-iteration-count: ${
    animation.iterationCount ? animation.iterationCount : "infinite"
  };
width:${
    //@ts-ignore
    size[0]
  }px;height:${
    //@ts-ignore
    size[1]
  }px;">
${getIconFromEmojiOrImageOrSVG(icon, size)}
</div>`;
};

const getUnanimatedHTMLString = (
  icon: any,
  size: PointExpression = [24, 24]
): string => {
  return `<div class='unanimatedIconContainer'>${getIconFromEmojiOrImageOrSVG(
    icon,
    size
  )}</div>`;
};

const getIconFromEmojiOrImageOrSVG = (icon: any, size: PointExpression) => {
  if (icon.includes("svg") || icon.includes("SVG")) {
    //@ts-ignore
    return ` <div style='font-size: ${Math.max(size[0], size[1])}px'>
${icon}
</div>`;
  } else if (icon.includes("//") || icon.includes("http") || icon.includes(".png")) {
    //@ts-ignore

    return `<img src="${icon}" style="width:${size[0]}px;height:${size[1]}px;">`;
  } else if (icon.includes("base64")) {
    //@ts-ignore

    return `<img src="${base64Image}" style="width:${size[0]}px;height:${size[1]}px;">`;
  } else {
    return `<div style='font-size: ${Math.max(
      //@ts-ignore
      size[0],
      //@ts-ignore
      size[1]
    )}px'>${icon}</div>`;
  }
};

export const MapMarker = ({
  mapMarker,
  onClick,
}: {
  mapMarker: MapMarkerType;
  onClick: (markerId: string) => void;
}) => {
  return (
    <Marker
      key={mapMarker.id}
      position={mapMarker.position as LatLngExpression}
      icon={createDivIcon(mapMarker)}
      eventHandlers={{
        click: () => {
          onClick(mapMarker.id);
        },
      }}
    >
      {mapMarker.title && <Popup>{mapMarker.title}</Popup>}
    </Marker>
  );
};
