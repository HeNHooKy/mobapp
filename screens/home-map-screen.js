import React, { useContext } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MarkerContext } from '../global.js';
import { addMarker } from '../db/db.js';

export default function MapScreen(props) {
  let {markers, setMarkers} = useContext(MarkerContext);

  return (
  <MapView
    style={styles.map}
    initialRegion={props.initialRegion}
    onPress={(e) => 
        addMarker(markers, setMarkers, { latlng: e.nativeEvent.coordinate })
    }>
      {markers.map((marker, index) => 
        <Marker
          key={index}
          coordinate={marker.latlng}
          onPress={() => {
            props.navigation.navigate("Marker", { markerIndex: index });
            console.log(marker.latlng)
          }}
        />
      )}
  </MapView>);
}

const styles = StyleSheet.create({
  map: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
});