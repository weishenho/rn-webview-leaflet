/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import isEqual from 'lodash.isequal';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import LoadingIndicator from './LoadingIndicator';
import type { LeafletMapProps, LeafletProps } from './Leaflet.types';

const LEAFLET_HTML_SOURCE = Platform.select({
  ios: { uri: 'Leaflet.html' },
  android: { uri: 'file:///android_asset/custom/Leaflet.html' },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    // ...StyleSheet.absoluteFillObject,
  },
});

export const LeafletView = ({
  // loadingIndicator,
  onMessage,
  onMapLoad,
  ...rest
}: LeafletProps) => {
  const mapProps: LeafletMapProps = rest;
  const webViewRef = useRef<WebView>(null);

  const [isWebviewReady, setWebviewReady] = useState(false);
  const previousPropsRef = useRef<Partial<LeafletMapProps>>({});

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const data = event?.nativeEvent?.data;
      if (!data) {
        return;
      }
      try {
        const message = JSON.parse(data);

        if (message.tag === 'MapComponentMounted') {
          setWebviewReady(true);
          onMapLoad?.();
        }
        onMessage(message);
      } catch (error) {
        onMessage({
          tag: 'Error',
          error: { error, data: data },
        });
      }
    },
    [onMapLoad, onMessage]
  );

  useEffect(() => {
    if (!isWebviewReady) {
      return;
    }
    const previousProps = previousPropsRef.current;
    const newMapProps: Partial<LeafletMapProps> = {};
    if (!isEqual(mapProps.mapCenterPosition, previousProps.mapCenterPosition)) {
      newMapProps.mapCenterPosition = mapProps.mapCenterPosition;
    }
    if (!isEqual(mapProps.mapLayers, previousProps.mapLayers)) {
      newMapProps.mapLayers = mapProps.mapLayers;
    }
    if (!isEqual(mapProps.mapMarkers, previousProps.mapMarkers)) {
      newMapProps.mapMarkers = mapProps.mapMarkers;
    }
    if (!isEqual(mapProps.mapOptions, previousProps.mapOptions)) {
      newMapProps.mapOptions = mapProps.mapOptions;
    }
    if (!isEqual(mapProps.mapShapes, previousProps.mapShapes)) {
      newMapProps.mapShapes = mapProps.mapShapes;
    }
    if (mapProps.maxZoom !== previousProps.maxZoom) {
      newMapProps.maxZoom = mapProps.maxZoom;
    }
    if (mapProps.zoom !== previousProps.zoom) {
      newMapProps.zoom = mapProps.zoom;
    }

    if (mapProps.onClickMarkerPos !== previousProps.onClickMarkerPos) {
      newMapProps.onClickMarkerPos = mapProps.onClickMarkerPos;
    }
    previousPropsRef.current = {
      ...previousProps,
      ...mapProps,
    };
    const payload = JSON.stringify(newMapProps);
    webViewRef.current?.injectJavaScript(
      `window.postMessage(${payload}, '*');`
    );
  }, [
    isWebviewReady,
    mapProps,
    mapProps.mapCenterPosition,
    mapProps.mapLayers,
    mapProps.mapMarkers,
    mapProps.mapOptions,
    mapProps.mapShapes,
    mapProps.maxZoom,
    mapProps.zoom,
    mapProps.onClickMarkerPos,
  ]);

  return (
    <WebView
      ref={webViewRef}
      containerStyle={styles.container}
      onMessage={handleMessage}
      onError={(error: any) => {
        onMessage({ tag: 'Error', error });
      }}
      originWhitelist={['*']}
      renderLoading={() => {
        return <LoadingIndicator />;
      }}
      source={LEAFLET_HTML_SOURCE}
      allowFileAccess={true}
      allowUniversalAccessFromFileURLs={true}
      allowFileAccessFromFileURLs={true}
      domStorageEnabled={true}
      javaScriptEnabled={true}
      startInLoadingState={true}
      androidHardwareAccelerationDisabled={false}
    />
  );
};
