import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Dimensions, Alert  } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MarkerContext } from '../global.js';
import { addMarker } from '../db/db.js';
import Svg, {Ellipse} from 'react-native-svg'

import * as Location from 'expo-location';

const alertDistance = 10;
let foregroundSubscription = null

export default function MapScreen(props) {
  let {markers, setMarkers} = useContext(MarkerContext);

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Make sure that foreground location tracking is not running
      foregroundSubscription?.remove();

      foregroundSubscription = await Location.watchPositionAsync(
        {
          // For better logs, we set the accuracy to the most sensitive option
          accuracy: Location.Accuracy.High,
        },
        location => {
          setPosition(JSON.parse(JSON.stringify(location.coords)));
        }
      );
      
    })();
  }, []);

  return (
  <MapView
    style={styles.map}
    initialRegion={props.initialRegion}
    onPress={(e) => 
        addMarker(markers, setMarkers, { latlng: e.nativeEvent.coordinate })
    }
  >
    <Marker coordinate={position}>
      {icon()}
    </Marker>
    

    {markers.map((marker, index) => {
      DistanceChecker(position, marker);


      return  <Marker
          key={ index }
          coordinate={marker.latlng}
          onPress={() => {
            props.navigation.navigate("Marker", { markerIndex: index });
          }}
        />
      }
    )}
      
      
  </MapView>);
}

function DistanceChecker(position, marker) {
  let distance = GetDistance(position, marker.latlng);

  if(marker.visited && distance > alertDistance) {
    marker.visited = false;
  }
  
  if(!marker.visited && distance - alertDistance <= 0) {
    Alert.alert(`You have almost arrived at the point!`, `latitude: ${marker.latlng.latitude}; longitude: ${marker.latlng.longitude};`);
    marker.visited = true;
  }
}

function GetDistance(first, second) {
  let lat1 = first.latitude;
  let lon1 = first.longitude;
  let lat2 = second.latitude;
  let lon2 = second.longitude;

  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusKm * c;
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

const styles = StyleSheet.create({
  map: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
});

const icon = () => {
  return(
    <Svg 
      height = {20}
      width = {20}
    >
    <Ellipse
      cx="10"
      cy="10"
      rx="10"
      ry="10"
      fill="blue"
      stroke="#fff"
      strokeWidth="2"
    />
    </Svg>

    )
}