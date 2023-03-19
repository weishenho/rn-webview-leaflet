# rn-webview-leaflet

A Leaflet map component for react native

## Installation

```sh
npm install rn-webview-leaflet
```

## Usage

and import like so

```javascript
import LeafletView from 'rn-webview-leaflet';
```

A typical example is shown below:

```javascript
<LeafletView
// The rest of your props, see the list below
/>
```

## Props

| property            | required | type                            | purpose                                                                                                                                                                                                         |
| ------------------- | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| onMessage   | required | function                        | This function receives messages in the form of a WebviewLeafletMessage object from the map                                                                                                                      |
| mapLayers           | optional | MapLayer array                  | An array of map layers                                                                                                                                                                                          |
| mapMarkers          | optional | MapMarker array                 | An array of map markers                                                                                                                                                                                         |
| mapShapes           | optional | MapShape[]                      | An array of map shapes                                                                                                                                                                                          |
| mapCenterPosition   | optional | {lat: [Lat], lng: [Lng]} object | The center position of the map. This coordinate will not be accurate if the map has been moved manually. However, calling the map's setMapCenterPosition function will cause the map to revert to this location |
| ownPositionMarker   | optional | Marker                          | Speical marker to indicate own position                                                                                                                                                        |     |
| zoom                | optional | number                          | Desired zoom value of the map                                                                                                                                                                                   |

### Example Marker

```javascript
ownPositionMarker={{
    id: '1',
    coords: {lat: 36.00, lng, -76.00},
    icon: "❤️",
    size: [24, 24],
    animation: {
      name: AnimationType.BOUNCE,
      duration: ".5",
      delay: 0,
      interationCount: INFINITE_ANIMATION_ITERATIONS
    }
  }}
```

## Credits

This project exist and take reference, thanks to the amazing work done by following repos:
1. [react-native-webview-leaflet](https://github.com/reggie3/react-native-webview-leaflet)
2. [react-native-leaflet](https://github.com/pavel-corsaghin/react-native-leaflet)
3. [expo-leaflet](https://github.com/Dean177/expo-leaflet)
4. [react-native-leaflet-ts](https://github.com/putteabrahamsson/react-native-leaflet-ts)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
