import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import LeafletView from 'rn-webview-leaflet';
export const DEFAULT_COORDINATE = {
  lat: 1.29027,
  lng: 103.851949,
} as const;

export default function App() {
  return (
    <View style={styles.container}>
      <LeafletView
        mapLayers={[
          {
            baseLayer: true,
            url: 'https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png',
            attribution:
              '<img src="https://www.onemap.gov.sg/docs/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>',
          },
        ]}
        mapCenterPosition={DEFAULT_COORDINATE}
        onMessage={(msg) => {
          // if (onMessage) {
          console.log(msg);
          // }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
